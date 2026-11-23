// KidQuest: find a screen-free activity that fits right now. Parent-facing; no child data beyond ages.
import { addDays, startOfWeek, type DayKey } from '@/kit/dates';

export type Activity = {
  id: string;
  title: string;
  summary: string;
  ageMin: number;
  ageMax: number;
  place: 'indoor' | 'outdoor' | 'either';
  minutes: number;
  energy: 'calm' | 'medium' | 'high';
  cost: 'free' | 'low';
  materials: string[];
  steps: string[];
  safety: string | null;
  tags: string[];
  free: boolean;
};

export type Filters = {
  ages: number[]; // children's ages (empty = any)
  place: 'any' | 'indoor' | 'outdoor';
  maxMinutes: number | null;
  energy: 'any' | Activity['energy'];
  freeOnly: boolean; // no-cost activities only
  tag: string | null;
};

export const DEFAULT_FILTERS: Filters = { ages: [], place: 'any', maxMinutes: null, energy: 'any', freeOnly: false, tag: null };

/** An activity suits the group if every child's age is in its range. */
export function suitsAges(a: Activity, ages: number[]) {
  return ages.every((x) => x >= a.ageMin && x <= a.ageMax);
}

export function matches(a: Activity, f: Filters): boolean {
  if (f.ages.length && !suitsAges(a, f.ages)) return false;
  if (f.place !== 'any' && a.place !== f.place && a.place !== 'either') return false;
  if (f.maxMinutes != null && a.minutes > f.maxMinutes) return false;
  if (f.energy !== 'any' && a.energy !== f.energy) return false;
  if (f.freeOnly && a.cost !== 'free') return false;
  if (f.tag && !a.tags.includes(f.tag)) return false;
  return true;
}

/** Filter the library; locked activities are kept (shown as Premium) unless `unlockedOnly`. */
export function search(all: Activity[], f: Filters, premium: boolean, unlockedOnly = false): Activity[] {
  return all.filter((a) => matches(a, f) && (!unlockedOnly || premium || a.free));
}

/** Roll the dice: a random unlocked match, avoiding the one you just saw if possible. */
export function roll(all: Activity[], f: Filters, premium: boolean, rand: () => number = Math.random, avoid?: string): Activity | null {
  let pool = search(all, f, premium, true);
  if (pool.length > 1 && avoid) pool = pool.filter((a) => a.id !== avoid);
  if (!pool.length) return null;
  return pool[Math.floor(rand() * pool.length) % pool.length];
}

export type Plan = Record<DayKey, string[]>; // day → activity ids

export function weekDays(today: DayKey): DayKey[] {
  const mon = startOfWeek(today);
  return Array.from({ length: 7 }, (_, i) => addDays(mon, i));
}

export function ageError(text: string): string | null {
  const n = Number(text);
  if (!text.trim() || !Number.isInteger(n) || n < 1 || n > 16) return 'Ages from 1 to 16.';
  return null;
}

export const TAG_LABELS: Record<string, string> = {
  'rainy-day': '🌧️ Rainy day',
  creative: '🎨 Creative',
  science: '🔬 Science',
  active: '🏃 Active',
  nature: '🌳 Nature',
  'quiet-time': '🤫 Quiet time',
  messy: '🫧 Messy',
  cooking: '🍪 Cooking',
  christmas: '🎄 Christmas',
  winter: '❄️ Winter',
};
