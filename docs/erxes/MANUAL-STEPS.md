# Намуун Baby Shop: erxes manual steps

Owner of every step below: **Terbish**, with Намуун for credentials and decisions.

These steps happen in the erxes 3.0 admin (and at QPay / ebarimt.mn), not in code. The website reads the results
through the environment variables in `.env.example`. Never commit their values; set them in
**Vercel → namuun-web → Settings → Environment Variables** and redeploy.

There is no erxes instance for Намуун yet ("erxes 3.0: NOT SET"). Create the workspace first.

> **Source.** namuun.mn is the shop's own Next.js store (not Zochil). Everything below was read on 2026-11-20 from its
> public storefront API (`/api/products`, `/api/categories/tree`, `/api/branches`, `/api/delivery-configs`,
> `/api/faq`, `/api/checkout/item-balances`), its banners and the Facebook page. No login, admin page or private
> endpoint was used, and no credential was found or copied.

| Task | Website | erxes / external (manual) |
| --- | --- | --- |
| [1.1] Products, categories, prices | done: 977 products, 8 shelves + sizes / sub-shelves, 50 brands, MNT prices, online stock, 947 photos self-hosted | import the CSVs (1.1) |
| [1.2] QPay | done: QPay invoice + status check through the erxes payment plugin | **blocked**: QPay merchant credentials, erxes payment method (1.2) |
| [1.3] eBarimt (НӨАТ-ын баримт) | done: person / company choice, registry number validated | **blocked**: PosAPI registration, TIN; receipts are issued by erxes (1.3) |
| [1.4] Delivery, fees, statuses | done: Улаанбаатар 3,000₮, 24–48 h, online minimum 30,000₮, countryside by phone, status list | delivery products, pipeline stages (1.4) |
| [1.5] Full journey test | validation verified (`npm run test:order`, 29 checks) | **blocked**: a real order needs the env vars and 1.2 / 1.3 (1.5) |

---

## 1.1 Products, categories, prices

Source: namuun.mn public API, 2026-11-20: **978 products** (one test item «test бараа» left out → **977**), item groups,
brands, MNT prices (100₮–273,600₮), up to 6 photos each, online stock per branch, the 9 «featured» items.

- **Shelves** (from the shop's item groups): Живх, өмсдөг (182; sizes JB, NB, S, M, L, XL, XXL, XXXL), Нярайн
  хэрэглэл (347), Хүүхдийн хоол (253: хуурай сүү 1–4, нухаш / каш, зууш, шүүс), Арьс арчилгаа (77), Ахуйн бараа (90),
  Ээжүүдэд (10), Тоглоом (9), Намуун брэнд (9). Sub-shelves inside a group (угж, соосог, тос, салфетка, …) are
  picked from words in the product name; everything else stays in «Бусад».
- **Diapers**: weight (kg), «наадаг / өмсдөг» and pack size are read from the product name when written there (74 /
  130 / 109 of 182). `/diapers` shows each size with the median kg of the packs that print it. Nothing is guessed when
  the name has no kg.
- **Stock**: the public `item-balances` endpoint gives the available balance per branch; the site shows the sum of
  positive balances: 724 in stock, 236 at 0 (shown «Дууссан», not orderable), 17 without a record (orderable, not
  capped). It is a snapshot (open question 3).
- **Photos ("some images do not show" on namuun.mn)**: 31 products point at **expired S3 presigned links** (403); the
  same file is served by the shop's CloudFront (`ds4f7nxi9tv17.cloudfront.net`), so the site uses that. About 280
  photos were **hot-linked from other websites** (pigeon.co.jp, Google image thumbnails, cdn.zochil.shop, greensoft,
  amazon, …), which break whenever those sites change. All 957 photo links were downloaded once, trimmed, put on
  white and saved as WebP in `public/img` (948 downloaded). 9 links are dead at the source (4 CloudFront 403, 3 tops.co.th,
  1 Google Drive, 1 norbelbaby.com.tw). **32 products have no usable photo**; they show a navy moon-and-star card
  with the brand name. Ask Намуун for those photos (list: `npm run export:erxes`, rows with an empty image column).
- Old namuun.mn URLs (`/products/<id>`, `/faq`, `/branches`, `/delivery-terms`, `/checkout`, …) redirect.

Steps:

1. Run `npm run export:erxes` (already run; files in `docs/erxes/`).
2. **Products & Services → Categories → Import**: `namuun-categories.csv` (NM → shelves → sizes / sub-shelves →
   NM-DELIVERY).
3. **Products & Services → Import**: `namuun-products.csv`. Code `NM-<productId>` (the same id the website sends with
   every order line), the shop's own item code in its own column (for the POS), unit price in MNT, brand, stock.
4. Spot-check 10 products (price, photo) against namuun.mn.

## 1.2 Payment (QPay)

namuun.mn FAQ, word for word: «QPay ашиглан төлбөр төлөх боломжтой». The website:

- records the order in erxes first, then creates a QPay invoice with the erxes payment plugin (`generateInvoiceUrl`,
  public). The customer pays on the erxes payment page and returns to `/order/<reference>`, which asks `invoicesCheck`
  every 5 s.
- never asks for money for an order staff cannot see. Bank transfer and cash are not offered (not on namuun.mn).

Steps:

1. Get Намуун's QPay merchant credentials (`client_id`, `client_secret`, `invoice_code`): the ones namuun.mn uses today
   or a new merchant.
2. **Settings → Payments → Add → QPay (v2)**: enter them. Make a 100₮ test invoice in erxes.
3. Copy the payment method's `_id` into Vercel as `ERXES_PAYMENT_IDS`.
4. Invoice lifetime: namuun.mn publishes no payment deadline (open question 4). Set one in QPay if the shop wants it.
5. **Not yet tested** against a real QPay merchant. Do not call payments working until step 2 and 1.5 pass.
