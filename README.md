# Намуун Baby Shop web store

Next.js 16 storefront for Намуун Baby Shop (namuun.mn): diapers, bottles and feeding, formula and baby food, skin care,
household goods, 50 brands, 7 branches. «Бүгдийг нэг дороос.»

```bash
npm install
npm run dev            # http://localhost:3000
npm run lint && npm run typecheck && npm run build
npm run test:order -- http://localhost:3000   # order API checks (no erxes needed)
npm run export:erxes   # docs/erxes/namuun-*.csv for the erxes product import
```

- Catalog: `src/data/catalog.json` (+ `lite.json` for cart and search), built from the namuun.mn public storefront API
  on 2026-11-20. Photos self-hosted in `public/img/<hash>.webp` (expired S3 links and hot-linked images fixed).
- Business rules (Улаанбаатар 3,000₮, 24–48 h, online minimum 30,000₮, QPay, НӨАТ receipt): `src/content/business.ts`.
- Orders go to erxes (form submission → Sales card), QPay through the erxes payment plugin. Until the `ERXES_*`
  variables (`.env.example`) are set, `/api/orders` answers `503 not_configured` and the checkout shows the phone.
- Manual erxes steps and open questions: `docs/erxes/MANUAL-STEPS.md`.

Look «Бүүвэйн тэнгэр» (lullaby sky), from the logo: a navy night with the crib mobile and stars, a pale morning-sky
page, sky blue and baby pink, yellow stars for the buy button, bubbly Nunito (Mongolian Ө/Ү checked). Pages: home,
shop (shelf, size, brand, наадаг / өмсдөг, in stock, sort, search), product, diaper sizes `/diapers`, cart /
checkout, order status, saved items, info (delivery, payment, branches, FAQ).
