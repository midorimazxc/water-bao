import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  // ✅ CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
  };

  // ✅ ОБРАБОТКА preflight (самое важное)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  try {
    const { message } = await req.json();

    const BOT_TOKEN = Deno.env.get("BOT_TOKEN");
    const CHAT_ID = Deno.env.get("CHAT_ID");

    if (!BOT_TOKEN || !CHAT_ID) {
      return new Response("No secrets", { status: 500, headers });
    }

    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
        }),
      }
    );

    const data = await tgRes.text();

    return new Response(data, {
      headers: { ...headers, "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(err.message, {
      status: 500,
      headers,
    });
  }
});