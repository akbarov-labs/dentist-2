/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DOCTOR CONFIG: the only file you need to edit to re-brand this site.
 *
 *  1. Duplicate the `jamshid` preset below, change the values, and add it to
 *     `doctorPresets`.
 *  2. Point `activePresetId` at your new preset.
 *  3. Drop the doctor's photos into /public/images and update the `src` paths.
 *  4. Set `site.showDemoSwitcher` to false before handing the site to a client.
 *
 *  Every user-facing string is `{ uz, ru }` so both languages stay in sync.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { CopyOverride } from "@/i18n/dictionary";

export type Lang = "uz" | "ru";
export type Localized<T = string> = Record<Lang, T>;

export type ProblemId = "single" | "multiple" | "fullArch" | "aesthetic" | "checkup" | "treatment" | "rootCanal";
export type MaterialId = "premium" | "swiss";
export type CaseCategory = "implant" | "veneers" | "allOn6" | "crowns" | "composite" | "rehab";

export interface PriceTier {
  /** Price range in UZS. */
  min: number;
  max: number;
}

export interface ProblemPricing {
  premium: PriceTier;
  swiss: PriceTier;
  /** Shown under the price, e.g. "1 birlik uchun". */
  unitNote?: Localized;
  visits: Localized;
  surgeryTime: Localized;
  bonuses: Localized[];
  /** false: no 3D CT is involved, so the calculator skips the CT question and adds no scan cost. */
  needsCt?: boolean;
  /** false: the 0% instalment line is hidden (small one-visit treatments). */
  installment?: boolean;
  /** true: no material choice; the calculator skips that question and quotes the full premium-to-swiss range. */
  singleTier?: boolean;
}

export interface ServiceItem {
  id: string;
  title: Localized;
  lead: Localized;
  specs: Localized[];
  image?: string;
  /** Calculator problem this service maps to (for "Narxni hisoblash"). */
  calcProblem?: ProblemId;
  priceFrom: number;
}

export interface Credential {
  id: string;
  city: Localized;
  country: Localized;
  institution: string;
  program: Localized;
  year: number;
  hours: number;
  certificateId: string;
}

export interface ClinicalCase {
  id: string;
  category: CaseCategory;
  title: Localized;
  /** Illustrative image shown while real patient photos are not configured. */
  image: string;
  /** CSS object-position for the image crop. */
  focus: string;
  /**
   * Real, consented before/after photos of THIS patient. When set, the drag slider is shown.
   * Never fake a "before" from the "after" image.
   */
  photos?: { before: string; after: string };
  /** Where a real case was published (the doctor's own post); replaces the "illustrative" note. */
  source?: { url: string; date: Localized };
  problem: Localized;
  system: Localized;
  duration?: Localized;
  note: Localized;
}

export interface DoctorProfile {
  id: string;
  /** Shown in the Demo switcher only. */
  presetLabel: Localized;
  name: Localized;
  /** Latin name used in the handwritten signature. */
  signature: string;
  firstName: Localized;
  monogram: string;
  title: Localized;
  practice: Localized;
  heroLead: Localized;
  heroSub: Localized;
  manifesto: Localized<string[]>;
  portrait: { src: string; alt: Localized; position: string; /** Transparent cut-out (WebP with alpha) for the layered hero and the close. */ cutout: string };
  stats: { value: Localized; label: Localized }[];
  idCard: { licenseId: string; lines: Localized[] };
  contact: {
    phone: string;
    telegram: string;
    instagram: string;
    email?: string;
  };
  address: {
    full: Localized;
    short: Localized;
    landmark: Localized;
    lat: number;
    lng: number;
  };
  hours: {
    days: Localized;
    daysShort: Localized;
    time: string;
    /** 1 = Monday ... 7 = Sunday, Tashkent time (UTC+5). */
    openDays: number[];
    openHour: number;
    closeHour: number;
  };
  dailyPatients: number;
  services: ServiceItem[];
  pricing: Record<ProblemId, ProblemPricing>;
  /** Cost of a CBCT scan done at the first visit, in UZS. */
  ctScanPrice: number;
  /** 0% instalment plan length in months. Omit when the practice offers no instalments (the calculator then hides the line). */
  installmentMonths?: number;
  credentials: Credential[];
  cases: ClinicalCase[];
  /** Optional MP4 / YouTube-embed URL for the 1-minute intro. */
  introVideoUrl?: string;
  /** Which scroll-built drawing tells the protocol story: an implant (default) or a painless general visit. */
  protocolDrawing?: "implant" | "visit";
  /** Hero's second action becomes "my tooth hurts" (Telegram with a prefilled urgent message) instead of the intro. */
  urgentCta?: boolean;
  /** Calculator answers for "what bothers you", in display order (2 or 4 read best). Defaults to the implant set. */
  calcProblems?: ProblemId[];
  /** Per-doctor overrides of the shared UI copy, merged over the dictionary (arrays replace, objects merge). */
  copy?: Partial<Record<Lang, CopyOverride>>;
}

export const defaultCalcProblems: ProblemId[] = ["single", "multiple", "fullArch", "aesthetic"];

/* ───────────────────────────── Shared data ───────────────────────────── */

