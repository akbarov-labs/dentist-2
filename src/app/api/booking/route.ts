import { doctorPresets } from "@/config/doctorConfig";

/**
 * Booking requests.
 * Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID (see .env.example) and every request
 * is delivered to the doctor's Telegram as a formatted message. Without them the
 * request is validated and logged on the server, so the form still works in a demo.
 */

interface BookingBody {
  name?: unknown;
  phone?: unknown;
  contactMethod?: unknown;
  hasCt?: unknown;
  comment?: unknown;
  lang?: unknown;
  doctorId?: unknown;
  selection?: unknown;
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
  const ref = `QB-${Date.now().toString(36).slice(-5).toUpperCase()}`;

  const text = [
    `<b>Yangi qabul so‘rovi</b> · ${ref}`,
    doctor ? `Shifokor: ${escapeHtml(doctor.name.uz)}` : "",
    `Ism: ${escapeHtml(name)}`,
    `Telefon: ${phone}`,
    `Aloqa: ${contactMethod === "call" ? "Qo‘ng‘iroq" : "Telegram"}`,
    `3D KT: ${hasCt ? "bor" : "yo‘q"}`,
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
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
      });
      if (!res.ok) throw new Error(`telegram ${res.status}`);
    } catch (err) {
      console.error("[booking] Telegram delivery failed", err);
      return Response.json({ ok: false, error: "delivery" }, { status: 502 });
    }
  } else {
    console.info("[booking] New request (Telegram delivery not configured)\n" + text.replace(/<\/?b>/g, ""));
  }

  return Response.json({ ok: true, ref });
}
