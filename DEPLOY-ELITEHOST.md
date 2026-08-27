# Deploy Pakhuis Tiles on EliteHost (cPanel Node.js)

## What the app does now
- Browse tiles / calculator / gallery / blog
- **Request Quote** only (no cart / payments)
- Quotes & contact emails go to **sales@pakhuis.co.za**

## 1. Create Node.js app in cPanel
1. Log in to EliteHost → **pakhuis.co.za** → **cPanel**
2. Open **Setup Node.js App**
3. **CREATE APPLICATION** with:
   - **Node.js version:** 20.x (or newest available — not 10.x)
   - **Application mode:** Production
   - **Application root:** `pakhuis-app`
   - **Application URL:** `pakhuis.co.za` (path empty)
   - **Application startup file:** `server.js`
4. Click **CREATE**

## 2. Upload the project
Preferred: **Git Version Control** in cPanel pointing at  
`https://github.com/phoiswak/pakhuis-tiles.git`  
into the `pakhuis-app` folder.

Or ZIP the project (without `node_modules` / `.next`) and upload via File Manager into `~/pakhuis-app`.

## 3. Environment variables (in Node.js App → Environment)
```
NODE_ENV=production
DATABASE_URL=file:./dev.db
NEXTAUTH_URL=https://pakhuis.co.za
NEXTAUTH_SECRET=<long-random-string>
QUOTE_TO_EMAIL=sales@pakhuis.co.za
SMTP_HOST=mail.pakhuis.co.za
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=sales@pakhuis.co.za
SMTP_PASS=<sales-mailbox-password>
```

## 4. Build on the server (Terminal / SSH or Node app “Run NPM Install”)
```bash
cd ~/pakhuis-app
npm install --legacy-peer-deps
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
npm run build
```

Then in Node.js Selector → **RESTART** the app.

## 5. Test
- Open https://pakhuis.co.za
- Submit a quote → email should arrive at sales@pakhuis.co.za
