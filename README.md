# Pakhuis Tiles

Full e-commerce & stock management platform for **Pakhuis Tiles** (Pretoria East), based on the Website Scope of Work.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Prisma 5 + SQLite (swap `DATABASE_URL` to PostgreSQL for production)
- NextAuth credentials (customers + staff roles)

## Quick start

```bash
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Demo logins

| Role     | Email                         | Password    |
| -------- | ----------------------------- | ----------- |
| Admin    | `admin@pakhuistiles.co.za`    | `password123` |
| Customer | `customer@example.com`        | `password123` |

Also seeded: store manager, sales, warehouse, finance (same password).

## What’s included (SOW)

### Customer-facing
- Home, catalogue, product pages, specials
- Tile calculator, quote requests (incl. installation)
- Gallery, blog, about, contact
- Cart, checkout (delivery/collection), order confirmation
- Customer accounts: register/login, profile, order history, invoice download

### Admin portal (`/admin`)
- Dashboard (sales, orders, customers, stock value, low stock, promos, damage)
- Products & pricing (retail / contractor / wholesale / promo)
- Stock receiving & movements
- Orders & status workflow
- Customers & suppliers
- Promotions
- Damage / waste tracking
- Staff users & roles
- Quotes inbox & notifications
- CSV reports (sales, inventory, damage, suppliers, customers)

### Security
- Password hashing (bcrypt)
- Role-gated admin routes
- Session auth via NextAuth

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run db:setup` | Push schema + seed |
| `npm run db:seed` | Re-seed demo data |

## Production notes

- Set strong `NEXTAUTH_SECRET` and real `NEXTAUTH_URL`
- Use PostgreSQL in production (`DATABASE_URL`)
- Wire PayFast credentials for live card payments (demo checkout records orders + invoices today)
- Optional: email/SMS notifications via Resend / Twilio
