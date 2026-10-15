"use client";

import { AtSign, Mail, Phone, Send } from "lucide-react";
import { site } from "@/config/doctorConfig";
import { useSite } from "@/context/SiteContext";
import { instagramLink, phoneHref, telegramLink } from "@/lib/format";
import { useClientValue } from "@/lib/prefs";
import { Monogram } from "@/components/ui/Monogram";
import { NAV_IDS } from "@/components/layout/Header";

export function Footer() {
  const { t, doctor, lang, scrollToId } = useSite();
  const year = useClientValue(() => new Date().getFullYear());
  const labels = [t.nav.approach, t.nav.cases, t.nav.services, t.nav.calculator, t.nav.credentials, t.nav.location];

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
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 lg:grid-cols-1">
              {NAV_IDS.map((id, i) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={(e) => (e.preventDefault(), scrollToId(id))} className="text-[14.5px] text-ink-soft transition hover:text-emerald">
                    {labels[i]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="space-y-3 text-[14.5px] lg:col-span-4">
            <li>
              <a href={phoneHref(doctor.contact.phone)} className="inline-flex items-center gap-2.5 font-mono text-ink transition hover:text-emerald">
                <Phone size={16} strokeWidth={1.6} className="text-emerald" /> {doctor.contact.phone}
              </a>
            </li>
            <li>
              <a href={telegramLink(doctor.contact.telegram)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-ink transition hover:text-emerald">
                <Send size={16} strokeWidth={1.6} className="text-emerald" /> @{doctor.contact.telegram}
              </a>
            </li>
            <li>
              <a href={instagramLink(doctor.contact.instagram)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-ink transition hover:text-emerald">
                <AtSign size={16} strokeWidth={1.6} className="text-emerald" /> @{doctor.contact.instagram}
              </a>
            </li>
            <li>
              <a href={`mailto:${doctor.contact.email}`} className="inline-flex items-center gap-2.5 text-ink transition hover:text-emerald">
                <Mail size={16} strokeWidth={1.6} className="text-emerald" /> {doctor.contact.email}
              </a>
            </li>
            <li className="pt-2 text-muted">{doctor.address.full[lang]}</li>
          </ul>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[12.5px] text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year ? `${year} ` : ""}{doctor.name[lang]}. {t.footer.rights}
          </p>
          <p className="font-mono">
            {t.footer.license}: {doctor.idCard.licenseId}
          </p>
        </div>
        {site.isDemo ? <p className="mt-3 text-[12px] text-muted/80">{t.footer.demo}</p> : null}
      </div>
    </footer>
  );
}
