import { defaultDoctor, site } from "@/config/doctorConfig";
import { SiteProvider } from "@/context/SiteContext";
import { DemoSwitcher } from "@/components/layout/DemoSwitcher";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBar } from "@/components/layout/MobileBar";
import { Modals } from "@/components/layout/Modals";
import { Approach } from "@/components/sections/Approach";
import { Booking } from "@/components/sections/Booking";
import { Calculator } from "@/components/sections/Calculator";
import { Cases } from "@/components/sections/Cases";
import { Credentials } from "@/components/sections/Credentials";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { Protocol } from "@/components/sections/Protocol";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";

function StructuredData() {
  const d = defaultDoctor;
  const data = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: d.name.uz,
    description: d.title.uz,
    url: site.url,
    image: `${site.url}${d.portrait.src}`,
    telephone: d.contact.phone.replace(/\s/g, ""),
    email: d.contact.email,
    // Street and pin only once the real address is known; the city is true either way.
    address: {
      "@type": "PostalAddress",
      ...(d.address ? { streetAddress: d.address.short.uz } : {}),
      addressLocality: "Toshkent",
      addressCountry: "UZ",
    },
    ...(d.address ? { geo: { "@type": "GeoCoordinates", latitude: d.address.lat, longitude: d.address.lng } } : {}),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: `${String(d.hours.openHour).padStart(2, "0")}:00`,
      closes: `${String(d.hours.closeHour).padStart(2, "0")}:00`,
    },
    sameAs: [`https://t.me/${d.contact.telegram}`, `https://instagram.com/${d.contact.instagram}`],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function Home() {
  return (
    <SiteProvider>
      <StructuredData />
      <Header />
      <main id="main" className="relative z-[2]">
        <Hero />
        <Approach />
        <Protocol />
        {/* Patients' own words right after the painless-visit story: the proof the anxious visitor looks for first */}
        <Reviews />
        <Cases />
        <Services />
        <Calculator />
        <Credentials />
        <Faq />
        <Booking />
      </main>
      <Footer />
      <MobileBar />
      <DemoSwitcher />
      <Modals />
    </SiteProvider>
  );
}
