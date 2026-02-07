import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function detectPlatform(url: string): string {
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/spotify\.com/i.test(url)) return "spotify";
  if (/soundcloud\.com/i.test(url)) return "soundcloud";
  if (/vimeo\.com/i.test(url)) return "vimeo";
  if (/tiktok\.com/i.test(url)) return "tiktok";
  if (/twitter\.com|x\.com/i.test(url)) return "twitter";
  if (/instagram\.com/i.test(url)) return "instagram";
  if (/facebook\.com|fb\.watch/i.test(url)) return "facebook";
  return "unknown";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get auth token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with user's token for auth check
    const supabaseUser = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { url, mode, quality, is_playlist, track_count } = body;

    if (!url || !mode || !quality) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: url, mode, quality" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const platform = detectPlatform(url);
    console.log(`Download request from user ${user.id}: ${platform} - ${url} [${mode}/${quality}]`);

    // Use service role to insert into download_history
    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    const { data: record, error: insertError } = await supabaseAdmin
      .from("download_history")
      .insert({
        user_id: user.id,
        url,
        title: `${platform} download`,
        platform,
        mode,
        quality,
        is_playlist: is_playlist || false,
        status: "processing",
        track_count: track_count || 1,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create download record" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // NOTE: Actual yt-dlp/spotdl processing requires a Python server.
    // This function logs the request and returns a placeholder response.
    // In production, this would forward to a processing server.

    // Update status to completed (placeholder)
    await supabaseAdmin
      .from("download_history")
      .update({
        status: "completed",
        title: `${platform} ${mode} - ${quality}`,
      })
      .eq("id", record.id);

    console.log(`Download record created: ${record.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        download_id: record.id,
        platform,
        message:
          "Download request logged. A processing backend (Python server with yt-dlp/spotdl) is required to generate actual download links.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
