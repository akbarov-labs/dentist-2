import type { Metadata, Viewport } from "next";
import { Geist, Mrs_Saint_Delafield } from "next/font/google";
import { defaultDoctor, site } from "@/config/doctorConfig";
import "./globals.css";

// One family for headings, body and numbers; Latin-ext covers Uzbek, Cyrillic covers Russian.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "latin-ext", "cyrillic"],
  style: ["normal", "italic"],
  display: "swap",
});

const signature = Mrs_Saint_Delafield({
  variable: "--font-signature",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const d = defaultDoctor;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${d.name.uz} · ${d.title.uz}`,
  description: d.heroSub.uz,
  openGraph: {
    title: `${d.name.uz} · ${d.practice.uz}`,
    description: d.heroSub.uz,
    images: [{ url: d.portrait.src, width: 1400, height: 1750, alt: d.portrait.alt.uz }],
    locale: "uz_UZ",
    alternateLocale: ["ru_RU"],
    type: "website",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f5f6f3",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.defaultLang}
      className={`${geist.variable} ${signature.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
