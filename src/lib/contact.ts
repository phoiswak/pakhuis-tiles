import { promises as fs } from "fs";
import path from "path";

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

const dataDir = path.join(process.cwd(), "data");
const contactFile = path.join(dataDir, "contact-messages.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(contactFile);
  } catch {
    await fs.writeFile(contactFile, "[]", "utf8");
  }
}

export async function saveContactMessage(payload: ContactPayload) {
  await ensureStore();
  const raw = await fs.readFile(contactFile, "utf8");
  const list = JSON.parse(raw || "[]") as Array<ContactPayload & { id: string; createdAt: string }>;
  const entry = {
    ...payload,
    id: `C-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  list.unshift(entry);
  await fs.writeFile(contactFile, JSON.stringify(list, null, 2), "utf8");
  return entry;
}
