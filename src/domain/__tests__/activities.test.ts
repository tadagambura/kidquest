import raw from '../../content/activities.json';
import { ageError, DEFAULT_FILTERS, matches, roll, search, suitsAges, weekDays, type Activity } from '../activities';

const all = (raw as { activities: Activity[] }).activities;

test('library shape: 80 activities, 40 free, every one with steps and a sane age range', () => {
  expect(all).toHaveLength(80);
  expect(all.filter((a) => a.free)).toHaveLength(40);
  for (const a of all) {
    expect(a.steps.length).toBeGreaterThanOrEqual(3);
    expect(a.ageMin).toBeLessThanOrEqual(a.ageMax);
    expect(['indoor', 'outdoor', 'either']).toContain(a.place);
  }
  expect(new Set(all.map((a) => a.id)).size).toBe(80);
});

test('ages: every child must fit the range', () => {
  const a = { ageMin: 4, ageMax: 7 } as Activity;
  expect(suitsAges(a, [4, 7])).toBe(true);
  expect(suitsAges(a, [3, 6])).toBe(false);
  expect(suitsAges(a, [])).toBe(true);
});

test('filters combine; "either" activities count for indoor and outdoor', () => {
  const indoor = search(all, { ...DEFAULT_FILTERS, place: 'indoor' }, true);
  expect(indoor.every((a) => a.place !== 'outdoor')).toBe(true);
  expect(indoor.some((a) => a.place === 'either')).toBe(true);
  const quick = search(all, { ...DEFAULT_FILTERS, maxMinutes: 15, freeOnly: true, ages: [3] }, true);
  expect(quick.every((a) => a.minutes <= 15 && a.cost === 'free' && a.ageMin <= 3 && a.ageMax >= 3)).toBe(true);
  expect(matches(all[0], { ...DEFAULT_FILTERS, tag: 'no-such-tag' })).toBe(false);
});

test('rolling the dice only picks unlocked matches and avoids repeats', () => {
  for (let i = 0; i < 50; i++) {
    const a = roll(all, DEFAULT_FILTERS, false, Math.random)!;
    expect(a.free).toBe(true);
  }
  const f = { ...DEFAULT_FILTERS, ages: [2], place: 'outdoor' as const, energy: 'high' as const };
  const pool = search(all, f, false, true);
  if (pool.length > 1) expect(roll(all, f, false, () => 0, pool[0].id)!.id).not.toBe(pool[0].id);
  expect(roll(all, { ...DEFAULT_FILTERS, tag: 'nope' }, true)).toBeNull();
});

test('week and age helpers', () => {
  expect(weekDays('2026-11-25')[0]).toBe('2026-11-23');
  expect(weekDays('2026-11-25')).toHaveLength(7);
  expect(ageError('0')).not.toBeNull();
  expect(ageError('6')).toBeNull();
});
