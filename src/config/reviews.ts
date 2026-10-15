import type { Localized } from "@/config/doctorConfig";

export type ReviewSource = "google" | "yandex" | "telegram";

export interface Review {
  id: string;
  source: ReviewSource;
  author: string;
  /** Index into dictionary `reviews.ago`. */
  ago: 0 | 1 | 2;
  /** Telegram reviews show the time stamp of the message. */
  time?: string;
  text: Localized;
  /** Optional reply bubble from the doctor (Telegram style). */
  reply?: Localized;
}

/** `{doctor}` is replaced with the active doctor's first name. */
export const reviews: Review[] = [
  {
    id: "r1",
    source: "google",
    author: "Dilnoza Karimova",
    ago: 1,
    text: {
      uz: "Implant qo‘yishdan juda qo‘rqardim. {doctor} hamma narsani ekranda ko‘rsatib tushuntirdi, operatsiya 25 daqiqa davom etdi va umuman og‘rimadi.",
      ru: "Очень боялась ставить имплант. {doctor} всё показал и объяснил на экране, операция длилась 25 минут и совсем не болела.",
    },
  },
  {
    id: "r2",
    source: "telegram",
    author: "Bekzod T.",
    ago: 0,
    time: "21:47",
    text: {
      uz: "Doktor, kechirasiz kech yozganim uchun. Bugun birinchi marta yangi tishlarim bilan bemalol ovqatlandim. Katta rahmat!",
      ru: "Доктор, извините, что поздно пишу. Сегодня впервые спокойно поел с новыми зубами. Огромное спасибо!",
    },
    reply: {
      uz: "Juda xursandman! Ertaga ertalab shishni bir ko‘rib qo‘yamiz.",
      ru: "Очень рад! Завтра утром посмотрим, как отёк.",
    },
  },
  {
    id: "r3",
    source: "yandex",
    author: "Малика Юсупова",
    ago: 2,
    text: {
      uz: "Boshqa klinikada 6 ta tishni charxlash kerak deyishdi. Bu yerda vinirlarni deyarli charxlamasdan qo‘yishdi. Narx birinchi kunda qanday aytilgan bo‘lsa, shunday qoldi.",
      ru: "В другой клинике сказали обточить 6 зубов. Здесь виниры поставили почти без обточки. Цена осталась ровно такой, как назвали в первый день.",
    },
  },
  {
    id: "r4",
    source: "google",
    author: "Rustam Nazarov",
    ago: 2,
    text: {
      uz: "Har safar faqat bitta shifokor bilan ishladim, assistentga topshirib yuborishmadi. Kafolat pasporti muhr bilan berildi.",
      ru: "Каждый раз работал только с одним врачом, меня не передавали ассистентам. Паспорт гарантии выдали с печатью.",
    },
  },
  {
    id: "r5",
    source: "telegram",
    author: "Aziza R.",
    ago: 1,
    time: "10:12",
    text: {
      uz: "Onam Samarqanddan keldi, All-on-6 ni 4 kunda tugatdingiz. Mehmonxonani ham topib berganingiz uchun alohida rahmat.",
      ru: "Мама приехала из Самарканда, All-on-6 сделали за 4 дня. Отдельное спасибо, что помогли с отелем.",
    },
  },
  {
    id: "r6",
    source: "yandex",
    author: "Тимур Ахмедов",
    ago: 0,
    text: {
      uz: "Mikroskop ostida kanal davolashdi, boshqa joyda “olib tashlaymiz” deyishgan tish saqlanib qoldi. Halol va xotirjam muloqot.",
      ru: "Лечили каналы под микроскопом, зуб, который в другом месте предлагали удалить, сохранили. Честное и спокойное общение.",
    },
  },
];