const sharedPricing: Record<ProblemId, ProblemPricing> = {
  single: {
    premium: { min: 7_900_000, max: 9_400_000 },
    swiss: { min: 13_800_000, max: 16_500_000 },
    visits: { uz: "2–3 tashrif", ru: "2–3 визита" },
    surgeryTime: { uz: "20–25 daqiqa", ru: "20–25 минут" },
    bonuses: [
      { uz: "Bepul shaxsiy 3D reja", ru: "Бесплатный 3D-план лечения" },
      { uz: "Vaqtinchalik estetik toj", ru: "Временная эстетическая коронка" },
      { uz: "10 yillik yozma kafolat pasporti", ru: "Паспорт гарантии на 10 лет" },
    ],
  },
  multiple: {
    premium: { min: 19_500_000, max: 27_000_000 },
    swiss: { min: 34_000_000, max: 46_000_000 },
    unitNote: { uz: "2–3 implant uchun", ru: "за 2–3 импланта" },
    visits: { uz: "3–4 tashrif", ru: "3–4 визита" },
    surgeryTime: { uz: "40–60 daqiqa", ru: "40–60 минут" },
    bonuses: [
      { uz: "Bepul shaxsiy 3D reja", ru: "Бесплатный 3D-план лечения" },
      { uz: "Navigatsion jarrohlik shabloni", ru: "Навигационный хирургический шаблон" },
      { uz: "Muddatli to‘lov 0%", ru: "Рассрочка 0%" },
    ],
  },
  fullArch: {
    premium: { min: 62_000_000, max: 74_000_000 },
    swiss: { min: 108_000_000, max: 126_000_000 },
    unitNote: { uz: "bitta jag‘ uchun", ru: "за одну челюсть" },
    visits: { uz: "3 tashrif · 3–5 kun", ru: "3 визита · 3–5 дней" },
    surgeryTime: { uz: "2–3 soat (sedatsiya bilan)", ru: "2–3 часа (под седацией)" },
    bonuses: [
      { uz: "Bepul shaxsiy 3D reja", ru: "Бесплатный 3D-план лечения" },
      { uz: "Olinmaydigan protez 72 soat ichida", ru: "Несъёмный протез за 72 часа" },
      { uz: "Mehmonxona va transfer (xorijiy bemorlarga)", ru: "Отель и трансфер для иногородних" },
    ],
  },
  aesthetic: {
    premium: { min: 3_600_000, max: 4_300_000 },
    swiss: { min: 5_200_000, max: 6_100_000 },
    unitNote: { uz: "1 birlik (vinir / toj) uchun", ru: "за 1 единицу (винир / коронка)" },
    visits: { uz: "2 tashrif", ru: "2 визита" },
    needsCt: false,
    surgeryTime: { uz: "Jarrohliksiz · 2×90 daqiqa", ru: "Без хирургии · 2×90 минут" },
    bonuses: [
      { uz: "Bepul raqamli tabassum dizayni", ru: "Бесплатный цифровой дизайн улыбки" },
      { uz: "Og‘izda sinov modeli (mock-up)", ru: "Примерка во рту (mock-up)" },
      { uz: "Oqartirish sovg‘a sifatida", ru: "Отбеливание в подарок" },
    ],
  },
  checkup: {
    premium: { min: 350_000, max: 500_000 },
    swiss: { min: 550_000, max: 750_000 },
    visits: { uz: "1 tashrif", ru: "1 визит" },
    surgeryTime: { uz: "45–60 daqiqa", ru: "45–60 минут" },
    needsCt: false,
    installment: false,
    singleTier: true,
    bonuses: [
      { uz: "Davolash rejasi va yozma narx", ru: "План лечения и письменная цена" },
      { uz: "Air-Flow va ultratovush bilan tozalash", ru: "Чистка Air-Flow и ультразвуком" },
      { uz: "Uy gigienasi bo‘yicha shaxsiy maslahat", ru: "Личные рекомендации по гигиене" },
    ],
  },
  treatment: {
    premium: { min: 450_000, max: 700_000 },
    swiss: { min: 750_000, max: 1_100_000 },
    unitNote: { uz: "1 tish uchun", ru: "за 1 зуб" },
    visits: { uz: "1 tashrif", ru: "1 визит" },
    surgeryTime: { uz: "40–60 daqiqa", ru: "40–60 минут" },
    needsCt: false,
    installment: false,
    singleTier: true,
    bonuses: [
      { uz: "Og‘riqsiz kompyuterli anesteziya", ru: "Безболезненная компьютерная анестезия" },
      { uz: "Rentgen tasvir narxga kiritilgan", ru: "Рентген-снимок включён в цену" },
      { uz: "Plombaga 2 yillik yozma kafolat", ru: "Письменная гарантия на пломбу 2 года" },
    ],
  },
  rootCanal: {
    premium: { min: 1_200_000, max: 1_800_000 },
    swiss: { min: 1_900_000, max: 2_800_000 },
    unitNote: { uz: "1 tish uchun", ru: "за 1 зуб" },
    visits: { uz: "1–2 tashrif", ru: "1–2 визита" },
    surgeryTime: { uz: "60–90 daqiqa", ru: "60–90 минут" },
    needsCt: false,
    installment: false,
    singleTier: true,
    bonuses: [
      { uz: "Mikroskop ostida kanal davolash", ru: "Лечение каналов под микроскопом" },
      { uz: "Nazorat rentgeni narxga kiritilgan", ru: "Контрольный снимок включён в цену" },
      { uz: "Vaqtinchalik plomba bepul", ru: "Временная пломба бесплатно" },
    ],
  },
};

const sharedCases: ClinicalCase[] = [
  {
    id: "case-implant",
    category: "implant",
    title: { uz: "Old tish o‘rnida bitta implant", ru: "Один имплант во фронтальной зоне" },
    image: "/images/case-implant.jpg",
    focus: "50% 45%",
    problem: {
      uz: "Yuqori kesuvchi tish sinishi, 6 oy davomida olinadigan protez bilan yurgan.",
      ru: "Перелом верхнего резца, полгода носил съёмный протез.",
    },
    system: { uz: "Straumann BLX + sirkoniy toj", ru: "Straumann BLX + циркониевая коронка" },
    duration: { uz: "4 kun · 2 tashrif", ru: "4 дня · 2 визита" },
    note: {
      uz: "Implantni navigatsion shablon bilan, kesishsiz qo‘ydim. Bemor o‘sha kuni kechqurun ishga qaytdi.",
      ru: "Имплант установил по навигационному шаблону, без разрезов. Вечером того же дня пациент вернулся к работе.",
    },
  },
  {
    id: "case-veneers",
    category: "veneers",
    title: { uz: "8 ta E-max mikro-vinir", ru: "8 микро-виниров E-max" },
    image: "/images/case-veneers.jpg",
    focus: "48% 62%",
    problem: {
      uz: "Tishlar rangi notekis, eski plomba chegaralari ko‘rinib turardi.",
      ru: "Неравномерный цвет зубов, видны границы старых пломб.",
    },
    system: { uz: "Ivoclar E-max Press, 0.3 mm", ru: "Ivoclar E-max Press, 0.3 мм" },
    duration: { uz: "9 kun · 2 tashrif", ru: "9 дней · 2 визита" },
    note: {
      uz: "Tishlarni deyarli charxlamadim. Rangni bemorning ko‘zi va terisi ohangiga moslab tanladim.",
      ru: "Зубы почти не обтачивал. Оттенок подбирал под цвет глаз и кожи пациентки.",
    },
  },
  {
    id: "case-allon6",
    category: "allOn6",
    title: { uz: "Pastki jag‘ to‘liq tiklash", ru: "Полное восстановление нижней челюсти" },
    image: "/images/case-allon6.jpg",
    focus: "50% 50%",
    problem: {
      uz: "Pastki jag‘da 9 ta tish yo‘q edi, olinadigan protez ovqatlanishga xalaqit berardi.",
      ru: "Отсутствовало 9 зубов, съёмный протез мешал нормально есть.",
    },
    system: { uz: "All-on-6 · Osstem TS III + titan karkas", ru: "All-on-6 · Osstem TS III + титановый каркас" },
    duration: { uz: "5 kun · 3 tashrif", ru: "5 дней · 3 визита" },
    note: {
      uz: "Barcha 6 implantni bitta seansda qo‘ydim. Uchinchi kuni bemor qattiq ovqat bilan tushlik qildi.",
      ru: "Все 6 имплантов установил за один сеанс. На третий день пациент уже обедал твёрдой пищей.",
    },
  },
];

