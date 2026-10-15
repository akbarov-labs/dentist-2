import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Mrs_Saint_Delafield, Playfair_Display } from "next/font/google";
import { defaultDoctor, site } from "@/config/doctorConfig";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext", "cyrillic"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext", "cyrillic"],
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
  themeColor: "#f7f5f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.defaultLang}
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} ${signature.variable} antialiased`}
    >
      <body className="grain min-h-dvh">{children}</body>
    </html>
  );
}
