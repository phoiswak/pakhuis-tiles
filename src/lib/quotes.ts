import { promises as fs } from "fs";
import path from "path";

export type QuotePayload = {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  physicalAddress?: string;
  projectType: string;
  tileCategory?: string;
  tileSize?: string;
  colourPreference?: string;
  quantityM2?: string;
  budgetRange?: string;
  deliveryOption?: string;
  deliveryArea?: string;
  notes?: string;
  productSlug?: string;
  calculatorM2?: string;
};

export type StoredQuote = QuotePayload & {
  id: string;
  status: string;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const quotesFile = path.join(dataDir, "quotes.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(quotesFile);
  } catch {
    await fs.writeFile(quotesFile, "[]", "utf8");
  }
}

export async function saveQuote(payload: QuotePayload): Promise<StoredQuote> {
  await ensureStore();
  const raw = await fs.readFile(quotesFile, "utf8");
  const list = JSON.parse(raw || "[]") as StoredQuote[];
  const quote: StoredQuote = {
    ...payload,
    id: `Q-${Date.now()}`,
    status: "NEW",
    createdAt: new Date().toISOString(),
  };
  list.unshift(quote);
  await fs.writeFile(quotesFile, JSON.stringify(list, null, 2), "utf8");
  return quote;
}

export async function listQuotes(): Promise<StoredQuote[]> {
  await ensureStore();
  const raw = await fs.readFile(quotesFile, "utf8");
  return JSON.parse(raw || "[]") as StoredQuote[];
}
