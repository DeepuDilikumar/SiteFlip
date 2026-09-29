import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Business, Lead, Site, User } from "./types";

/**
 * A tiny JSON-file store so the app runs end to end with zero setup.
 * Every read/write goes through this module, so swapping in Postgres or
 * SQLite later means reimplementing these functions — nothing else changes.
 */
interface Schema {
  users: User[];
  businesses: Business[];
  sites: Site[];
  leads: Lead[];
}

const DATA_DIR = process.env.SITEFLIP_DATA_DIR ?? path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

const EMPTY: Schema = { users: [], businesses: [], sites: [], leads: [] };

// Serialise writes so concurrent requests can't clobber each other.
let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<Schema> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Schema>) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return structuredClone(EMPTY);
    throw error;
  }
}

async function save(data: Schema): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2));
  await fs.rename(tmp, DB_FILE);
}

function read<T>(fn: (data: Schema) => T): Promise<T> {
  return queue.then(async () => fn(await load()));
}

function write<T>(fn: (data: Schema) => T): Promise<T> {
  const next = queue.then(async () => {
    const data = await load();
    const result = fn(data);
    await save(data);
    return result;
  });
  queue = next.catch(() => undefined);
  return next;
}

// ─── Users ──────────────────────────────────────────────────────────────────

export const users = {
  findById: (id: string) => read((d) => d.users.find((u) => u.id === id) ?? null),
  findByEmail: (email: string) =>
    read((d) => d.users.find((u) => u.email === email.toLowerCase()) ?? null),
  create: (user: User) =>
    write((d) => {
      d.users.push(user);
      return user;
    }),
  update: (id: string, patch: Partial<Omit<User, "id">>) =>
    write((d) => {
      const user = d.users.find((u) => u.id === id);
      if (!user) return null;
      Object.assign(user, patch);
      return user;
    }),
  /**
   * Atomically read-modify-write one user. Used for usage accounting so two
   * simultaneous generations can't both slip under the free limit.
   */
  mutate: <T>(id: string, fn: (user: User) => T) =>
    write((d) => {
      const user = d.users.find((u) => u.id === id);
      return user ? fn(user) : null;
    }),
};

// ─── Businesses (cached search results) ─────────────────────────────────────

export const businesses = {
  findById: (id: string) => read((d) => d.businesses.find((b) => b.id === id) ?? null),
  findMany: (ids: string[]) => read((d) => d.businesses.filter((b) => ids.includes(b.id))),
  upsertMany: (items: Business[]) =>
    write((d) => {
      for (const item of items) {
        const index = d.businesses.findIndex((b) => b.id === item.id);
        if (index === -1) d.businesses.push(item);
        else d.businesses[index] = item;
      }
      return items;
    }),
};

// ─── Sites ──────────────────────────────────────────────────────────────────

export const sites = {
  findById: (id: string) => read((d) => d.sites.find((s) => s.id === id) ?? null),
  findMany: (ids: string[]) => read((d) => d.sites.filter((s) => ids.includes(s.id))),
  create: (site: Site) =>
    write((d) => {
      d.sites.push(site);
      return site;
    }),
};

// ─── Leads (the operator's pipeline) ────────────────────────────────────────

export const leads = {
  listForUser: (userId: string) =>
    read((d) =>
      d.leads
        .filter((l) => l.userId === userId)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    ),
  findForBusiness: (userId: string, businessId: string) =>
    read((d) => d.leads.find((l) => l.userId === userId && l.businessId === businessId) ?? null),
  /** Creates the lead, or points an existing one at the newest site. */
  upsert: (lead: Lead) =>
    write((d) => {
      const existing = d.leads.find(
        (l) => l.userId === lead.userId && l.businessId === lead.businessId,
      );
      if (!existing) {
        d.leads.push(lead);
        return lead;
      }
      existing.siteId = lead.siteId;
      existing.updatedAt = lead.updatedAt;
      return existing;
    }),
  update: (id: string, userId: string, patch: Partial<Pick<Lead, "status">>) =>
    write((d) => {
      const lead = d.leads.find((l) => l.id === id && l.userId === userId);
      if (!lead) return null;
      Object.assign(lead, patch, { updatedAt: new Date().toISOString() });
      return lead;
    }),
};
