import { todayKey, type DayKey } from '@/kit/dates';
import { persisted } from '@/kit/store';
import { DEFAULT_FILTERS, type Activity, type Filters, type Plan } from '@/domain/activities';
import raw from '@/content/activities.json';

export const library = (raw as { activities: Activity[] }).activities;

type QuestState = {
  ages: number[];
  filters: Filters;
  saved: string[];
  done: Record<DayKey, string[]>;
  plan: Plan;
  setAges: (ages: number[]) => void;
  setFilters: (patch: Partial<Filters>) => void;
  toggleSaved: (id: string) => void;
  markDone: (id: string) => void;
  undoDone: (id: string) => void;
  planFor: (day: DayKey, id: string) => void;
  unplan: (day: DayKey, id: string) => void;
};

export const useQuest = persisted<QuestState>('kidquest.quest', 1, (set) => ({
  ages: [],
  filters: DEFAULT_FILTERS,
  saved: [],
  done: {},
  plan: {},
  setAges: (ages) => set((s) => ({ ages, filters: { ...s.filters, ages } })),
  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  toggleSaved: (id) => set((s) => ({ saved: s.saved.includes(id) ? s.saved.filter((x) => x !== id) : [...s.saved, id] })),
  markDone: (id) => set((s) => ({ done: { ...s.done, [todayKey()]: [...new Set([...(s.done[todayKey()] ?? []), id])] } })),
  undoDone: (id) => set((s) => ({ done: { ...s.done, [todayKey()]: (s.done[todayKey()] ?? []).filter((x) => x !== id) } })),
  planFor: (day, id) => set((s) => ({ plan: { ...s.plan, [day]: [...new Set([...(s.plan[day] ?? []), id])] } })),
  unplan: (day, id) => set((s) => ({ plan: { ...s.plan, [day]: (s.plan[day] ?? []).filter((x) => x !== id) } })),
}));

export const doneCount = (done: Record<DayKey, string[]>) => Object.values(done).reduce((n, l) => n + l.length, 0);