/* ─────────────────────────────── Presets ─────────────────────────────── */

const jamshid: DoctorProfile = {
  id: "jamshid",
  presetLabel: { uz: "Jarroh-implantolog va ortoped", ru: "Хирург-имплантолог и ортопед" },
  name: { uz: "Dr. Jamshid Olimov", ru: "Д-р Джамшид Олимов" },
  signature: "Jamshid Olimov",
  firstName: { uz: "Jamshid", ru: "Джамшид" },
  monogram: "JO",
  title: {
    uz: "Xalqaro toifadagi jarroh-implantolog va stomatolog-ortoped",
    ru: "Хирург-имплантолог и стоматолог-ортопед международной категории",
  },
  practice: {
    uz: "Shaxsiy stomatologik amaliyot · Toshkent",
    ru: "Частная стоматологическая практика · Ташкент",
  },
  heroLead: { uz: "Bu yerda konveyer yo‘q.", ru: "Здесь нет конвейера." },
  heroSub: {
    uz: "3D tashxisdan yakuniy tojgacha davolashning har bir bosqichini Dr. Jamshid Olimov o‘zi bajaradi. Sizni assistentlarga topshirmaydi.",
    ru: "От 3D-диагностики до финальной коронки каждый этап лечения проводит лично Д-р Джамшид Олимов. Без передачи ассистентам.",
  },
  manifesto: {
    uz: [
      "Men 12 yil oldin o‘zimga bitta qoida qo‘ydim: bemorni hech qachon boshqa birovning qo‘liga topshirmayman. Shuning uchun kuniga faqat to‘rt kishini qabul qilaman.",
      "Har bir implant, har bir toj mening ismim bilan chiqadi. Agar natijaga o‘zim ishonmasam, bu ishni qilmayman.",
    ],
    ru: [
      "12 лет назад я поставил себе одно правило: никогда не передавать пациента в чужие руки. Поэтому я принимаю только четырёх человек в день.",
      "Каждый имплант и каждая коронка выходят под моим именем. Если я сам не уверен в результате, я не возьмусь за работу.",
    ],
  },
  portrait: {
    src: "/images/portrait-jamshid.jpg",
    cutout: "/images/cutout-jamshid.webp",
    alt: {
      uz: "Dr. Jamshid Olimov oq xalatda, qo‘llarini qovushtirgan holda",
      ru: "Д-р Джамшид Олимов в белом халате, руки скрещены",
    },
    position: "50% 20%",
  },
  stats: [
    { value: { uz: "12+ yil", ru: "12+ лет" }, label: { uz: "Uzluksiz mikro-jarrohlik tajribasi", ru: "Непрерывной практики в микрохирургии" } },
    { value: { uz: "2,400+", ru: "2\u00A0400+" }, label: { uz: "O‘rnatilgan Osstem va Straumann implantlari", ru: "Установленных имплантов Osstem и Straumann" } },
    { value: { uz: "99.4%", ru: "99,4%" }, label: { uz: "Rasmiy tasdiqlangan osteointegratsiya ko‘rsatkichi", ru: "Подтверждённый показатель остеоинтеграции" } },
  ],
  idCard: {
    licenseId: "UZ-SSV-0412-2014",
    lines: [
      { uz: "ESCD a’zosi (European Society of Cosmetic Dentistry)", ru: "Член ESCD (European Society of Cosmetic Dentistry)" },
      { uz: "Carl Zeiss mikroskopi (25×) bilan ishlaydi", ru: "Работает под микроскопом Carl Zeiss (25×)" },
    ],
  },
  contact: {
    phone: "+998 90 000 00 00",
    telegram: "dr_jamshid_uz",
    instagram: "dr.jamshid.olimov",
    email: "qabul@drolimov.uz",
  },
  address: {
    full: {
      uz: "Toshkent sh., Yakkasaroy tumani, Bobur ko‘chasi 17",
      ru: "г. Ташкент, Яккасарайский район, ул. Бобура, 17",
    },
    short: { uz: "Bobur ko‘chasi 17", ru: "ул. Бобура, 17" },
    landmark: {
      uz: "Mo‘ljal: Bobur bog‘i, asosiy kirish qarshisida",
      ru: "Ориентир: напротив главного входа в парк Бабура",
    },
    lat: 41.28745,
    lng: 69.26083,
  },
  hours: {
    days: { uz: "Dushanba – Shanba", ru: "Понедельник – Суббота" },
    daysShort: { uz: "Du – Sha", ru: "Пн – Сб" },
    time: "09:00 – 19:00",
    openDays: [1, 2, 3, 4, 5, 6],
    openHour: 9,
    closeHour: 19,
  },
  dailyPatients: 4,
  services: [
    {
      id: "navigated-implant",
      title: { uz: "Navigatsion 3D implantatsiya", ru: "Навигационная 3D-имплантация" },
      lead: {
        uz: "Osstem yoki Straumann implanti 3D shablon bo‘yicha, kesishsiz va choklarsiz o‘rnatiladi.",
        ru: "Имплант Osstem или Straumann по 3D-шаблону, без разрезов и швов.",
      },
      specs: [
        { uz: "Jarrohlik: 20–25 daqiqa", ru: "Операция: 20–25 минут" },
        { uz: "Aniqlik: ±0.2 mm", ru: "Точность: ±0.2 мм" },
        { uz: "Kafolat: 10 yil yozma", ru: "Гарантия: 10 лет письменно" },
      ],
      image: "/images/implant-model.jpg",
      calcProblem: "single",
      priceFrom: 7_900_000,
    },
    {
      id: "all-on-x",
      title: { uz: "Total reabilitatsiya (All-on-4 / All-on-6)", ru: "Тотальная реабилитация (All-on-4 / All-on-6)" },
      lead: {
        uz: "Butun jag‘ni 3–5 kun ichida tiklash. Uyga olinmaydigan protez bilan qaytasiz.",
        ru: "Восстановление всей челюсти за 3–5 дней. Уходите домой с несъёмным протезом.",
      },
      specs: [{ uz: "4 yoki 6 implant", ru: "4 или 6 имплантов" }],
      calcProblem: "fullArch",
      priceFrom: 62_000_000,
    },
    {
      id: "micro-veneers",
      title: { uz: "Mikro-vinirlar (E-max va sirkoniy)", ru: "Авторские микро-виниры (E-max и цирконий)" },
      lead: {
        uz: "Tabiiy shaffoflik, tishni agressiv charxlamasdan.",
        ru: "Естественная прозрачность без агрессивной обточки зубов.",
      },
      specs: [{ uz: "Qalinligi 0.3 mm dan", ru: "Толщина от 0.3 мм" }],
      image: "/images/case-veneers.jpg",
      calcProblem: "aesthetic",
      priceFrom: 3_600_000,
    },
    {
      id: "micro-endo",
      title: {
        uz: "Murakkab tishlarni mikroskop ostida saqlab qolish",
        ru: "Спасение сложных зубов под микроскопом",
      },
      lead: {
        uz: "Endodontiya: boshqalar “olib tashlash kerak” degan tishlarni saqlab qolaman.",
        ru: "Эндодонтия: сохраняю зубы, которые другие советуют удалить.",
      },
      specs: [{ uz: "Carl Zeiss 25x", ru: "Carl Zeiss 25x" }],
      image: "/images/microscope.jpg",
      priceFrom: 1_400_000,
    },
  ],
  pricing: sharedPricing,
  ctScanPrice: 450_000,
  installmentMonths: 6,
  credentials: [
    {
      id: "seoul",
      city: { uz: "Seul", ru: "Сеул" },
      country: { uz: "Janubiy Koreya", ru: "Южная Корея" },
      institution: "Osstem AIC Implant Training Center",
      program: { uz: "Ilg‘or implantologiya bo‘yicha Master Course", ru: "Master Course по продвинутой имплантологии" },
      year: 2019,
      hours: 160,
      certificateId: "AIC-KR-2019-0847",
    },
    {
      id: "munich",
      city: { uz: "Myunxen", ru: "Мюнхен" },
      country: { uz: "Germaniya", ru: "Германия" },
      institution: "Dental Excellence Campus München",
      program: { uz: "Raqamli protetika va navigatsion jarrohlik amaliyoti", ru: "Стажировка по цифровой ортопедии и навигационной хирургии" },
      year: 2021,
      hours: 120,
      certificateId: "DEC-DE-2021-3312",
    },
    {
      id: "escd",
      city: { uz: "Brussel", ru: "Брюссель" },
      country: { uz: "Belgiya", ru: "Бельгия" },
      institution: "European Society of Cosmetic Dentistry",
      program: { uz: "Faol a’zolik va estetik restavratsiya standarti", ru: "Действительное членство и стандарт эстетической реставрации" },
      year: 2022,
      hours: 48,
      certificateId: "ESCD-M-22-1190",
    },
    {
      id: "tashkent",
      city: { uz: "Toshkent", ru: "Ташкент" },
      country: { uz: "O‘zbekiston", ru: "Узбекистан" },
      institution: "Toshkent davlat stomatologiya instituti",
      program: { uz: "Stomatologiya diplomi va ortopediya rezidenturasi", ru: "Диплом стоматолога и ординатура по ортопедии" },
      year: 2014,
      hours: 6200,
      certificateId: "TDSI-2014-0412",
    },
  ],
  cases: sharedCases,
};

