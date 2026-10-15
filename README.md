# Private Practice Site · Solo Dental Specialist (Tashkent)

A bilingual (O‘zbek / Русский) personal-brand site for a solo dental specialist, built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and Lucide icons.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Re-brand for a new doctor in about a minute

Everything doctor-specific lives in **`src/config/doctorConfig.ts`**:

| What | Where |
| --- | --- |
| Name, title, monogram, signature, hero copy, manifesto | the preset object (`jamshid`, `sardor`) |
| Phone, Telegram, Instagram, email | `contact` |
| Address, landmark, map coordinates | `address` |
| Working days and hours (drives the live "open now" dot) | `hours` |
| Calculator prices, visits, surgery time, bonuses | `pricing` (`sharedPricing`) |
| Services bento (first item is the featured tile) | `services` |
| Certificates, clinical cases | `credentials`, `cases` |
| Default persona, default language, demo pill, USD rate | `site` |

Photos go in `public/images/`. Reviews are in `src/config/reviews.ts`, and the UI copy for both languages is in `src/i18n/dictionary.ts`. The Russian dictionary is type-checked against the Uzbek one, so a missing key fails the build.

**Before a real client launch:** set `site.showDemoSwitcher = false` and `site.isDemo = false`, then replace the demo photos, cases and reviews with the doctor's own.

## Pitch mode

- The floating ⚙ pill (bottom-left) swaps the persona and language live.
- Share a direct link to a persona: `/?demo=sardor&lang=ru`.

## Booking delivery

`POST /api/booking` validates the request. To send each booking to the doctor's Telegram, copy `.env.example` to `.env.local` and fill in `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. Without them, requests are logged on the server and the visitor still sees the confirmation.

## Notes

- Before/after slider: the demo uses one photo per case and applies an "unrestored" colour grade to the *OLDIN* side. Replace these with real paired photos for a client.
- Images are stored locally (originally from Unsplash). If one fails to load, a designed fallback surface is shown instead of a broken image.
