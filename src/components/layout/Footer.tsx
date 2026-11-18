"use client";

import { AtSign, Mail, Phone, Send } from "lucide-react";
import { site } from "@/config/doctorConfig";
import { useSite } from "@/context/SiteContext";
import { instagramLink, phoneHref, telegramLink } from "@/lib/format";
import { useClientValue } from "@/lib/prefs";
import { Monogram } from "@/components/ui/Monogram";

export function Footer() {
  const { t, doctor, lang, scrollToId } = useSite();
  const year = useClientValue(() => new Date().getFullYear());
  // The footer can afford the full map of the page; the header keeps only four links.
  const links = [
    { id: "approach", label: t.nav.approach },
    { id: "services", label: t.nav.services },
    { id: "calculator", label: t.nav.calculator },
    { id: "cases", label: t.nav.cases },
    { id: "credentials", label: t.nav.credentials },
    { id: "faq", label: t.nav.faq },
  ]
    .filter((l) => l.id !== "credentials" || doctor.credentials.length)
    .filter((l) => l.id !== "approach" || doctor.compareClinics !== false)
    .filter((l) => l.id !== "calculator" || !doctor.priceList?.length);

  return (
    <footer className="border-t border-line pt-16 pb-28 md:pb-12">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-4">
              <Monogram letters={doctor.monogram} className="h-14 w-14" />
              <div>
                <p className="font-display text-[22px] leading-tight text-ink">{doctor.name[lang]}</p>
                <p className="text-[13px] text-muted">{doctor.practice[lang]}</p>
              </div>
            </div>
            <p className="mt-6 max-w-[42ch] text-[14px] leading-relaxed text-muted">{doctor.title[lang]}</p>
          </div>

          <nav aria-label={t.nav.menu} className="lg:col-span-3">
            <ul className="grid grid-cols-2 gap-x-6 lg:grid-cols-1">
              {links.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={(e) => (e.preventDefault(), scrollToId(id))} className="inline-flex min-h-11 items-center text-[14.5px] text-ink-soft transition hover:text-accent">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="space-y-0.5 text-[14.5px] lg:col-span-4">
            <li>
              <a href={phoneHref(doctor.contact.phone)} className="inline-flex min-h-11 items-center gap-2.5 tabular-nums text-ink transition hover:text-accent">
                <Phone size={16} strokeWidth={1.6} className="text-accent" /> {doctor.contact.phone}
              </a>
            </li>
            <li>
              <a href={telegramLink(doctor.contact.telegram)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2.5 text-ink transition hover:text-accent">
                <Send size={16} strokeWidth={1.6} className="text-accent" /> @{doctor.contact.telegram}
              </a>
            </li>
            <li>
              <a href={instagramLink(doctor.contact.instagram)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2.5 text-ink transition hover:text-accent">
                <AtSign size={16} strokeWidth={1.6} className="text-accent" /> @{doctor.contact.instagram}
              </a>
            </li>
            {doctor.contact.email ? (
              <li>
                <a href={`mailto:${doctor.contact.email}`} className="inline-flex min-h-11 items-center gap-2.5 text-ink transition hover:text-accent">
                  <Mail size={16} strokeWidth={1.6} className="text-accent" /> {doctor.contact.email}
                </a>
              </li>
            ) : null}
            {doctor.address ? <li className="pt-2 text-muted">{doctor.address.full[lang]}</li> : null}
          </ul>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[12.5px] text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year ? `${year} ` : ""}{doctor.name[lang]}{t.footer.rights ? `. ${t.footer.rights}` : ""}
          </p>
          {doctor.idCard.licenseId ? (
            <p className="tabular-nums">
              {t.footer.license}: {doctor.idCard.licenseId}
            </p>
          ) : null}
        </div>
        {/* The demo note, or for a doctor with a price list the "prices are approximate" note, which must survive launch */}
        {site.isDemo || doctor.priceList?.length ? <p className="mt-3 text-[12.5px] text-muted">{t.footer.demo}</p> : null}
      </div>
    </footer>
  );
}
