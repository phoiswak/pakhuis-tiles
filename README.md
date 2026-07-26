# Pakhuis Tiles

Phase 1 storefront for **Pakhuis Tiles** (Pretoria East) — product catalogue, tile calculator, quote requests, gallery, blog and contact.

Built to match the [Lovable prototype](https://tilecraft-connect.lovable.app) and the Website Scope of Work (customer-facing MVP). Admin portal, cart/checkout and inventory land in later phases.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Typed product catalogue (`src/data/catalog.ts`)
- Quote & contact submissions saved to `data/` as JSON (swap for Postgres later)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command       | Description        |
| ------------- | ------------------ |
| `npm run dev` | Local development  |
| `npm run build` | Production build |
| `npm start`   | Run production     |

## What's included

- Home, shop catalogue, category & product pages
- Specials, tile calculator, quote form
- Gallery, blog, about, contact
- API routes: `POST /api/quotes`, `POST /api/contact`

## Next phases (from SOW)

1. Customer accounts, cart, PayFast checkout  
2. Admin portal — stock, suppliers, promotions, reports  
3. Role permissions, notifications, Sage/Pastel integration  

## Business details (placeholders)

Update phone/email in `src/data/catalog.ts` (`SITE`) when real credentials are ready.
