"use client";

import { ArrowRight, Calculator, Car, CheckCircle2, ClipboardList, Clock3, Loader2, Map as MapIcon, MapPin, Navigation, Phone, Send, X } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { useSite } from "@/context/SiteContext";
import { buildTelegramText, computeEstimate, priceRange, selectionLines } from "@/lib/estimate";
import { formatUzPhone, mapLinks, phoneHref, telegramLink } from "@/lib/format";
import { openTime, useOpenNow } from "@/lib/useOpenNow";
import { PortraitArch } from "@/components/ui/PortraitArch";
import { SafeImage } from "@/components/ui/SafeImage";
import { Reveal } from "@/components/ui/Reveal";
import { Signature } from "@/components/ui/Signature";
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
      <div className="mt-2 grid grid-cols-2 gap-1 rounded-full border border-line bg-paper p-1">
        {options.map((o) => (
          <label
            key={o.id}
            className={`flex h-11 cursor-pointer items-center justify-center rounded-full text-[14px] transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
              value === o.id ? "bg-accent text-paper shadow-sm" : "text-ink-soft hover:text-ink"
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
  const { t, doctor, lang, calc, prefill, setPrefill } = useSite();
  const [name, setName] = useState("");
  const [digits, setDigits] = useState("");
  const [method, setMethod] = useState<ContactMethod>("telegram");
  const [hasCt, setHasCt] = useState<"yes" | "no">("no");
  const [comment, setComment] = useState("");
  // Optional: a patient whose number is hidden in Telegram can't be found by it, but can be by username.
  const [tgUser, setTgUser] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [refNo, setRefNo] = useState("");
  // Spam guard: a field people never see.
  const [trap, setTrap] = useState("");
  const open = useOpenNow(doctor);
  const closed = open === false;
  const time = openTime(doctor);

  // Carry the calculator's CT answer into the form whenever a new estimate arrives.
  const [seenPrefill, setSeenPrefill] = useState(prefill);
  if (prefill !== seenPrefill) {
    setSeenPrefill(prefill);
    if (prefill?.kind === "calculator") setHasCt(prefill.selection.hasCt ? "yes" : "no");
  }

  // The CT question only matters for treatments that involve a 3D scan.
  const ctSelection = prefill?.kind === "calculator" ? prefill.selection : calc;
  const askCt = computeEstimate(doctor, ctSelection, lang).needsCt;

  // No real address yet: no map, no directions (a pin on someone else's street sends patients to the wrong place).
  const address = doctor.address;
  const links = address ? mapLinks(address, lang) : null;
  // A doctor shown in his own photo doesn't get the arch repeated at the close; the form takes the room.
  const closePortrait = doctor.portrait.style !== "photo";
  // With neither a real address nor confirmed hours there is nothing true to put beside the Telegram card.
  const sideCard = Boolean(address) || doctor.hoursConfirmed !== false;
  const tgText = buildTelegramText(doctor, lang, t, prefill);
  const service = prefill?.kind === "service" ? doctor.services.find((s) => s.id === prefill.serviceId) : undefined;

  const summary = (() => {
    if (prefill?.kind === "calculator") {
      const l = selectionLines(prefill.selection, t);
      const est = computeEstimate(doctor, prefill.selection, lang);
      return {
        lines: [l.problem, ...(est.singleTier ? [] : [l.material]), ...(est.needsCt ? [`${t.calc.ctLine}: ${l.ct}`] : [])],
        price: priceRange(est, t),
      };
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
          hasCt: askCt && hasCt === "yes",
          comment: comment.trim(),
          telegram: method === "telegram" ? tgUser : "",
          lang,
          doctorId: doctor.id,
          selection: summary ? [...summary.lines, summary.price].filter(Boolean).join(" · ") : "",
          website: trap,
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
    setTgUser("");
    setStatus("idle");
    setPrefill(null);
  };

  const inputCls = (err?: string) =>
    `mt-2 h-12 w-full rounded-[12px] border bg-paper px-4 text-[16px] text-ink placeholder:text-muted transition focus:border-accent focus:bg-card focus:outline-none focus:ring-4 focus:ring-accent/10 ${
      err ? "border-danger-line" : "border-line"
    }`;

  return (
    <section id="booking" aria-labelledby="booking-title" className="border-t border-line py-20 pb-28 md:py-28">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          {/* The close: the hero's arch returns, now signed */}
          {/* Phones: the form comes first, so every "book" button lands on it; the signed portrait follows. */}
          {closePortrait ? (
            // overflow-x-clip: the cut-out is drawn wider than the arch and must not widen the page on phones
            <Reveal className="order-last mx-auto w-full max-w-[360px] overflow-x-clip lg:order-none lg:col-span-5 lg:max-w-none">
              <figure className="lg:sticky lg:top-24">
                <PortraitArch doctor={doctor} lang={lang} sizes="(min-width: 1024px) 34vw, 80vw" />
                <figcaption className="relative z-[2] -mt-4 text-center">
                  {/* A doctor can leave the closing quote empty: the signed portrait still closes the page */}
                  {t.booking.closeLine ? (
                    <p className="font-display text-[24px] leading-snug text-ink italic text-balance sm:text-[28px]">“{t.booking.closeLine}”</p>
                ) : null}
                <Signature name={doctor.signature} className="mx-auto mt-1 h-14 w-auto" />
                <p className="text-[13px] text-muted">{doctor.name[lang]}</p>
              </figcaption>
            </figure>
          </Reveal>
          ) : (
            // His photo returns at the close, cropped closer than the hero: the page ends on the person who will answer.
            <figure className="hidden lg:col-span-5 lg:block">
              <div className="sticky top-24">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[16px] bg-stone">
                  <SafeImage
                    src={doctor.portrait.src}
                    alt={doctor.portrait.alt[lang]}
                    fill
                    sizes="(min-width: 1024px) 36vw, 1px"
                    className="origin-[50%_18%] scale-[1.45] object-cover"
                    style={{ objectPosition: "50% 18%" }}
                  />
                </div>
                <figcaption className="mt-4 leading-snug">
                  <span className="block text-[15px] font-medium text-ink">{doctor.name[lang]}</span>
                  <span className="block text-[13.5px] text-muted">{doctor.title[lang]}</span>
                </figcaption>
              </div>
            </figure>
          )}

          <div className="lg:col-span-7">
            <Reveal>
              <h2 id="booking-title" data-scroll-target tabIndex={-1} className="font-display text-[34px] leading-[1.08] tracking-[-0.02em] text-ink outline-none sm:text-[40px]">
                {t.booking.title}
              </h2>
              <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-muted">
                {closed ? t.booking.subClosed.replace("{time}", time) : t.booking.sub}
              </p>
              {/* No arch at the close: his face still sits beside the form, so the page ends on him, not on a form */}
              {closePortrait ? null : (
                <div className="mt-6 flex items-center gap-4 lg:hidden">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-stone">
                    <SafeImage src={doctor.portrait.src} alt="" fill sizes="56px" className="object-cover" style={{ objectPosition: "50% 22%" }} />
                  </span>
                  <span className="leading-snug">
                    <span className="block text-[15px] font-medium text-ink">{doctor.name[lang]}</span>
                    <span className="block text-[13.5px] text-muted">{doctor.title[lang]}</span>
                  </span>
                </div>
              )}
            </Reveal>

          {/* Form */}
          <Reveal className="mt-8">
            <div data-booking-card className="rounded-[16px] bg-card p-6 shadow-[var(--shadow-soft)] sm:p-9">
              {status === "success" ? (
                <div className="hud-in flex min-h-[460px] flex-col items-start justify-center" role="status">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-accent-soft text-accent">
                    <CheckCircle2 size={28} strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-6 font-display text-[30px] leading-tight text-ink">{t.booking.successTitle}</h3>
                  <p className="mt-3 max-w-[46ch] text-[16px] leading-relaxed text-muted">
                    {closed ? t.booking.successBodyClosed.replace("{time}", time) : t.booking.successBody}{" "}
                    <span className="tabular-nums text-ink">{refNo}</span>
                  </p>
                  {summary ? (
                    <p className="mt-5 rounded-[12px] bg-paper px-4 py-3 tabular-nums text-[13px] leading-relaxed text-ink-soft">
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
                  <form
                    onSubmit={submit}
                    noValidate
                    className="relative space-y-6"
                  >
                    {/* Honeypot: hidden from people and assistive tech, filled in by bots */}
                    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                      <label>
                        Website
                        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
                      </label>
                    </div>
                    {summary ? (
                      <div className="hud-in flex items-start justify-between gap-4 rounded-[16px] border border-accent/20 bg-accent-soft/70 p-4">
                        <div className="flex items-start gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-paper">
                            {prefill?.kind === "calculator" ? <Calculator size={16} strokeWidth={1.7} /> : <ClipboardList size={16} strokeWidth={1.7} />}
                          </span>
                          <div>
                            <p className="text-[12.5px] font-medium text-accent">
                              {prefill?.kind === "calculator" ? t.booking.selected : t.booking.service}
                            </p>
                            <p className="mt-1 text-[14.5px] leading-snug text-ink">{summary.lines.join(" · ")}</p>
                            {summary.price ? <p className="mt-1 tabular-nums text-[13px] text-accent">{summary.price}</p> : null}
                          </div>
                        </div>
                        <button type="button" onClick={() => setPrefill(null)} aria-label={t.booking.remove} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-soft transition hover:bg-card">
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
                          <p id="bk-name-err" className="mt-2 text-[13px] text-danger">
                            {errors.name}
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <label htmlFor="bk-phone" className="text-[14px] font-medium text-ink">
                          {t.booking.phone}
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute top-1/2 left-4 mt-1 -translate-y-1/2 tabular-nums text-[15px] text-ink-soft">+998</span>
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
                            className={`${inputCls(errors.phone)} pl-[4.25rem] tabular-nums`}
                          />
                        </div>
                        {errors.phone ? (
                          <p id="bk-phone-err" className="mt-2 text-[13px] text-danger">
                            {errors.phone}
                          </p>
                        ) : null}
                      </div>
                    </div>
  
                    <div className={`grid gap-6 ${askCt ? "sm:grid-cols-2" : ""}`}>
                      <Segmented
                        label={t.booking.contact}
                        value={method}
                        onChange={setMethod}
                        options={[
                          { id: "call", label: t.booking.contactCall },
                          { id: "telegram", label: t.booking.contactTg },
                        ]}
                      />
                      {askCt ? (
                        <Segmented
                          label={t.booking.ct}
                          value={hasCt}
                          onChange={setHasCt}
                          options={[
                            { id: "yes", label: t.booking.ctYes },
                            { id: "no", label: t.booking.ctNo },
                          ]}
                        />
                      ) : null}
                    </div>
  
                    {method === "telegram" ? (
                      <div>
                        <label htmlFor="bk-tg" className="text-[14px] font-medium text-ink">
                          {t.booking.tgUser}
                        </label>
                        <div className="relative">
                          <span className="pointer-events-none absolute top-1/2 left-4 mt-1 -translate-y-1/2 text-[15px] text-ink-soft">@</span>
                          <input
                            id="bk-tg"
                            name="telegram"
                            autoComplete="off"
                            autoCapitalize="none"
                            spellCheck={false}
                            value={tgUser}
                            // Accept a pasted @name or t.me link; keep only what a username can contain.
                            onChange={(e) => setTgUser(e.target.value.replace(/^.*t\.me\//i, "").replace(/[^A-Za-z0-9_]/g, "").slice(0, 32))}
                            placeholder={t.booking.tgUserPh}
                            aria-describedby="bk-tg-hint"
                            className={`${inputCls()} pl-9`}
                          />
                        </div>
                        <p id="bk-tg-hint" className="mt-2 text-[13px] leading-snug text-muted">
                          {t.booking.tgUserHint}
                        </p>
                      </div>
                    ) : null}

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
                        className="mt-2 w-full resize-none rounded-[12px] border border-line bg-paper px-4 py-3 text-[16px] text-ink placeholder:text-muted transition focus:border-accent focus:bg-card focus:ring-4 focus:ring-accent/10 focus:outline-none"
                      />
                    </div>
  
                    <p className="flex max-w-[72ch] items-start gap-2.5 rounded-[12px] bg-paper px-4 py-3 text-[14px] leading-relaxed text-ink-soft">
                      <Clock3 size={17} strokeWidth={1.6} className="mt-0.5 shrink-0 text-accent" />
                      {t.booking.next}
                    </p>
  
                    {status === "error" ? (
                      <p role="alert" className="rounded-[12px] border border-danger-line/30 bg-danger-soft px-4 py-3 text-[14px] text-danger-ink">
                        {t.booking.errSubmit}{" "}
                        <a href={telegramLink(doctor.contact.telegram, tgText)} target="_blank" rel="noopener noreferrer" className="font-medium underline">
                          {t.booking.errSubmitTg}
                        </a>
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
          {/* Without a map or hours beside it, a whole Telegram card under the form is a third path saying the same thing: one plain line instead */}
          {sideCard ? null : (
            <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-muted">
              {t.booking.orDirect}
              <a
                href={telegramLink(doctor.contact.telegram, tgText)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 px-1 font-medium text-accent underline-offset-4 hover:underline"
              >
                <Send size={15} strokeWidth={1.7} /> Telegram @{doctor.contact.telegram}
              </a>
              <span aria-hidden className="hidden sm:inline">·</span>
              <a href={phoneHref(doctor.contact.phone)} className="inline-flex min-h-11 items-center gap-1.5 px-1 tabular-nums font-medium text-ink underline-offset-4 hover:underline">
                <Phone size={15} strokeWidth={1.6} className="text-accent" /> {doctor.contact.phone}
              </a>
            </p>
          )}
          </div>
        </div>

        {/* Concierge + map */}
        {sideCard ? (
        <div className="mt-16 grid gap-6 lg:grid-cols-12 lg:gap-8">
            <Reveal delay={100} className="lg:col-span-5">
              <div className="relative h-full overflow-hidden rounded-[16px] bg-accent p-6 text-paper sm:p-8">
                <h3 className="font-display text-[22px] leading-tight">{t.booking.tgTitle}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-paper/75">{t.booking.tgBody}</p>
                <p className="mt-5 rounded-[16px] rounded-bl-[4px] bg-paper/10 px-4 py-3 text-[13px] leading-relaxed whitespace-pre-line text-paper/90">
                  {tgText}
                </p>
                <a
                  href={telegramLink(doctor.contact.telegram, tgText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-paper px-6 py-3 text-center text-[15px] leading-tight font-medium text-accent transition hover:bg-white active:translate-y-px"
                >
                  <Send size={16} strokeWidth={1.7} className="shrink-0" /> {t.booking.tgTitle}
                </a>
              </div>
            </Reveal>

            {address && links ? (
              <Reveal delay={160} className="lg:col-span-7">
                <div className="grid h-full overflow-hidden rounded-[16px] border border-line bg-card md:grid-cols-2">
                  <div className="relative aspect-[16/10] bg-stone md:aspect-auto md:min-h-[360px]">
                    <iframe
                      key={`${doctor.id}-${lang}`}
                      src={links.embed}
                      title={t.booking.mapLabel}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full grayscale-[60%] sepia-[12%]"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-[20px] leading-tight text-ink">{t.booking.mapTitle}</h3>
                    <p className="mt-2 flex items-start gap-2 text-[16px] leading-snug text-ink">
                      <MapPin size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-accent" />
                      {address.full[lang]}
                    </p>
                    <p className="mt-1 pl-[26px] text-[13.5px] text-muted">{address.landmark[lang]}</p>
                    <p className="mt-3 flex items-center gap-2 pl-0.5 text-[14px] text-ink-soft">
                      <Clock3 size={16} strokeWidth={1.6} className="shrink-0 text-accent" />
                      <span>
                    {doctor.hours.days[lang]} · <span className="tabular-nums whitespace-nowrap">{doctor.hours.time}</span>
                  </span>
                    </p>
                    <a href={phoneHref(doctor.contact.phone)} aria-label={`${t.booking.call}: ${doctor.contact.phone}`} className="mt-1 flex min-h-11 items-center gap-2 pl-0.5 tabular-nums text-[15px] text-ink transition hover:text-accent">
                      <Phone size={16} strokeWidth={1.6} className="shrink-0 text-accent" />
                      {doctor.contact.phone}
                    </a>
  
                    <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-1 xl:grid-cols-2">
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
                          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-[13.5px] leading-tight text-ink transition hover:border-accent hover:text-accent"
                        >
                          <Icon size={15} strokeWidth={1.6} className="shrink-0" />
                          {label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ) : sideCard ? (
            <Reveal delay={160} className="lg:col-span-7">
              <div className="h-full rounded-[16px] border border-line bg-card p-6 sm:p-8">
                <h3 className="font-display text-[22px] leading-tight text-ink">{t.booking.hours}</h3>
                <p className="mt-3 flex items-center gap-2 text-[16px] text-ink-soft">
                  <Clock3 size={17} strokeWidth={1.6} className="shrink-0 text-accent" />
                  <span>
                    {doctor.hours.days[lang]} · <span className="tabular-nums whitespace-nowrap">{doctor.hours.time}</span>
                  </span>
                </p>
                <a href={phoneHref(doctor.contact.phone)} aria-label={`${t.booking.call}: ${doctor.contact.phone}`} className="mt-2 flex min-h-11 items-center gap-2 tabular-nums text-[17px] text-ink transition hover:text-accent">
                  <Phone size={17} strokeWidth={1.6} className="shrink-0 text-accent" />
                  {doctor.contact.phone}
                </a>
              </div>
            </Reveal>
            ) : null}
        </div>
        ) : null}
      </div>
    </section>
  );
}
