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

export type Lang = "uz" | "ru";
export type Localized<T = string> = Record<Lang, T>;

export type ProblemId = "single" | "multiple" | "fullArch" | "aesthetic";
export type MaterialId = "premium" | "swiss";
export type CaseCategory = "implant" | "veneers" | "allOn6";

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
  image: string;
  /** CSS object-position for the slider crop. */
  focus: string;
  problem: Localized;
  system: Localized;
  duration: Localized;
  note: Localized;
  noteLength: string;
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
  portrait: { src: string; alt: Localized; position: string };
  stats: { value: Localized; label: Localized }[];
  idCard: { licenseId: string; lines: Localized[] };
  contact: {
    phone: string;
    telegram: string;
    instagram: string;
    email: string;
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
  credentials: Credential[];
  cases: ClinicalCase[];
  /** Optional MP4 / YouTube-embed URL for the 1-minute intro. */
  introVideoUrl?: string;
}

/* ───────────────────────────── Shared data ───────────────────────────── */

const sharedPricing: Record<ProblemId, ProblemPricing> = {
  single: {
    premium: { min: 7_900_000, max: 9_400_000 },
    swiss: { min: 13_800_000, max: 16_500_000 },
    visits: { uz: "2–3 tashrif", ru: "2–3 визита" },
    surgeryTime: { uz: "25 daqiqa", ru: "25 минут" },
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
      { uz: "Doimiy protez 72 soat ichida", ru: "Постоянный протез за 72 часа" },
      { uz: "Mehmonxona va transfer (xorijiy bemorlarga)", ru: "Отель и трансфер для иногородних" },
    ],
  },
  aesthetic: {
    premium: { min: 3_600_000, max: 4_300_000 },
    swiss: { min: 5_200_000, max: 6_100_000 },
    unitNote: { uz: "1 birlik (vinir / toj) uchun", ru: "за 1 единицу (винир / коронка)" },
    visits: { uz: "2 tashrif", ru: "2 визита" },
    surgeryTime: { uz: "Jarrohliksiz · 2×90 daqiqa", ru: "Без хирургии · 2×90 минут" },
    bonuses: [
      { uz: "Bepul raqamli tabassum dizayni", ru: "Бесплатный цифровой дизайн улыбки" },
      { uz: "Og‘izda sinov modeli (mock-up)", ru: "Примерка во рту (mock-up)" },
      { uz: "Oqartirish sovg‘a sifatida", ru: "Отбеливание в подарок" },
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
      uz: "Implantni navigatsion shablon bilan, kesishsiz qo‘ydik. Bemor o‘sha kuni kechqurun ishga qaytdi.",
      ru: "Имплант установили по навигационному шаблону, без разрезов. Вечером того же дня пациент вернулся к работе.",
    },
    noteLength: "0:38",
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
      uz: "Tishlarni deyarli charxlamadik. Rangni bemorning ko‘zi va terisi ohangiga moslab tanladik.",
      ru: "Зубы почти не обтачивали. Оттенок подбирали под цвет глаз и кожи пациентки.",
    },
    noteLength: "0:51",
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
      uz: "Barcha 6 implantni bitta seansda qo‘ydik. Uchinchi kuni bemor qattiq ovqat bilan tushlik qildi.",
      ru: "Все 6 имплантов установлены за один сеанс. На третий день пациент уже обедал твёрдой пищей.",
    },
    noteLength: "1:04",
  },
];

/* ─────────────────────────────── Presets ─────────────────────────────── */

