"use client";

import { ArrowRight, ArrowUpRight, BadgeCheck, Clock3 } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { Modal } from "@/components/ui/Modal";
import { Monogram } from "@/components/ui/Monogram";
import { SafeImage } from "@/components/ui/SafeImage";
import { Signature } from "@/components/ui/Signature";
import { btnPrimary } from "@/components/ui/styles";

function isEmbed(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

/** Renders whichever dialog is open: the 1-minute intro or a single certificate. */
export function Modals() {
  const { t, doctor, lang, modal, setModal, scrollToId } = useSite();
  const close = () => setModal(null);
  // The intro ends where the visitor's next step is: the booking form (after the dialog has released focus).
  const bookFromIntro = () => {
    close();
    window.setTimeout(() => scrollToId("booking"), 60);
  };
  const credential = modal?.kind === "credential" ? doctor.credentials.find((c) => c.id === modal.id) : undefined;

  return (
    <>
      <Modal open={modal?.kind === "intro"} onClose={close} labelledBy="intro-title" closeLabel={t.modal.close} className="sm:max-w-[960px]">
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-[4/5] overflow-hidden bg-stone md:aspect-auto md:min-h-[560px]">
            {doctor.introVideoUrl ? (
              isEmbed(doctor.introVideoUrl) ? (
                <iframe src={doctor.introVideoUrl} title={t.intro.title} className="absolute inset-0 h-full w-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
              ) : (
                <video src={doctor.introVideoUrl} poster={doctor.portrait.src} controls playsInline className="absolute inset-0 h-full w-full object-cover" />
              )
            ) : (
              <SafeImage src={doctor.portrait.src} alt={doctor.portrait.alt[lang]} fill sizes="(min-width: 768px) 420px, 100vw" className="object-cover" style={{ objectPosition: doctor.portrait.position }} />
            )}
          </div>
          <div className="p-6 sm:p-9">
            <p className="inline-flex items-center gap-2 tabular-nums text-[12px] tracking-[0.14em] text-accent uppercase">
              <Clock3 size={13} strokeWidth={1.7} /> {t.intro.read}
            </p>
            <h2 id="intro-title" className="mt-3 pr-10 font-display text-[30px] leading-tight text-ink">
              {doctor.name[lang]}
            </h2>
            <p className="mt-1 text-[14px] text-muted">{doctor.title[lang]}</p>
            <div className="mt-6 space-y-4 text-[15.5px] leading-relaxed text-ink-soft">
              {doctor.manifesto[lang].map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Signature name={doctor.signature} className="mt-2 h-14 w-auto" />

            <h3 className="mt-6 text-[12.5px] text-muted">{t.intro.facts}</h3>
            <dl className="mt-3 grid grid-cols-3 gap-3">
              {doctor.stats.map((s) => (
                <div key={s.label.uz} className="flex flex-col-reverse justify-end rounded-[12px] bg-stone p-3">
                  <dt className="mt-1 text-[12px] leading-snug text-muted">{s.label[lang]}</dt>
                  <dd className="tabular-nums text-[16px] text-ink">{s.value[lang]}</dd>
                </div>
              ))}
            </dl>

            <ul className="mt-6 divide-y divide-line border-y border-line">
              {doctor.credentials.map((c) => (
                <li key={c.id}>
                  <button type="button" onClick={() => setModal({ kind: "credential", id: c.id })} className="flex w-full items-center justify-between gap-4 py-3 text-left text-[14.5px] text-ink transition hover:text-accent">
                    <span>
                      {c.city[lang]} · <span className="text-muted">{c.institution}</span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-1 tabular-nums text-[12px]">
                      {c.year} <ArrowUpRight size={14} strokeWidth={1.7} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <button type="button" onClick={bookFromIntro} className={`${btnPrimary} group mt-7 w-full sm:w-auto`}>
              {t.cta.book}
              <ArrowRight size={17} strokeWidth={1.7} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={!!credential} onClose={close} labelledBy="cert-title" closeLabel={t.modal.close} className="sm:max-w-[760px]">
        {credential ? (
          <div className="p-4 sm:p-8">
            <div className="relative rounded-[12px] border border-accent/50 bg-card p-2">
              <div className="rounded-[8px] border border-accent/30 px-6 py-10 text-center sm:px-12 sm:py-12">
                <Monogram letters={doctor.monogram} className="mx-auto h-14 w-14" />
                <p className="mt-6 tabular-nums text-[12px] tracking-[0.14em] text-accent uppercase">{t.credentials.certTitle}</p>
                <h2 id="cert-title" className="mt-4 font-display text-[28px] leading-tight text-ink sm:text-[34px]">
                  {credential.program[lang]}
                </h2>
                <p className="mt-6 text-[13px] text-muted">{t.credentials.holder}</p>
                <p className="font-display text-[22px] text-ink italic">{doctor.name[lang]}</p>
                <p className="mt-6 text-[15px] text-ink-soft">
                  {credential.institution}
                  <br />
                  {credential.city[lang]}, {credential.country[lang]}
                </p>
                <dl className="mx-auto mt-8 grid max-w-[460px] grid-cols-3 gap-3 border-t border-line pt-6 text-left">
                  <div>
                    <dt className="text-[12px] text-muted">{t.credentials.issued}</dt>
                    <dd className="mt-1 tabular-nums text-[14px] text-ink">{credential.year}</dd>
                  </div>
                  <div>
                    <dt className="text-[12px] text-muted">{t.credentials.program}</dt>
                    <dd className="mt-1 tabular-nums text-[14px] text-ink">
                      {credential.hours} {t.credentials.hours}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[12px] text-muted">{t.credentials.id}</dt>
                    <dd className="mt-1 tabular-nums text-[12.5px] break-all text-ink">{credential.certificateId}</dd>
                  </div>
                </dl>
                <div className="mt-8 flex items-end justify-center gap-6">
                  <Signature name={doctor.signature} className="h-12 w-auto" />
                  <span aria-hidden className="relative grid h-16 w-16 place-items-center rounded-full border-2 border-accent/70 text-accent">
                    <span className="absolute inset-1.5 rounded-full border border-dashed border-accent/50" />
                    <BadgeCheck size={22} strokeWidth={1.5} />
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-center text-[12.5px] text-muted">{t.credentials.verifiedBy}</p>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
