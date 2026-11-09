import { createClient } from "npm:@supabase/supabase-js@2";

const NOTIFY_TO = "ahlyajimenez.artco@gmail.com";

const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );

Deno.serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = await req.json();
  if (payload.type !== "INSERT" || !payload.record) {
    return new Response("Ignored", { status: 200 });
  }
  const r = payload.record;

  // Photos are in a private bucket, so create links that expire in 7 days.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const photoLinks: string[] = [];
  for (const path of r.photo_paths ?? []) {
    const { data } = await supabase.storage
      .from("commission-photos")
      .createSignedUrl(path, 60 * 60 * 24 * 7);
    if (data?.signedUrl) photoLinks.push(data.signedUrl);
  }

  const html = `
    <h2>New commission request</h2>
    <p><strong>Name:</strong> ${escapeHtml(r.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(r.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(r.phone || "—")}</p>
    <p><strong>Horse name(s):</strong> ${escapeHtml(r.horse_names || "—")}</p>
    <p><strong>Message:</strong><br>${escapeHtml(r.message).replace(/\n/g, "<br>")}</p>
    <p><strong>Reference photos (links expire in 7 days):</strong></p>
    ${
    photoLinks.length
      ? "<ul>" +
        photoLinks.map((u, i) => `<li><a href="${escapeHtml(u)}">Photo ${i + 1}</a></li>`).join("") +
        "</ul>"
      : "<p>None</p>"
  }`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: Deno.env.get("FROM_EMAIL") ?? "Equus & Ink <onboarding@resend.dev>",
      to: [NOTIFY_TO],
      reply_to: r.email,
      subject: `New commission request from ${String(r.name).slice(0, 80)}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return new Response("Email failed", { status: 502 });
  }
  return new Response("OK", { status: 200 });
});
