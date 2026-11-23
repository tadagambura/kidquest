import { router } from 'expo-router';
import { useState } from 'react';
import { track } from '@/kit/analytics';
import { PaywallSheet } from '@/kit/Paywall';
import { usePremium } from '@/kit/premium';
import { Button, Chip, EmptyState, Field, H1, IconButton, Muted, Row, Screen, Section, Segmented, Stack } from '@/kit/ui';
import { ageError, roll, search, TAG_LABELS } from '@/domain/activities';
import { ActivityCard } from '@/components/ActivityCard';
import { doneCount, library, useQuest } from '@/state/quest';

const TIMES: { v: number | null; l: string }[] = [
  { v: 15, l: '15 min' },
  { v: 30, l: '30 min' },
  { v: 60, l: '1 hour' },
  { v: null, l: 'Any' },
];

export default function Find() {
  const q = useQuest();
  const { isPremium } = usePremium();
  const [ageText, setAgeText] = useState('');
  const [paywall, setPaywall] = useState(false);
  const [last, setLast] = useState<string | undefined>();
  const f = q.filters;
  const results = search(library, f, isPremium);
  const unlocked = results.filter((a) => a.free || isPremium);

  const addAge = () => {
    if (ageError(ageText)) return;
    q.setAges([...q.ages, Number(ageText)].sort((a, b) => a - b));
    setAgeText('');
  };
  const dice = () => {
    const a = roll(library, f, isPremium, Math.random, last);
    if (!a) return;
    setLast(a.id);
    track('core_action_started', { what: 'dice' });
    router.push(`/activity/${a.id}`);
  };

  return (
    <Screen testID="find">
      <H1>What shall we do?</H1>
      <Section title="Children's ages">
        <Row wrap gap={8}>
          {q.ages.map((a, i) => (
            <Chip key={i} label={`${a} ✕`} selected onPress={() => q.setAges(q.ages.filter((_, j) => j !== i))} testID={`age-chip-${a}`} />
          ))}
          {q.ages.length === 0 ? <Muted>Add ages to see what suits everyone.</Muted> : null}
        </Row>
        <Row gap={8} style={{ alignItems: 'flex-end' }}>
          <Stack style={{ flex: 1 }}>
            <Field label="Add an age" value={ageText} onChangeText={setAgeText} inputMode="numeric" keyboardType="number-pad" maxLength={2} placeholder="e.g. 5" onSubmitEditing={addAge} testID="age-input" error={ageText && ageError(ageText) ? ageError(ageText) : null} />
          </Stack>
          <IconButton icon="add-circle" label="Add age" onPress={addAge} size={36} testID="age-add" />
        </Row>
      </Section>
      <Segmented label="Where" options={[{ value: 'any', label: 'Anywhere' }, { value: 'indoor', label: 'Indoors' }, { value: 'outdoor', label: 'Outdoors' }]} value={f.place} onChange={(place) => q.setFilters({ place })} testID="place" />
      <Row wrap gap={8}>
        {TIMES.map((t) => (
          <Chip key={t.l} label={t.l} selected={f.maxMinutes === t.v} onPress={() => q.setFilters({ maxMinutes: t.v })} testID={`time-${t.v ?? 'any'}`} />
        ))}
        <Chip label="Costs nothing" selected={f.freeOnly} onPress={() => q.setFilters({ freeOnly: !f.freeOnly })} testID="free-only" />
      </Row>
      <Row wrap gap={8}>
        {Object.entries(TAG_LABELS).map(([tag, label]) => (
          <Chip key={tag} label={label} selected={f.tag === tag} onPress={() => q.setFilters({ tag: f.tag === tag ? null : tag })} testID={`tag-${tag}`} />
        ))}
      </Row>
      <Button title="🎲 Roll the dice" onPress={dice} disabled={!unlocked.length} testID="dice" />
      <Muted testID="result-count">{`${unlocked.length} ideas fit${results.length > unlocked.length ? ` (+${results.length - unlocked.length} with Premium)` : ''} · ${doneCount(q.done)} done so far`}</Muted>
      {results.length === 0 ? <EmptyState icon="sad-outline" title="Nothing fits all of that" body="Try fewer filters, or a longer time." /> : null}
      <Stack gap={8}>
        {results.slice(0, 40).map((a) => (
          <ActivityCard key={a.id} a={a} onLocked={() => setPaywall(true)} />
        ))}
      </Stack>
      <PaywallSheet visible={paywall} onClose={() => setPaywall(false)} reason="That one's in the full library. Premium unlocks every activity and the seasonal packs." />
    </Screen>
  );
}
