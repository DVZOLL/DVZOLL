const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface DownloadRequest {
  url: string;
  mode: "video" | "audio";
  quality: string;
}

// Validate URL is from a supported platform
function validateUrl(url: string): { valid: boolean; platform: string } {
  const patterns: Record<string, RegExp> = {
    youtube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/i,
    spotify: /^https?:\/\/(open\.)?spotify\.com\/.+/i,
    twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/i,
    tiktok: /^https?:\/\/(www\.|vm\.)?tiktok\.com\/.+/i,
    instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/i,
    soundcloud: /^https?:\/\/(www\.)?soundcloud\.com\/.+/i,
    reddit: /^https?:\/\/(www\.)?reddit\.com\/.+/i,
  };

  for (const [platform, regex] of Object.entries(patterns)) {
    if (regex.test(url)) return { valid: true, platform };
  }
  return { valid: false, platform: "unknown" };
}

// Fetch metadata from YouTube oEmbed (free, no API key)
async function fetchYouTubeMetadata(url: string) {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oembedUrl);
    if (!res.ok) {
      await res.text();
      return null;
    }
    const data = await res.json();
    return {
      title: data.title || "Unknown",
      author: data.author_name || "Unknown",
      thumbnail: data.thumbnail_url || null,
      provider: "YouTube",
    };
  } catch (e) {
    console.error("oEmbed fetch failed:", e);
    return null;
  }
}

// Generate a cobalt.tools redirect URL for the user
function getCobaltRedirectUrl(url: string): string {
  // cobalt.tools accepts URLs via hash
  return `https://cobalt.tools/#${encodeURIComponent(url)}`;
}

// Get quality info for display
function getQualityInfo(mode: string, quality: string) {
  if (mode === "video") {
    return {
      format: "MP4 (H.264)",
      resolution: quality,
      estimatedSize: quality === "4K" ? "~500MB-2GB" :
                     quality === "2K" ? "~300MB-800MB" :
                     quality === "1080p" ? "~150MB-500MB" :
                     quality === "720p" ? "~80MB-250MB" : "~50MB-150MB",
    };
  }
  return {
    format: quality.includes("FLAC") ? "FLAC (Lossless)" :
            quality.includes("WAV") ? "WAV (Uncompressed)" :
            quality.includes("AAC") ? "AAC" : "MP3",
    bitrate: quality.includes("320") ? "320kbps" :
             quality.includes("FLAC") ? "Lossless" : "Variable",
    estimatedSize: quality.includes("FLAC") ? "~30-80MB" :
                   quality.includes("WAV") ? "~50-150MB" : "~5-15MB",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { url, mode, quality } = (await req.json()) as DownloadRequest;

    // Input validation
    if (!url || typeof url !== "string" || url.length > 2000) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid or missing URL" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!["video", "audio"].includes(mode)) {
      return new Response(
        JSON.stringify({ success: false, error: "Mode must be 'video' or 'audio'" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { valid, platform } = validateUrl(url);
    if (!valid) {
      return new Response(
        JSON.stringify({ success: false, error: "Unsupported platform. Try YouTube, Spotify, Twitter, TikTok, Instagram, SoundCloud, or Reddit." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing: platform=${platform}, mode=${mode}, quality=${quality}, url=${url}`);

    // Fetch real metadata for YouTube
    const isYouTube = platform === "youtube";
    const metadata = isYouTube
      ? await fetchYouTubeMetadata(url)
      : { title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Media`, author: "Unknown", thumbnail: null, provider: platform };

    // Build response with cobalt redirect for actual download
    const cobaltUrl = getCobaltRedirectUrl(url);
    const qualityInfo = getQualityInfo(mode, quality);

    const response = {
      success: true,
      metadata: metadata || {
        title: "Media",
        author: "Unknown",
        thumbnail: null,
        provider: platform,
      },
      download: {
        // Redirect to cobalt.tools for actual download
        url: cobaltUrl,
        method: "redirect",
        platform,
        qualityInfo,
        instructions: `Open the link to download via Cobalt Tools. Select ${mode === "video" ? quality : quality} quality.`,
      },
    };

    console.log("Response:", JSON.stringify(response));

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Download function error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
