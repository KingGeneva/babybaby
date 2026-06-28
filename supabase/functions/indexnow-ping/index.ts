// IndexNow ping endpoint — submits URLs to Bing/Yandex/etc via IndexNow protocol.
// Called from the client via supabase.functions.invoke("indexnow-ping").

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const HOST = "babybaby.org";
const KEY = "8f2a9c4e7b1d6038f5a2c9e84b7d1602";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS = 10_000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body: { urls?: unknown } = {};
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawUrls = Array.isArray(body.urls) ? body.urls : [];
    const seen = new Set<string>();
    const urls: string[] = [];
    for (const u of rawUrls) {
      if (typeof u !== "string") continue;
      const trimmed = u.trim();
      if (!trimmed) continue;
      let parsed: URL;
      try {
        parsed = new URL(trimmed);
      } catch {
        continue;
      }
      if (parsed.hostname !== HOST && parsed.hostname !== `www.${HOST}`) continue;
      const normalized = `https://${HOST}${parsed.pathname}${parsed.search}`;
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      urls.push(normalized);
      if (urls.length >= MAX_URLS) break;
    }

    if (urls.length === 0) {
      return new Response(
        JSON.stringify({ success: false, submitted: 0, error: "No valid URLs for host" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    };

    let upstreamStatus = 0;
    let upstreamText = "";
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });
      upstreamStatus = res.status;
      upstreamText = (await res.text()).slice(0, 500);
    } catch (e) {
      return new Response(
        JSON.stringify({
          success: false,
          submitted: urls.length,
          error: e instanceof Error ? e.message : String(e),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // IndexNow returns 200 or 202 on success.
    const ok = upstreamStatus === 200 || upstreamStatus === 202;
    return new Response(
      JSON.stringify({
        success: ok,
        submitted: urls.length,
        upstreamStatus,
        upstreamBody: upstreamText,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("indexnow-ping error:", msg);
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
