import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const JSON_HEADERS = { ...corsHeaders, "Content-Type": "application/json" };

// ---------- Helpers ----------

const PLATFORM_PATTERNS: [RegExp, string, string[]][] = [
  [/(?:youtube\.com\/(?:watch|playlist|shorts)|youtu\.be\/)/i, "youtube", ["video", "audio"]],
  [/open\.spotify\.com\/(track|album|playlist)/i, "spotify", ["audio"]],
  [/soundcloud\.com\//i, "soundcloud", ["audio"]],
  [/vimeo\.com\//i, "vimeo", ["video", "audio"]],
  [/tiktok\.com\//i, "tiktok", ["video", "audio"]],
  [/(?:twitter\.com|x\.com)\//i, "twitter", ["video", "audio"]],
  [/instagram\.com\/(p|reel|tv)\//i, "instagram", ["video", "audio"]],
  [/facebook\.com\/.*\/videos|fb\.watch\//i, "facebook", ["video", "audio"]],
  [/dailymotion\.com\//i, "dailymotion", ["video", "audio"]],
  [/twitch\.tv\//i, "twitch", ["video", "audio"]],
  [/reddit\.com\//i, "reddit", ["video", "audio"]],
];

function detectPlatform(url: string): { name: string; supportedModes: string[] } {
  for (const [pattern, name, modes] of PLATFORM_PATTERNS) {
    if (pattern.test(url)) return { name, supportedModes: modes };
  }
  return { name: "unknown", supportedModes: ["video", "audio"] };
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function isPlaylistUrl(url: string): boolean {
  return /[?&]list=|\/playlist\//i.test(url) || /open\.spotify\.com\/(album|playlist)/i.test(url);
}

const VALID_MODES = ["video", "audio"];
const VALID_VIDEO_QUALITIES = ["4K", "2K", "1080p", "720p", "480p", "360p"];
const VALID_AUDIO_QUALITIES = ["FLAC", "WAV", "AAC", "MP3 320", "MP3 256", "MP3 128"];

function isValidQuality(mode: string, quality: string): boolean {
  return mode === "video"
    ? VALID_VIDEO_QUALITIES.includes(quality)
    : VALID_AUDIO_QUALITIES.includes(quality);
}

// ---------- Route handlers ----------

async function handleCreateDownload(req: Request) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

  // Auth check
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing authorization header" }), {
      status: 401, headers: JSON_HEADERS,
    });
  }

  const supabaseUser = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
  if (authError || !user) {
    console.error("Auth error:", authError?.message);
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: JSON_HEADERS,
    });
  }

  // Parse and validate body
  const body = await req.json();
  const { url, mode, quality, is_playlist, track_count } = body;

  if (!url || !mode || !quality) {
    return new Response(
      JSON.stringify({ error: "Missing required fields: url, mode, quality" }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  if (!isValidUrl(url)) {
    return new Response(
      JSON.stringify({ error: "Invalid URL. Please provide a valid http/https URL." }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  if (!VALID_MODES.includes(mode)) {
    return new Response(
      JSON.stringify({ error: `Invalid mode. Must be one of: ${VALID_MODES.join(", ")}` }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  if (!isValidQuality(mode, quality)) {
    const validOptions = mode === "video" ? VALID_VIDEO_QUALITIES : VALID_AUDIO_QUALITIES;
    return new Response(
      JSON.stringify({ error: `Invalid quality for ${mode}. Options: ${validOptions.join(", ")}` }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  const platform = detectPlatform(url);

  // Check if requested mode is supported by platform
  if (!platform.supportedModes.includes(mode)) {
    return new Response(
      JSON.stringify({
        error: `${platform.name} only supports: ${platform.supportedModes.join(", ")}`,
      }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  const detectedPlaylist = is_playlist || isPlaylistUrl(url);

  console.log(
    `[download] user=${user.id} platform=${platform.name} mode=${mode} quality=${quality} playlist=${detectedPlaylist} url=${url}`,
  );

  // Rate limit: max 20 downloads per hour per user
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: recentCount } = await supabaseAdmin
    .from("download_history")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", oneHourAgo);

  if ((recentCount ?? 0) >= 20) {
    console.warn(`[rate-limit] user=${user.id} hit 20/hr limit`);
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Max 20 downloads per hour." }),
      { status: 429, headers: JSON_HEADERS },
    );
  }

  // Insert download record
  const { data: record, error: insertError } = await supabaseAdmin
    .from("download_history")
    .insert({
      user_id: user.id,
      url,
      title: `${platform.name} ${mode} — ${quality}`,
      platform: platform.name,
      mode,
      quality,
      is_playlist: detectedPlaylist,
      status: "pending",
      track_count: detectedPlaylist ? (track_count || 1) : 1,
    })
    .select()
    .single();

  if (insertError) {
    console.error("[insert-error]", insertError);
    return new Response(
      JSON.stringify({ error: "Failed to create download record" }),
      { status: 500, headers: JSON_HEADERS },
    );
  }

  // ─── Processing placeholder ───
  // In production, this would dispatch to a worker queue (e.g. Python server
  // running yt-dlp / spotdl) and return immediately. The worker would update
  // the record's status and download_url when done.
  //
  // For now we simulate a completed download after a short delay.

  await supabaseAdmin
    .from("download_history")
    .update({ status: "completed" })
    .eq("id", record.id);

  console.log(`[download] record=${record.id} status=completed`);

  return new Response(
    JSON.stringify({
      success: true,
      download: {
        id: record.id,
        platform: platform.name,
        mode,
        quality,
        is_playlist: detectedPlaylist,
        track_count: detectedPlaylist ? (track_count || 1) : 1,
        status: "completed",
        // In production this would be a real download URL
        download_url: null,
        message: "Download request processed. Connect a processing server (yt-dlp/spotdl) to generate real download links.",
      },
    }),
    { status: 200, headers: JSON_HEADERS },
  );
}

async function handleGetHistory(req: Request) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing authorization header" }), {
      status: 401, headers: JSON_HEADERS,
    });
  }

  const supabaseUser = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: JSON_HEADERS,
    });
  }

  // Fetch user's download history (most recent first, max 50)
  const { data: history, error: fetchError } = await supabaseUser
    .from("download_history")
    .select("id, url, title, platform, mode, quality, is_playlist, status, track_count, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (fetchError) {
    console.error("[history-error]", fetchError);
    return new Response(
      JSON.stringify({ error: "Failed to fetch download history" }),
      { status: 500, headers: JSON_HEADERS },
    );
  }

  return new Response(
    JSON.stringify({ success: true, downloads: history }),
    { status: 200, headers: JSON_HEADERS },
  );
}

// ---------- Router ----------

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method === "POST") {
      return await handleCreateDownload(req);
    }

    if (req.method === "GET") {
      return await handleGetHistory(req);
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST to download, GET for history." }),
      { status: 405, headers: JSON_HEADERS },
    );
  } catch (error) {
    console.error("[unexpected-error]", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: JSON_HEADERS },
    );
  }
});