const sardor: DoctorProfile = {
  ...jamshid,
  id: "sardor",
  presetLabel: { uz: "Estetik stomatolog · mikro-vinirlar", ru: "Эстетический стоматолог · Микро-виниры" },
  name: { uz: "Dr. Sardor Rahimov", ru: "Д-р Сардор Рахимов" },
  signature: "Sardor Rahimov",
  firstName: { uz: "Sardor", ru: "Сардор" },
  monogram: "SR",
  title: {
    uz: "Estetik stomatolog · mikro-vinirlar va gnatologiya mutaxassisi",
    ru: "Эстетический стоматолог · специалист по микро-винирам и гнатологии",
  },
  practice: {
    uz: "Shaxsiy estetik stomatologiya studiyasi · Toshkent",
    ru: "Частная студия эстетической стоматологии · Ташкент",
  },
  heroLead: { uz: "Tabassum shablon emas.", ru: "Улыбка не по шаблону." },
  heroSub: {
    uz: "Har bir vinir yuzingiz, mimikangiz va tishlashingiz asosida loyihalanadi. Dizayndan fiksatsiyagacha Dr. Sardor Rahimov o‘zi ishlaydi.",
    ru: "Каждый винир проектируется по вашему лицу, мимике и прикусу. От дизайна до фиксации работает лично Д-р Сардор Рахимов.",
  },
  manifesto: {
    uz: [
      "Men tishlarni “oq” qilmayman, ularni sizniki qilaman. Har bir tabassum avval ekranda, keyin og‘zingizda sinovdan o‘tadi.",
      "Agar vinir tabiiy ko‘rinmasa, bu mening xatoim. Shuning uchun kuniga faqat to‘rt bemor bilan ishlayman.",
    ],
    ru: [
      "Я не делаю зубы «белыми», я делаю их вашими. Каждая улыбка сначала проходит примерку на экране, затем во рту.",
      "Если винир выглядит неестественно, это моя ошибка. Поэтому я работаю только с четырьмя пациентами в день.",
    ],
  },
  portrait: {
    src: "/images/portrait-sardor.jpg",
    cutout: "/images/cutout-sardor.webp",
    alt: {
      uz: "Dr. Sardor Rahimov oq ko‘ylakda, stetoskop bilan",
      ru: "Д-р Сардор Рахимов в белой рубашке со стетоскопом",
    },
    position: "50% 18%",
  },
  stats: [
    { value: { uz: "9+ yil", ru: "9+ лет" }, label: { uz: "Estetik restavratsiya tajribasi", ru: "Опыта в эстетической реставрации" } },
    { value: { uz: "1,850+", ru: "1\u00A0850+" }, label: { uz: "O‘rnatilgan E-max va sirkoniy vinirlar", ru: "Установленных виниров E-max и цирконий" } },
    { value: { uz: "0.3 mm", ru: "0,3 мм" }, label: { uz: "Minimal preparatsiya qalinligi", ru: "Минимальная толщина препарирования" } },
  ],
  idCard: {
    licenseId: "UZ-SSV-0977-2017",
    lines: [
      { uz: "ESCD a’zosi (European Society of Cosmetic Dentistry)", ru: "Член ESCD (European Society of Cosmetic Dentistry)" },
      { uz: "Digital Smile Design sertifikatlangan mutaxassis", ru: "Сертифицированный специалист Digital Smile Design" },
    ],
  },
  contact: {
    phone: "+998 93 000 00 00",
    telegram: "dr_sardor_smile",
    instagram: "dr.sardor.rahimov",
    email: "studio@drrahimov.uz",
  },
  address: {
    full: {
      uz: "Toshkent sh., Mirobod tumani, Taras Shevchenko ko‘chasi 21",
      ru: "г. Ташкент, Мирабадский район, ул. Тараса Шевченко, 21",
    },
    short: { uz: "T. Shevchenko ko‘chasi 21", ru: "ул. Т. Шевченко, 21" },
    landmark: { uz: "Mo‘ljal: Kosmonavtlar metrosi yonida", ru: "Ориентир: рядом с метро «Космонавтлар»" },
    lat: 41.30205,
    lng: 69.27991,
  },
  services: [
    {
      id: "micro-veneers",
      title: { uz: "Mikro-vinirlar (E-max va sirkoniy)", ru: "Авторские микро-виниры (E-max и цирконий)" },
      lead: {
        uz: "0.3 mm qalinlikdagi vinirlar: tabiiy shaffoflik, tishni agressiv charxlamasdan.",
        ru: "Виниры толщиной от 0.3 мм: естественная прозрачность без агрессивной обточки.",
      },
      specs: [
        { uz: "Raqamli dizayn + mock-up", ru: "Цифровой дизайн + mock-up" },
        { uz: "2 tashrif, 9 kun", ru: "2 визита, 9 дней" },
        { uz: "Kafolat: 5 yil yozma", ru: "Гарантия: 5 лет письменно" },
      ],
      image: "/images/case-veneers.jpg",
      calcProblem: "aesthetic",
      priceFrom: 3_600_000,
    },
    {
      id: "gnathology",
      title: { uz: "Gnatologiya va tishlashni tiklash", ru: "Гнатология и восстановление прикуса" },
      lead: {
        uz: "Jag‘ bo‘g‘imi og‘rig‘i va tish yeyilishini raqamli tahlil asosida davolash.",
        ru: "Лечение боли в ВНЧС и стираемости зубов на основе цифрового анализа.",
      },
      specs: [{ uz: "T-Scan raqamli tahlil", ru: "Цифровой анализ T-Scan" }],
      priceFrom: 2_400_000,
    },
    {
      id: "navigated-implant",
      title: { uz: "Navigatsion 3D implantatsiya", ru: "Навигационная 3D-имплантация" },
      lead: {
        uz: "Estetik zonada implant: shablon bo‘yicha, kesishsiz.",
        ru: "Имплант в эстетической зоне: по шаблону, без разрезов.",
      },
      specs: [{ uz: "Osstem / Straumann", ru: "Osstem / Straumann" }],
      image: "/images/implant-model.jpg",
      calcProblem: "single",
      priceFrom: 7_900_000,
    },
    {
      id: "micro-endo",
      title: { uz: "Mikroskop ostida tishni saqlab qolish", ru: "Сохранение зуба под микроскопом" },
      lead: {
        uz: "Endodontiya: boshqalar “olib tashlash kerak” degan tishlarni saqlab qolaman.",
        ru: "Эндодонтия: сохраняю зубы, которые другие советуют удалить.",
      },
      specs: [{ uz: "Carl Zeiss 25x", ru: "Carl Zeiss 25x" }],
      image: "/images/microscope.jpg",
      priceFrom: 1_400_000,
    },
  ],
  credentials: [
    {
      id: "seoul",
      city: { uz: "Seul", ru: "Сеул" },
      country: { uz: "Janubiy Koreya", ru: "Южная Корея" },
      institution: "Seoul Aesthetic Dentistry Academy",
      program: { uz: "Minimal invaziv vinirlar bo‘yicha amaliy kurs", ru: "Практический курс минимально инвазивных виниров" },
      year: 2020,
      hours: 96,
      certificateId: "SADA-KR-2020-0215",
    },
    {
      id: "munich",
      city: { uz: "Myunxen", ru: "Мюнхен" },
      country: { uz: "Germaniya", ru: "Германия" },
      institution: "Dental Excellence Campus München",
      program: { uz: "Gnatologiya va funksional okklyuziya", ru: "Гнатология и функциональная окклюзия" },
      year: 2022,
      hours: 80,
      certificateId: "DEC-DE-2022-4471",
    },
    {
      id: "escd",
      city: { uz: "Brussel", ru: "Брюссель" },
      country: { uz: "Belgiya", ru: "Бельгия" },
      institution: "European Society of Cosmetic Dentistry",
      program: { uz: "Faol a’zolik va estetik restavratsiya standarti", ru: "Действительное членство и стандарт эстетической реставрации" },
      year: 2023,
      hours: 48,
      certificateId: "ESCD-M-23-1622",
    },
    {
      id: "tashkent",
      city: { uz: "Toshkent", ru: "Ташкент" },
      country: { uz: "O‘zbekiston", ru: "Узбекистан" },
      institution: "Toshkent davlat stomatologiya instituti",
      program: { uz: "Stomatologiya diplomi va terapevtik rezidentura", ru: "Диплом стоматолога и ординатура по терапии" },
      year: 2017,
      hours: 6200,
      certificateId: "TDSI-2017-0977",
    },
  ],
  cases: [sharedCases[1], sharedCases[0], sharedCases[2]],
};

