import { doctorPresets, site } from "@/config/doctorConfig";

/**
 * Booking requests.
 * Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID (see .env.example) and every request
 * is delivered to the doctor's Telegram as a formatted message. Without them the
 * request is validated and logged on the server, so the form still works in a demo.
 *
 * Spam guards (no third-party captcha): a honeypot field and in-memory
 * rate limits per IP and overall. Bots get a normal-looking success, so they learn nothing.
 * The limits live in this server process; behind several instances use a shared store instead.
 */

const WINDOW_MS = 10 * 60_000;
const PER_IP = 5;
const OVERALL = 40;

const hits = new Map<string, number[]>();
let overall: number[] = [];

function allow(ip: string, now: number): boolean {
  overall = overall.filter((t) => now - t < WINDOW_MS);
  const mine = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (mine.length >= PER_IP || overall.length >= OVERALL) {
    hits.set(ip, mine);
    return false;
  }
  mine.push(now);
  overall.push(now);
  hits.set(ip, mine);
  // Keep the map from growing without bound on a long-lived server.
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return true;
}

const clientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";

const makeRef = () => `QB-${Date.now().toString(36).slice(-5).toUpperCase()}`;

interface BookingBody {
  name?: unknown;
  phone?: unknown;
  contactMethod?: unknown;
  hasCt?: unknown;
  comment?: unknown;
  lang?: unknown;
  doctorId?: unknown;
  selection?: unknown;
  website?: unknown;
}

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(request: Request) {
  let body: BookingBody;
  try {
    body = (await request.json()) as BookingBody;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot filled: pretend it worked. (A fill-time check was dropped: it also caught people using autofill.)
  if (str(body.website, 200)) {
    return Response.json({ ok: true, ref: makeRef() });
  }

  if (!allow(clientIp(request), Date.now())) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const name = str(body.name, 80);
  const phone = str(body.phone, 20);
  const comment = str(body.comment, 600);
  const selection = str(body.selection, 400);
  const contactMethod = body.contactMethod === "call" ? "call" : "telegram";
  const hasCt = body.hasCt === true;
  const doctorId = str(body.doctorId, 32);

  if (name.length < 2) return Response.json({ ok: false, error: "name" }, { status: 422 });
  if (!/^\+998\d{9}$/.test(phone)) return Response.json({ ok: false, error: "phone" }, { status: 422 });

  const doctor = doctorPresets[doctorId as keyof typeof doctorPresets];
  const ref = makeRef();

  // Written for the doctor reading it on his phone: only what he needs to reply.
  // Telegram turns the +998 number into a tap-to-call link by itself; t.me/+number opens a chat with the patient.
  const text = [
    `<b>Yangi qabul so‘rovi</b> · ${ref}`,
    // Only a demo with several doctors needs to say which one was chosen.
    doctor && site.showDemoSwitcher ? `Shifokor: ${escapeHtml(doctor.name.uz)}` : "",
    `Ism: ${escapeHtml(name)}`,
    `Telefon: ${phone}`,
    contactMethod === "call"
      ? "Aloqa: qo‘ng‘iroq qilishni so‘radi"
      : `Aloqa: Telegram · <a href="https://t.me/${phone}">Telegramda yozish</a>`,
    // The form only asks about a 3D scan for treatments that need one.
    hasCt ? "3D KT: bor" : "",
    selection ? `Tanlov: ${escapeHtml(selection)}` : "",
    comment ? `Izoh: ${escapeHtml(comment)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (token && chatId) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", link_preview_options: { is_disabled: true } }),
      });
      // Telegram explains a refusal (wrong chat id, bot never started...): keep its words in the server log.
      if (!res.ok) throw new Error(`telegram ${res.status}: ${await res.text().catch(() => "")}`);
    } catch (err) {
      console.error("[booking] Telegram delivery failed", err);
      return Response.json({ ok: false, error: "delivery" }, { status: 502 });
    }
  } else if (process.env.NODE_ENV === "production") {
    // Never tell a patient "I'll contact you" when the request can't reach the doctor: fail, so the form offers Telegram.
    console.error("[booking] Telegram delivery is not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)");
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  } else {
    console.info("[booking] New request (Telegram delivery not configured)\n" + text.replace(/<\/?b>/g, ""));
  }

  return Response.json({ ok: true, ref });
}