const jamshid: DoctorProfile = {
  id: "jamshid",
  presetLabel: { uz: "Jarroh-Implantolog & Ortoped", ru: "Хирург-имплантолог и ортопед" },
  name: { uz: "Dr. Jamshid Olimov", ru: "Д-р Джамшид Олимов" },
  signature: "Jamshid Olimov",
  firstName: { uz: "Jamshid", ru: "Джамшид" },
  monogram: "JO",
  title: {
    uz: "Xalqaro toifadagi Jarroh-Implantolog va Stomatolog-Ortoped",
    ru: "Хирург-имплантолог и стоматолог-ортопед международной категории",
  },
  practice: {
    uz: "Shaxsiy Stomatologik Amaliyot · Toshkent",
    ru: "Частная стоматологическая практика · Ташкент",
  },
  heroLead: { uz: "Stomatologiyada konveyer yo‘q.", ru: "В стоматологии нет конвейера." },
  heroSub: {
    uz: "Katta klinikalarda bemor yosh assistentlar qo‘lidan qo‘liga o‘tadi. Bu yerda 3D tashxis, mikro-jarrohlik va yakuniy estetik fiksatsiyani boshidan oxirigacha faqat Dr. Jamshid Olimov o‘zi bajaradi.",
    ru: "В крупных клиниках пациента передают от ассистента к ассистенту. Здесь 3D-диагностику, микрохирургию и финальную эстетическую фиксацию от начала до конца проводит лично Д-р Джамшид Олимов.",
  },
  manifesto: {
    uz: [
      "Men 12 yil oldin o‘zimga bitta qoida qo‘ydim: bemorni hech qachon boshqa birovning qo‘liga topshirmayman. Shuning uchun kuniga faqat to‘rt kishini qabul qilaman.",
      "Har bir implant, har bir toj mening ismim bilan chiqadi. Agar men natijaga o‘zim ishonmasam, uni og‘zingizga qo‘ymayman.",
    ],
    ru: [
      "12 лет назад я поставил себе одно правило: никогда не передавать пациента в чужие руки. Поэтому я принимаю только четырёх человек в день.",
      "Каждый имплант и каждая коронка выходят под моим именем. Если я сам не уверен в результате, я не установлю его вам.",
    ],
  },
  portrait: {
    src: "/images/portrait-jamshid.jpg",
    alt: {
      uz: "Dr. Jamshid Olimov oq xalatda, qo‘llarini qovushtirgan holda",
      ru: "Д-р Джамшид Олимов в белом халате, руки скрещены",
    },
    position: "50% 20%",
  },
  stats: [
    { value: { uz: "12+ YIL", ru: "12+ ЛЕТ" }, label: { uz: "Uzluksiz mikro-jarrohlik tajribasi", ru: "Непрерывной практики в микрохирургии" } },
    { value: { uz: "2,400+", ru: "2\u00A0400+" }, label: { uz: "O‘rnatilgan Osstem va Straumann implantlari", ru: "Установленных имплантов Osstem и Straumann" } },
    { value: { uz: "99.4%", ru: "99,4%" }, label: { uz: "Rasmiy tasdiqlangan osteointegratsiya ko‘rsatkichi", ru: "Подтверждённый показатель остеоинтеграции" } },
  ],
  idCard: {
    licenseId: "UZ-SSV-0412-2014",
    lines: [
      { uz: "ESCD a’zosi (European Society of Cosmetic Dentistry)", ru: "Член ESCD (European Society of Cosmetic Dentistry)" },
      { uz: "Carl Zeiss 25x optik kattalashtirish amaliyotchisi", ru: "Практик оптического увеличения Carl Zeiss 25x" },
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
      title: { uz: "Navigatsion 3D Implantatsiya", ru: "Навигационная 3D-имплантация" },
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
      title: { uz: "Total Reabilitatsiya (All-on-4 / All-on-6)", ru: "Тотальная реабилитация (All-on-4 / All-on-6)" },
      lead: {
        uz: "Butun jag‘ni 3–5 kun ichida tiklash. Doimiy protez bilan uyga qaytasiz.",
        ru: "Восстановление всей челюсти за 3–5 дней. Уходите домой с постоянным протезом.",
      },
      specs: [{ uz: "4 yoki 6 implant", ru: "4 или 6 имплантов" }],
      calcProblem: "fullArch",
      priceFrom: 62_000_000,
    },
    {
      id: "micro-veneers",
      title: { uz: "Mualliflik Mikro-Vinirlari (E-max & Sirkoniy)", ru: "Авторские микро-виниры (E-max и цирконий)" },
      lead: {
        uz: "Tabiiy shaffoflik, tishni agressiv charxlamasdan.",
        ru: "Естественная прозрачность без агрессивной обточки зубов.",
      },
      specs: [{ uz: "Qalinligi 0.3 mm dan", ru: "Толщина от 0.3 мм" }],
      image: "/images/smile-design.jpg",
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
        uz: "Endodontiya va gnatologiya: boshqalar “olib tashlash kerak” degan tishlarni saqlaymiz.",
        ru: "Эндодонтия и гнатология: сохраняем зубы, которые другие советуют удалить.",
      },
      specs: [{ uz: "Carl Zeiss 25x", ru: "Carl Zeiss 25x" }],
      image: "/images/microscope.jpg",
      priceFrom: 1_400_000,
    },
  ],
  pricing: sharedPricing,
  ctScanPrice: 450_000,
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
      country: { uz: "Yevropa", ru: "Европа" },
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
  presetLabel: { uz: "Estetik Stomatolog · Mikro-Vinirlar", ru: "Эстетический стоматолог · Микро-виниры" },
  name: { uz: "Dr. Sardor Rahimov", ru: "Д-р Сардор Рахимов" },
  signature: "Sardor Rahimov",
  firstName: { uz: "Sardor", ru: "Сардор" },
  monogram: "SR",
  title: {
    uz: "Estetik Stomatolog · Mikro-Vinirlar va Gnatologiya mutaxassisi",
    ru: "Эстетический стоматолог · специалист по микро-винирам и гнатологии",
  },
  practice: {
    uz: "Shaxsiy Estetik Stomatologiya Studiyasi · Toshkent",
    ru: "Частная студия эстетической стоматологии · Ташкент",
  },
  heroLead: { uz: "Tabassum shablon emas.", ru: "Улыбка не по шаблону." },
  heroSub: {
    uz: "Har bir vinir yuzingiz, ovozingiz va tishlash tizimingiz asosida loyihalanadi. Dizayndan fiksatsiyagacha Dr. Sardor Rahimov o‘zi ishlaydi.",
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
    alt: {
      uz: "Dr. Sardor Rahimov oq ko‘ylakda, stetoskop bilan",
      ru: "Д-р Сардор Рахимов в белой рубашке со стетоскопом",
    },
    position: "50% 18%",
  },
  stats: [
    { value: { uz: "9+ YIL", ru: "9+ ЛЕТ" }, label: { uz: "Estetik restavratsiya tajribasi", ru: "Опыта в эстетической реставрации" } },
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
      title: { uz: "Mualliflik Mikro-Vinirlari (E-max & Sirkoniy)", ru: "Авторские микро-виниры (E-max и цирконий)" },
      lead: {
        uz: "0.3 mm qalinlikdagi vinirlar: tabiiy shaffoflik, tishni agressiv charxlamasdan.",
        ru: "Виниры толщиной от 0.3 мм: естественная прозрачность без агрессивной обточки.",
      },
      specs: [
        { uz: "Raqamli dizayn + mock-up", ru: "Цифровой дизайн + mock-up" },
        { uz: "2 tashrif, 9 kun", ru: "2 визита, 9 дней" },
        { uz: "Kafolat: 10 yil yozma", ru: "Гарантия: 10 лет письменно" },
      ],
      image: "/images/smile-design.jpg",
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
      title: { uz: "Navigatsion 3D Implantatsiya", ru: "Навигационная 3D-имплантация" },
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
        uz: "Endodontiya: boshqalar “olib tashlash kerak” degan tishlarni saqlaymiz.",
        ru: "Эндодонтия: сохраняем зубы, которые другие советуют удалить.",
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
      country: { uz: "Yevropa", ru: "Европа" },
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

export const doctorPresets = { jamshid, sardor } satisfies Record<string, DoctorProfile>;
export type PresetId = keyof typeof doctorPresets;

/* ───────────────────────────── Site settings ───────────────────────────── */

export const site = {
  activePresetId: "jamshid" as PresetId,
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
