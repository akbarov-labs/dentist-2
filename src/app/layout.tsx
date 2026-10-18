import type { Metadata, Viewport } from "next";
import { Mrs_Saint_Delafield, Onest, Source_Serif_4 } from "next/font/google";
import { defaultDoctor, site } from "@/config/doctorConfig";
import "./globals.css";

// Headings in a warm text serif with optical sizes; body and numbers in Onest, drawn for Cyrillic and Latin alike.
// Latin-ext covers Uzbek (o‘, g‘), Cyrillic covers Russian.
const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext", "cyrillic"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const sans = Onest({
  variable: "--font-body",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const signature = Mrs_Saint_Delafield({
  variable: "--font-signature",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  // Only the handwritten signatures below the fold use it; no need to compete with the hero's fonts.
  preload: false,
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
      className={`${serif.variable} ${sans.variable} ${signature.variable} antialiased`}
    >
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
