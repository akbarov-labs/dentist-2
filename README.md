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

Photos go in `public/images/`. The layered hero and the closing section use a transparent cut-out of the doctor (`portrait.cutout`, WebP with alpha). Make one from any portrait with a background-removal tool and keep the subject's bottom edge cropped (a soft mist hides it). Reviews are in `src/config/reviews.ts`, and the UI copy for both languages is in `src/i18n/dictionary.ts`. The Russian dictionary is type-checked against the Uzbek one, so a missing key fails the build.

**Before a real client launch:** set `site.showDemoSwitcher = false` and `site.isDemo = false`, then replace the demo photos, cases and reviews with the doctor's own.

## Pitch mode

- The ⚙ pill (bottom-left) swaps the persona and language live. Ordinary visitors never see it. It appears when the URL carries `?demo=…`, and **Shift + D** shows or hides it (remembered on that device).
- Share a direct link to a persona: `/?demo=sardor&lang=ru`.

## Booking delivery

`POST /api/booking` validates the request. To send each booking to the doctor's Telegram, copy `.env.example` to `.env.local` and fill in `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. Without them, requests are logged on the server and the visitor still sees the confirmation.

## Clinical cases and the before/after slider

The drag slider only renders when a case has **real, consented** photos of the same patient:

```ts
photos: { before: "/images/case-01-before.jpg", after: "/images/case-01-after.jpg" },
```

Without them, the case shows its illustrative image, captioned as such, and a consent-first note ("before/after photos are shown in person, with the patient's written consent"). Never fake a "before" from the "after" image.

## Scroll moments

- **Layered hero:** room, monogram, doctor and ID card move at different rates (`--hp`, set by `useScrollVar`).
- **Implant drawing (Protocol):** a technical drawing builds itself as you scroll through the five steps (`src/components/ui/ImplantDrawing.tsx`). Each element has a window in step units (`data-a`/`data-b`).
- Both respect `prefers-reduced-motion`: the hero is static, and the drawing jumps step by step.

## Notes

- After editing `src/app/globals.css`, run a clean build (`rm -rf .next && npm run build`). Turbopack's Tailwind loader can otherwise keep serving the previous global CSS.
- Images are stored locally (originally from Unsplash). If one fails to load, a designed fallback surface is shown instead of a broken image.