const iqboljon: DoctorProfile = {
  ...jamshid,
  id: "iqboljon",
  presetLabel: { uz: "Stomatolog · Toshkent", ru: "Стоматолог · Ташкент" },
  name: { uz: "Dr. Iqboljon Jo‘raev", ru: "Д-р Икболжон Жураев" },
  signature: "Iqboljon Joraev",
  firstName: { uz: "Iqboljon", ru: "Икболжон" },
  monogram: "IJ",
  title: {
    uz: "Stomatolog · og‘riqsiz, sifatli va ishonchli davolash",
    ru: "Стоматолог · безболезненное, качественное и надёжное лечение",
  },
  heroLead: { uz: "Og‘riqsiz. Shoshilmasdan.", ru: "Без боли. Без спешки." },
  heroSub: {
    uz: "Tishlaringizni og‘riqsiz, sifatli va ishonchli davolayman. Ko‘rikdan yakuniy natijagacha har bir bosqichni o‘zim bajaraman: 10 yillik tajriba, 10 000 dan ortiq bemor.",
    ru: "Лечу зубы безболезненно, качественно и надёжно. Каждый этап от осмотра до результата провожу сам: 10 лет практики, более 10 000 пациентов.",
  },
  manifesto: {
    uz: [
      "Men 10 yil oldin o‘zimga bitta qoida qo‘ydim: bemorni hech qachon boshqa birovning qo‘liga topshirmayman. Tishlaringizni og‘riqsiz, sifatli va ishonchli davolayman.",
      "Har bir plomba, har bir toj mening ismim bilan chiqadi. Agar natijaga o‘zim ishonmasam, bu ishni qilmayman.",
    ],
    ru: [
      "10 лет назад я поставил себе одно правило: никогда не передавать пациента в чужие руки. Лечу зубы безболезненно, качественно и надёжно.",
      "Каждая пломба и каждая коронка выходят под моим именем. Если я сам не уверен в результате, я не возьмусь за работу.",
    ],
  },
  portrait: {
    src: "/images/portrait-iqboljon.jpg",
    cutout: "/images/cutout-iqboljon.webp",
    alt: {
      uz: "Dr. Iqboljon Jo‘raev oq xalatda, qo‘llarini qovushtirgan holda",
      ru: "Д-р Икболжон Жураев в белом халате, руки скрещены",
    },
    position: "50% 22%",
  },
  stats: [
    { value: { uz: "10+ yil", ru: "10+ лет" }, label: { uz: "Stomatologik amaliyot tajribasi", ru: "Стоматологической практики" } },
    { value: { uz: "10,000+", ru: "10 000+" }, label: { uz: "Muvaffaqiyatli davolangan bemorlar", ru: "Успешно пролеченных пациентов" } },
    jamshid.stats[2],
  ],
  contact: {
    phone: "+998 90 990 39 94",
    telegram: "Doctor_Iqboljon",
    instagram: "iqbol_joraev",
  },
  calcProblems: ["treatment", "aesthetic", "rootCanal", "single"],
  protocolDrawing: "visit",
  urgentCta: true,
  services: [
    {
      id: "ceramic-crowns",
      title: { uz: "Keramik qoplamalar: sirkon va E-max", ru: "Керамические коронки: цирконий и E-max" },
      lead: {
        uz: "Eski yoki shikastlangan tishlarga tabiiy rang va shakldagi qoplamalar va vinirlar.",
        ru: "Коронки и виниры естественного цвета и формы на старые или повреждённые зубы.",
      },
      specs: [
        { uz: "Sirkon yoki E-max", ru: "Цирконий или E-max" },
        { uz: "2 tashrif", ru: "2 визита" },
        { uz: "Kafolat: 5 yil yozma", ru: "Гарантия: 5 лет письменно" },
      ],
      image: "/images/cases/zirconia-renew.jpg",
      calcProblem: "aesthetic",
      priceFrom: 3_600_000,
    },
    {
      id: "composite-restoration",
      title: { uz: "Kompozit restavratsiya", ru: "Композитная реставрация" },
      lead: {
        uz: "Karies va nuqsonli tishlarni bir tashrifda, tish rangidagi plomba bilan tiklayman.",
        ru: "Восстанавливаю зубы после кариеса и сколов за один визит пломбой в цвет зуба.",
      },
      specs: [{ uz: "Nur bilan qotuvchi kompozit", ru: "Светоотверждаемый композит" }],
      calcProblem: "treatment",
      priceFrom: 450_000,
    },
    {
      id: "full-rehab",
      title: { uz: "To‘liq tiklash va implantlar", ru: "Полное восстановление и импланты" },
      lead: {
        uz: "Tishlar to‘liq yo‘q bo‘lsa ham: implantlar va qoplamalar bilan funksiya va tabassumni tiklayman.",
        ru: "Даже при полном отсутствии зубов восстанавливаю функцию и улыбку имплантами и коронками.",
      },
      specs: [{ uz: "Implant + qoplamalar", ru: "Импланты + коронки" }],
      image: "/images/implant-model.jpg",
      calcProblem: "single",
      priceFrom: 7_900_000,
    },
    {
      id: "painless-treatment",
      title: { uz: "Og‘riqsiz davolash va kanallar", ru: "Безболезненное лечение и каналы" },
      lead: {
        uz: "Karies, pulpit va kanallarni kompyuterli anesteziya bilan davolayman.",
        ru: "Лечу кариес, пульпит и каналы под компьютерной анестезией.",
      },
      specs: [{ uz: "Kompyuterli anesteziya", ru: "Компьютерная анестезия" }],
      calcProblem: "rootCanal",
      priceFrom: 1_200_000,
    },
  ],
  cases: [
    {
      id: "ig-veneers",
      category: "veneers",
      title: { uz: "Keramik vinirlar: tug‘ma nuqson", ru: "Керамические виниры: врождённый дефект" },
      image: "/images/cases/veneers.jpg",
      focus: "50% 62%",
      source: { url: "https://www.instagram.com/p/DclSKG7gkM4/", date: { uz: "28.08.2026", ru: "28.08.2026" } },
      problem: { uz: "O‘ng yon kurak tishning shakli tug‘ma o‘zgargan, chap yon kurak tish tug‘ma yo‘q va uning o‘rniga qoziq tish siljigan.", ru: "Врождённо изменена форма правого бокового резца; левого бокового резца нет с рождения, на его место сместился клык." },
      system: { uz: "Estetik keramik vinirlar", ru: "Эстетические керамические виниры" },
      note: { uz: "Maksimal tabiiylikni saqlash va sog‘lom tishlarga zarar yetkazmaslik: har kungi vazifamiz.", ru: "Сохранить максимальную естественность и не навредить здоровым зубам: наша ежедневная задача." },
    },
    {
      id: "ig-zirconia-renew",
      category: "crowns",
      title: { uz: "Eski koronkalarni yangilash", ru: "Замена старых коронок" },
      image: "/images/cases/zirconia-renew.jpg",
      focus: "50% 58%",
      source: { url: "https://www.instagram.com/p/DbIuTPagoYE/", date: { uz: "22.07.2026", ru: "22.07.2026" } },
      problem: { uz: "Eski, sarg‘aygan koronkalar tabassumni xira qilib qo‘ygan edi.", ru: "Старые пожелтевшие коронки делали улыбку тусклой." },
      system: { uz: "Sirkon keramik qoplamalar", ru: "Циркониевые керамические коронки" },
      note: { uz: "Eski sariq koronkalarni sirkon keramikaga almashtirdik, tishlarning tabiiy shaklini saqlab qoldik.", ru: "Заменили старые жёлтые коронки на циркониевую керамику и сохранили естественную форму зубов." },
    },
    {
      id: "ig-composite",
      category: "composite",
      title: { uz: "Oldingi tishlarda kompozit restavratsiya", ru: "Композитная реставрация передних зубов" },
      image: "/images/cases/composite.jpg",
      focus: "50% 62%",
      source: { url: "https://www.instagram.com/p/DbDkpLZArAd/", date: { uz: "20.07.2026", ru: "20.07.2026" } },
      problem: { uz: "Yuqori oldingi tishlarda karies va estetik nuqson.", ru: "Кариес и эстетический дефект передних зубов верхней челюсти." },
      system: { uz: "Nur bilan qotuvchi kompozit plombalar", ru: "Светоотверждаемые композитные пломбы" },
      note: { uz: "Kariesni davoladik va tishlarning tabiiy ko‘rinishini tikladik.", ru: "Вылечили кариес и вернули зубам естественный вид." },
    },
    {
      id: "ig-emax",
      category: "crowns",
      title: { uz: "Oldingi tishlarga E-max qoplamalar", ru: "Коронки E-max на передние зубы" },
      image: "/images/cases/emax-crowns.jpg",
      focus: "50% 55%",
      source: { url: "https://www.instagram.com/p/DOBkocSAgjP/", date: { uz: "31.08.2025", ru: "31.08.2025" } },
      problem: { uz: "Yuqori jag‘ oldingi tishlarining rangi va shaklidan bemor norozi edi.", ru: "Пациента не устраивали цвет и форма передних зубов верхней челюсти." },
      system: { uz: "E-max keramik qoplamalar", ru: "Керамические коронки E-max" },
      note: { uz: "Tishlarning rangi va shakli tabiiy ko‘rinishda o‘zgartirildi. Go‘zal tabassum ishonch manbai.", ru: "Цвет и форма зубов изменены естественно. Красивая улыбка даёт уверенность." },
    },
    {
      id: "ig-zirconia-full",
      category: "crowns",
      title: { uz: "Ikki jag‘ga sirkon qoplamalar", ru: "Циркониевые коронки на обе челюсти" },
      image: "/images/cases/zirconia-full.jpg",
      focus: "50% 55%",
      source: { url: "https://www.instagram.com/p/DPluH_XguUI/", date: { uz: "09.10.2025", ru: "09.10.2025" } },
      problem: { uz: "Yuqori va pastki jag‘ tishlarida estetik muammolar.", ru: "Эстетические проблемы зубов верхней и нижней челюсти." },
      system: { uz: "Sirkon keramik qoplamalar", ru: "Циркониевые керамические коронки" },
      note: { uz: "Rang va shakl tabiiy ko‘rinishda: bemor yangi tabassum bilan ketdi.", ru: "Естественные цвет и форма: пациент ушёл с новой улыбкой." },
    },
    {
      id: "ig-full-rehab",
      category: "rehab",
      title: { uz: "To‘liq tiklash: 12 ta implant", ru: "Полное восстановление: 12 имплантов" },
      image: "/images/cases/full-rehab.jpg",
      focus: "50% 80%",
      source: { url: "https://www.instagram.com/p/DQUJ2DHAoDr/", date: { uz: "27.10.2025", ru: "27.10.2025" } },
      problem: { uz: "Yuqori va pastki jag‘da tishlar to‘liq yo‘q edi.", ru: "На верхней и нижней челюсти полностью отсутствовали зубы." },
      system: { uz: "12 ta implant va metallokeramik qoplamalar", ru: "12 имплантов и металлокерамические коронки" },
      note: { uz: "Tish qatorlarini funksional va estetik tikladik.", ru: "Восстановили зубные ряды функционально и эстетично." },
    },
  ],
  copy: {
    uz: {
      approach: {
        points: [
          { k: "Bitta mas’ul shifokor", v: "Ko‘rikdan oxirgi plombagacha sizni faqat men davolayman." },
          { k: "Og‘riqsiz protokol", v: "Avval anestetik gel, keyin kompyuterli anesteziya: ukol deyarli sezilmaydi." },
          { k: "Shaxsiy Telegram aloqa", v: "Davolashdan keyin savollaringizga ma’mur emas, o‘zim javob beraman." },
          { k: "Yozma kafolat", v: "Har bir plomba, toj va implantga yozma kafolat beriladi." },
        ],
      },
      protocol: {
        title: "Og‘riqsiz qabul qanday o‘tadi",
        sub: "Bitta tishni davolash misolida. Pastga aylantiring: chizma har bir bosqich bilan quriladi.",
        drawingLabel: "Og‘riqsiz davolash chizmasi, bosqichma-bosqich",
        callouts: { plan: "Davolash rejasi" },
        steps: [
          {
            title: "Ko‘rik va rentgen",
            short: "Muammoni aniq ko‘ramiz",
            body: "Tishlarni tekshiraman va rentgen olaman. Karies qayerda va qanchalik chuqur ekanini birga ekranda ko‘ramiz.",
            duration: "15–20 daqiqa",
            equipment: [],
            comfortText: "Og‘riqsiz, hech qanday muolaja yo‘q",
          },
          {
            title: "Reja va yozma narx",
            short: "Boshlashdan oldin hammasini bilasiz",
            body: "Nima qilinishini va qancha turishini yozma aytaman. Rozilik bermaguningizcha hech narsa boshlanmaydi.",
            duration: "Shu tashrifda",
            equipment: [],
            comfortText: "Faqat suhbat",
          },
          {
            title: "Avval gel, keyin anesteziya",
            short: "Ukol deyarli sezilmaydi",
            body: "Milkka anestetik gel surtaman, so‘ng kompyuterli anesteziya dorini sekin va bir tekisda yuboradi. Bosim ham, achishish ham bo‘lmaydi.",
            duration: "3–5 daqiqa",
            equipment: [],
            comfortText: "Ukol deyarli sezilmaydi",
          },
          {
            title: "Qo‘l ko‘tarsangiz, to‘xtayman",
            short: "Nazorat sizning qo‘lingizda",
            body: "Kariesni tozalab, tish rangiga mos plomba qo‘yaman. Dam olish yoki savol berish uchun qo‘lingizni ko‘tarsangiz kifoya, darhol to‘xtayman.",
            duration: "30–40 daqiqa",
            equipment: [],
            comfortText: "Anesteziya ostida, og‘riqsiz",
          },
          {
            title: "Kuzatuv va kafolat",
            short: "Davolashdan keyin ham yoningizdaman",
            body: "Savollaringizga Telegramda o‘zim javob beraman. Plombaga 2 yillik yozma kafolat, har 6 oyda nazorat ko‘rigi.",
            duration: "Har 6 oyda · 30 daqiqa",
            equipment: [],
            comfortText: "To‘liq qulay",
          },
        ],
      },
      services: {
        title: "Plombadan to‘liq tiklashgacha.",
        sub: "Kompozit, keramik qoplamalar, kanallar va implantlar: hammasini bitta shifokor, og‘riqsiz bajaradi. Narxlar oldindan ma’lum.",
      },
      calc: {
        sub: "Bir necha savolga javob bering va taxminiy narxni hoziroq ko‘ring.",
        problems: { single: "Tish yo‘q (implant)", aesthetic: "Qoplama yoki vinir (sirkon, E-max)" },
        materials: { premium: "Optimal", swiss: "Premium" },
        materialNotes: {
          premium: "Sifatli Koreya va Yevropa materiallari",
          swiss: "Shveysariya va Germaniya premium materiallari",
        },
        surgery: "Muolaja vaqti",
        fixed: "Yakuniy narx ko‘rikdan keyin yozma belgilanadi va o‘zgarmaydi.",
      },
      cases: { filters: { veneers: "Vinirlar" } },
      faq: {
        items: [
          {
            q: "Birinchi tashrifda nima bo‘ladi?",
            a: "30–40 daqiqalik ko‘rik: tishlarni tekshiraman, kerak bo‘lsa rentgen olaman, so‘ng davolash rejasi va yozma narxni beraman. Ko‘rik hech narsaga majburlamaydi.",
          },
          {
            q: "Davolash og‘riqlimi? Ukoldan qo‘rqaman.",
            a: "Yo‘q. Avval milkka anestetik gel surtaman, keyin kompyuterli anesteziya ukolni deyarli sezdirmaydi. Qo‘lingizni ko‘tarsangiz, darhol to‘xtayman.",
          },
          {
            q: "Tishim hozir og‘riyapti. Tezroq qabul qilasizmi?",
            a: "Telegramda yozing yoki qo‘ng‘iroq qiling. O‘tkir og‘riq bilan murojaat qilgan bemorlarni o‘sha kuni yoki ertasiga qabul qilishga harakat qilaman.",
          },
          {
            q: "Kafolat qanday rasmiylashtiriladi?",
            a: "Har bir ish uchun yozma kafolat beriladi: plombaga 2 yil, tojga 5 yil, implantga 10 yil.",
          },
          {
            q: "Bo‘lib to‘lash mumkinmi?",
            a: "Implant va protezlash uchun 6 oygacha 0% muddatli to‘lov bor. Uzcard, Humo, Visa va naqd pul qabul qilinadi.",
          },
          {
            q: "Davolash qancha vaqt oladi?",
            a: "Plomba yoki tozalash: 1 tashrif. Kanal davolash: 1–2 tashrif. Bitta implant: 2–3 tashrif. Aniq jadvalni ko‘rikdan keyin beraman.",
          },
        ],
      },
    },
    ru: {
      approach: {
        points: [
          { k: "Один ответственный врач", v: "От осмотра до последней пломбы вас лечу только я." },
          { k: "Безболезненный протокол", v: "Сначала анестезирующий гель, затем компьютерная анестезия: укол почти не чувствуется." },
          { k: "Личная связь в Telegram", v: "После лечения на ваши вопросы отвечаю я сам, а не администратор." },
          { k: "Письменная гарантия", v: "На каждую пломбу, коронку и имплант выдаётся письменная гарантия." },
        ],
      },
      protocol: {
        title: "Как проходит приём без боли",
        sub: "На примере лечения одного зуба. Прокрутите вниз: чертёж строится с каждым этапом.",
        drawingLabel: "Чертёж безболезненного лечения по этапам",
        callouts: { plan: "План лечения" },
        steps: [
          {
            title: "Осмотр и снимок",
            short: "Видим проблему точно",
            body: "Осматриваю зубы и делаю снимок. Вместе смотрим на экране, где кариес и насколько он глубокий.",
            duration: "15–20 минут",
            equipment: [],
            comfortText: "Безболезненно, без процедур",
          },
          {
            title: "План и письменная цена",
            short: "Всё знаете до начала",
            body: "Пишу, что будем делать и сколько это стоит. Пока вы не согласитесь, ничего не начинаем.",
            duration: "В тот же визит",
            equipment: [],
            comfortText: "Только беседа",
          },
          {
            title: "Сначала гель, потом анестезия",
            short: "Укол почти не чувствуется",
            body: "Наношу на десну анестезирующий гель, затем компьютерная анестезия вводит препарат медленно и равномерно. Ни давления, ни жжения.",
            duration: "3–5 минут",
            equipment: [],
            comfortText: "Укол почти не чувствуется",
          },
          {
            title: "Поднимете руку, и я остановлюсь",
            short: "Контроль в ваших руках",
            body: "Убираю кариес и ставлю пломбу в цвет зуба. Чтобы отдохнуть или спросить, достаточно поднять руку: я сразу остановлюсь.",
            duration: "30–40 минут",
            equipment: [],
            comfortText: "Под анестезией, без боли",
          },
          {
            title: "Наблюдение и гарантия",
            short: "Я рядом и после лечения",
            body: "На вопросы в Telegram отвечаю сам. Письменная гарантия на пломбу 2 года, контрольный осмотр каждые 6 месяцев.",
            duration: "Каждые 6 месяцев · 30 минут",
            equipment: [],
            comfortText: "Полностью комфортно",
          },
        ],
      },
      services: {
        title: "От пломбы до полного восстановления.",
        sub: "Композит, керамические коронки, каналы и импланты: всё делает один врач и без боли. Цены известны заранее.",
      },
      calc: {
        sub: "Ответьте на несколько вопросов и сразу увидите ориентировочную цену.",
        problems: { single: "Нет зуба (имплант)", aesthetic: "Коронка или винир (цирконий, E-max)" },
        materials: { premium: "Оптимальный", swiss: "Премиум" },
        materialNotes: {
          premium: "Качественные корейские и европейские материалы",
          swiss: "Премиальные материалы из Швейцарии и Германии",
        },
        surgery: "Время процедуры",
        fixed: "Итоговая цена фиксируется письменно после осмотра и не меняется.",
      },
      cases: { filters: { veneers: "Виниры" } },
      faq: {
        items: [
          {
            q: "Что будет на первом приёме?",
            a: "Осмотр 30–40 минут: проверяю зубы, при необходимости делаю снимок, затем даю план лечения и письменную цену. Осмотр ни к чему не обязывает.",
          },
          {
            q: "Лечение болезненное? Я боюсь уколов.",
            a: "Нет. Сначала наношу на десну анестезирующий гель, затем компьютерная анестезия делает укол почти незаметным. Поднимете руку, и я сразу остановлюсь.",
          },
          {
            q: "У меня болит зуб прямо сейчас. Примете быстрее?",
            a: "Напишите в Telegram или позвоните. Пациентов с острой болью стараюсь принять в тот же день или на следующий.",
          },
          {
            q: "Как оформляется гарантия?",
            a: "На каждую работу выдаётся письменная гарантия: на пломбу 2 года, на коронку 5 лет, на имплант 10 лет.",
          },
          {
            q: "Можно ли платить частями?",
            a: "На импланты и протезирование есть рассрочка 0% до 6 месяцев. Принимаем Uzcard, Humo, Visa и наличные.",
          },
          {
            q: "Сколько длится лечение?",
            a: "Пломба или чистка: 1 визит. Лечение каналов: 1–2 визита. Один имплант: 2–3 визита. Точный график дам после осмотра.",
          },
        ],
      },
    },
  },
};

export const doctorPresets = { iqboljon, jamshid, sardor } satisfies Record<string, DoctorProfile>;
export type PresetId = keyof typeof doctorPresets;

/* ───────────────────────────── Site settings ───────────────────────────── */

export const site = {
  activePresetId: "iqboljon" as PresetId,
  defaultLang: "uz" as Lang,
  /** Floating "Demo Rejimi" pill. Turn off for a real client launch. */
  showDemoSwitcher: true,
  /** Adds a one-line note in the footer that names and cases are illustrative. */
  isDemo: true,
  /** UZS per 1 USD, used for the "≈ $" hint in the calculator. */
  usdRate: 12_650,
  url: "https://drolimov.uz",
};

export const defaultDoctor: DoctorProfile = doctorPresets[site.activePresetId];
