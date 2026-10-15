import type { DoctorProfile, Lang } from "@/config/doctorConfig";

/** 7900000 -> "7 900 000" (narrow no-break spaces keep numbers on one line). */
export function formatUZS(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** 7900000 -> "7.9 mln" / "7,9 млн" for compact display. */
export function formatMillions(value: number, lang: Lang): string {
  const m = value / 1_000_000;
  const n = Number.isInteger(m) ? m.toString() : m.toFixed(1);
  return lang === "ru" ? `${n.replace(".", ",")} млн` : `${n} mln`;
}

export function formatUSD(uzs: number, rate: number): string {
  const usd = Math.round(uzs / rate / 10) * 10;
  return `$${usd.toLocaleString("en-US")}`;
}

export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function telegramLink(username: string, text?: string): string {
  const base = `https://t.me/${username.replace(/^@/, "")}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function instagramLink(username: string): string {
  return `https://instagram.com/${username.replace(/^@/, "")}`;
}

export function mapLinks(doctor: DoctorProfile, lang: Lang) {
  const { lat, lng } = doctor.address;
  return {
    yandex: `https://yandex.uz/maps/?pt=${lng},${lat}&z=17&l=map`,
    gis: `https://2gis.uz/tashkent/geo/${lng},${lat}`,
    // Opens the Yandex Go app with the destination pre-filled (falls back to the web page).
    taxi: `https://3.redirect.appmetrica.yandex.com/route?end-lat=${lat}&end-lon=${lng}&appmetrica_tracking_id=1178268795219780156`,
    google: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
    embed: `https://yandex.uz/map-widget/v1/?ll=${lng},${lat}&z=16&pt=${lng},${lat},pm2dgm&lang=${lang === "ru" ? "ru_RU" : "uz_UZ"}`,
  };
}

/** Formats raw digits after +998 as "90 123 45 67". */
export function formatUzPhone(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 9);
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  return parts.join(" ");
}

/** Is the practice open right now, in Tashkent time (UTC+5)? */
export function isOpenNow(doctor: DoctorProfile, now = new Date()): boolean {
  const tashkent = new Date(now.getTime() + (now.getTimezoneOffset() + 300) * 60_000);
  const day = tashkent.getDay() === 0 ? 7 : tashkent.getDay();
  const hour = tashkent.getHours() + tashkent.getMinutes() / 60;
  return doctor.hours.openDays.includes(day) && hour >= doctor.hours.openHour && hour < doctor.hours.closeHour;
}
