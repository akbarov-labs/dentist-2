"use client";

import { ArrowRight, Calculator, Car, CheckCircle2, Clock3, Loader2, Map as MapIcon, MapPin, Navigation, Phone, Send, Sparkles, X } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { useSite } from "@/context/SiteContext";
import { buildTelegramText, computeEstimate, priceRange, selectionLines } from "@/lib/estimate";
import { formatUzPhone, mapLinks, phoneHref, telegramLink } from "@/lib/format";
import { Reveal } from "@/components/ui/Reveal";
import { btnPrimary } from "@/components/ui/styles";

type Status = "idle" | "sending" | "success" | "error";
type ContactMethod = "call" | "telegram";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="text-[14px] font-medium text-ink">{label}</legend>
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-full border border-line bg-alabaster p-1">
        {options.map((o) => (
          <label
            key={o.id}
            className={`flex h-10 cursor-pointer items-center justify-center rounded-full text-[14px] transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-bronze ${
              value === o.id ? "bg-emerald text-alabaster shadow-sm" : "text-ink-soft hover:text-ink"
            }`}
          >
            <input type="radio" name={name} value={o.id} checked={value === o.id} onChange={() => onChange(o.id)} className="sr-only" />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Booking() {
  const { t, doctor, lang, prefill, setPrefill } = useSite();
  const [name, setName] = useState("");
  const [digits, setDigits] = useState("");
  const [method, setMethod] = useState<ContactMethod>("telegram");
  const [hasCt, setHasCt] = useState<"yes" | "no">("no");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [refNo, setRefNo] = useState("");

  // Carry the calculator's CT answer into the form whenever a new estimate arrives.
  const [seenPrefill, setSeenPrefill] = useState(prefill);
  if (prefill !== seenPrefill) {
    setSeenPrefill(prefill);
    if (prefill?.kind === "calculator") setHasCt(prefill.selection.hasCt ? "yes" : "no");
  }

  const links = mapLinks(doctor, lang);
  const tgText = buildTelegramText(doctor, lang, t, prefill);
  const service = prefill?.kind === "service" ? doctor.services.find((s) => s.id === prefill.serviceId) : undefined;

  const summary = (() => {
    if (prefill?.kind === "calculator") {
      const l = selectionLines(prefill.selection, t);
      const est = computeEstimate(doctor, prefill.selection, lang);
      return { lines: [l.problem, l.material, `${t.calc.ctLine}: ${l.ct}`], price: priceRange(est, t) };
    }
    if (service) return { lines: [service.title[lang]], price: "" };
    return null;
  })();

  const onPhone = (raw: string) => {
    let d = raw.replace(/\D/g, "");
    if (d.length > 9 && d.startsWith("998")) d = d.slice(3);
    setDigits(d.slice(0, 9));
    if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = t.booking.errName;
    if (digits.length !== 9) next.phone = t.booking.errPhone;
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(next.name ? "bk-name" : "bk-phone")?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: `+998${digits}`,
          contactMethod: method,
          hasCt: hasCt === "yes",
          comment: comment.trim(),
          lang,
          doctorId: doctor.id,
          selection: summary ? [...summary.lines, summary.price].filter(Boolean).join(" · ") : "",
        }),
      });
      const data = (await res.json()) as { ok: boolean; ref?: string };
      if (!res.ok || !data.ok) throw new Error("rejected");
      setRefNo(data.ref ?? "");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setName("");
    setDigits("");
    setComment("");
    setStatus("idle");
    setPrefill(null);
  };

  const inputCls = (err?: string) =>
    `mt-2 h-12 w-full rounded-[12px] border bg-alabaster px-4 text-[16px] text-ink placeholder:text-[#7c8085] transition focus:border-emerald focus:bg-card focus:outline-none focus:ring-4 focus:ring-emerald/10 ${
      err ? "border-[#b4432f]" : "border-line"
    }`;

  return (
    <section id="booking" aria-labelledby="booking-title" className="border-t border-line bg-stone/60 py-20 pb-28 md:py-28">
      <div className="shell">
        <Reveal className="max-w-[680px]">
          <h2 id="booking-title" className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink sm:text-[46px]">
            {t.booking.title}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">{t.booking.sub}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Form */}
          <Reveal className="lg:col-span-7">
            <div className="rounded-[20px] border border-line bg-card p-6 shadow-[var(--shadow-soft)] sm:p-9 lg:sticky lg:top-24">
              {status === "success" ? (
                <div className="hud-in flex min-h-[460px] flex-col items-start justify-center" role="status">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-soft text-emerald">
                    <CheckCircle2 size={28} strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-6 font-display text-[30px] leading-tight text-ink">{t.booking.successTitle}</h3>
                  <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-muted">
                    {t.booking.successBody} <span className="font-mono text-ink">{refNo}</span>
                  </p>
                  {summary ? (
                    <p className="mt-5 rounded-[12px] bg-alabaster px-4 py-3 font-mono text-[13px] leading-relaxed text-ink-soft">
                      {summary.lines.join(" · ")}
                      {summary.price ? <><br />{summary.price}</> : null}
                    </p>
                  ) : null}
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href={telegramLink(doctor.contact.telegram, tgText)} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                      <Send size={16} strokeWidth={1.7} /> {t.cta.telegram}
                    </a>
                    <button type="button" onClick={reset} className="inline-flex h-12 items-center rounded-full border border-line px-6 text-[15px] text-ink transition hover:bg-stone">
                      {t.booking.successAgain}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="space-y-6">
                  {summary ? (
                    <div className="hud-in flex items-start justify-between gap-4 rounded-[16px] border border-emerald/20 bg-emerald-soft/70 p-4">
                      <div className="flex items-start gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald text-alabaster">
                          {prefill?.kind === "calculator" ? <Calculator size={16} strokeWidth={1.7} /> : <Sparkles size={16} strokeWidth={1.7} />}
                        </span>
                        <div>
                          <p className="font-mono text-[10.5px] tracking-[0.14em] text-emerald uppercase">
                            {prefill?.kind === "calculator" ? t.booking.selected : t.booking.service}
                          </p>
                          <p className="mt-1 text-[14.5px] leading-snug text-ink">{summary.lines.join(" · ")}</p>
                          {summary.price ? <p className="mt-1 font-mono text-[13px] text-emerald">{summary.price}</p> : null}
                        </div>
                      </div>
                      <button type="button" onClick={() => setPrefill(null)} aria-label={t.booking.remove} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-soft transition hover:bg-card">
                        <X size={16} strokeWidth={1.7} />
                      </button>
                    </div>
                  ) : null}

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="bk-name" className="text-[14px] font-medium text-ink">
                        {t.booking.name}
                      </label>
                      <input
                        id="bk-name"
                        name="name"
                        autoComplete="given-name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
                        }}
                        placeholder={t.booking.namePh}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "bk-name-err" : undefined}
                        className={inputCls(errors.name)}
                      />
                      {errors.name ? (
                        <p id="bk-name-err" className="mt-2 text-[13px] text-[#9e3a28]">
                          {errors.name}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="bk-phone" className="text-[14px] font-medium text-ink">
                        {t.booking.phone}
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute top-1/2 left-4 mt-1 -translate-y-1/2 font-mono text-[15px] text-ink-soft">+998</span>
                        <input
                          id="bk-phone"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel-national"
                          value={formatUzPhone(digits)}
                          onChange={(e) => onPhone(e.target.value)}
                          placeholder="90 123 45 67"
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? "bk-phone-err" : undefined}
                          className={`${inputCls(errors.phone)} pl-[4.25rem] font-mono`}
                        />
                      </div>
                      {errors.phone ? (
                        <p id="bk-phone-err" className="mt-2 text-[13px] text-[#9e3a28]">
                          {errors.phone}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Segmented
                      label={t.booking.contact}
                      value={method}
                      onChange={setMethod}
                      options={[
                        { id: "call", label: t.booking.contactCall },
                        { id: "telegram", label: t.booking.contactTg },
                      ]}
                    />
                    <Segmented
                      label={t.booking.ct}
                      value={hasCt}
                      onChange={setHasCt}
                      options={[
                        { id: "yes", label: t.booking.ctYes },
                        { id: "no", label: t.booking.ctNo },
                      ]}
                    />
                  </div>

                  <div>
                    <label htmlFor="bk-comment" className="text-[14px] font-medium text-ink">
                      {t.booking.comment}
                    </label>
                    <textarea
                      id="bk-comment"
                      name="comment"
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t.booking.commentPh}
                      className="mt-2 w-full resize-none rounded-[12px] border border-line bg-alabaster px-4 py-3 text-[16px] text-ink placeholder:text-[#7c8085] transition focus:border-emerald focus:bg-card focus:ring-4 focus:ring-emerald/10 focus:outline-none"
                    />
                  </div>

                  {status === "error" ? (
                    <p role="alert" className="rounded-[12px] border border-[#b4432f]/30 bg-[#fbeeea] px-4 py-3 text-[14px] text-[#8a3324]">
                      {t.booking.errSubmit}
                    </p>
                  ) : null}

                  <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-[36ch] text-[13px] leading-relaxed text-muted">{t.booking.privacy}</p>
                    <button type="submit" disabled={status === "sending"} className={`${btnPrimary} sm:min-w-[220px]`}>
                      {status === "sending" ? (
                        <>
                          <Loader2 size={17} strokeWidth={1.8} className="animate-spin" /> {t.booking.sending}
                        </>
                      ) : (
                        <>
                          {t.booking.submit} <ArrowRight size={17} strokeWidth={1.7} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          {/* Concierge + map */}
          <div className="space-y-6 lg:col-span-5">
            <Reveal delay={100}>
              <div className="relative overflow-hidden rounded-[20px] bg-emerald p-6 text-alabaster sm:p-8">
                <h3 className="font-display text-[22px] leading-tight">{t.booking.tgTitle}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-alabaster/75">{t.booking.tgBody}</p>
                <p className="mt-5 rounded-[16px] rounded-bl-[4px] bg-alabaster/10 px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line text-alabaster/90">
                  {tgText}
                </p>
                <a
                  href={telegramLink(doctor.contact.telegram, tgText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-alabaster px-6 py-3 text-center text-[15px] leading-tight font-medium text-emerald transition hover:bg-white active:translate-y-px"
                >
                  <Send size={16} strokeWidth={1.7} className="shrink-0" /> {t.booking.tgTitle}
                </a>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="overflow-hidden rounded-[20px] border border-line bg-card">
                <div className="relative aspect-[16/10] bg-stone">
                  <iframe
                    key={`${doctor.id}-${lang}`}
                    src={links.embed}
                    title={t.booking.mapLabel}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full grayscale-[60%] sepia-[12%]"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-mono text-[11px] tracking-[0.14em] text-bronze-deep uppercase">{t.booking.mapTitle}</h3>
                  <p className="mt-2 flex items-start gap-2 text-[16px] leading-snug text-ink">
                    <MapPin size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-emerald" />
                    {doctor.address.full[lang]}
                  </p>
                  <p className="mt-1 pl-[26px] text-[13.5px] text-muted">{doctor.address.landmark[lang]}</p>
                  <p className="mt-3 flex items-center gap-2 pl-0.5 text-[14px] text-ink-soft">
                    <Clock3 size={16} strokeWidth={1.6} className="shrink-0 text-emerald" />
                    {doctor.hours.days[lang]} · <span className="font-mono">{doctor.hours.time}</span>
                  </p>
                  <a href={phoneHref(doctor.contact.phone)} className="mt-3 flex items-center gap-2 pl-0.5 font-mono text-[15px] text-ink transition hover:text-emerald">
                    <Phone size={16} strokeWidth={1.6} className="shrink-0 text-emerald" />
                    {doctor.contact.phone}
                  </a>

                  <div className="mt-6 grid grid-cols-2 gap-2">
                    {[
                      { href: links.yandex, label: t.booking.maps.yandex, Icon: MapIcon },
                      { href: links.gis, label: t.booking.maps.gis, Icon: Navigation },
                      { href: links.taxi, label: t.booking.maps.taxi, Icon: Car },
                      { href: links.google, label: t.booking.maps.google, Icon: MapPin },
                    ].map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-alabaster px-4 py-2 text-[13.5px] leading-tight text-ink transition hover:border-emerald hover:text-emerald"
                      >
                        <Icon size={15} strokeWidth={1.6} className="shrink-0" />
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
