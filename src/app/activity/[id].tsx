import { router, Stack as RouterStack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { track } from '@/kit/analytics';
import { useCelebrate } from '@/kit/celebrate';
import { formatDay, todayKey } from '@/kit/dates';
import { useFeedback } from '@/kit/feedback';
import { usePremium } from '@/kit/premium';
import { Body, Button, Card, Chip, EmptyState, H1, Label, Muted, Note, Row, Screen, Section, Sheet, Stack, Strong } from '@/kit/ui';
import { weekDays } from '@/domain/activities';
import { energyLabel, placeIcon } from '@/components/ActivityCard';
import { library, useQuest } from '@/state/quest';

export default function ActivityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const a = library.find((x) => x.id === id);
  const q = useQuest();
  const { isPremium } = usePremium();
  const celebrate = useCelebrate();
  const { toast } = useFeedback();
  const [planning, setPlanning] = useState(false);
  const today = todayKey();
  if (!a) return <Screen edges={[]}><EmptyState title="Activity not found" action={<Button title="Back" onPress={() => router.back()} />} /></Screen>;
  if (!a.free && !isPremium) return <Screen edges={[]}><EmptyState icon="lock-closed-outline" title="This one's in the full library" body="Premium unlocks every activity." action={<Button title="Back" onPress={() => router.back()} />} /></Screen>;
  const doneToday = (q.done[today] ?? []).includes(a.id);
  const saved = q.saved.includes(a.id);

  return (
    <Screen edges={[]} testID="activity">
      <RouterStack.Screen options={{ title: a.title }} />
      <H1>{a.title}</H1>
      <Body>{a.summary}</Body>
      <Muted>{`${placeIcon[a.place]} · ${a.minutes} min · ages ${a.ageMin}–${a.ageMax} · ${energyLabel[a.energy]} · ${a.cost === 'free' ? 'costs nothing' : 'low cost'}`}</Muted>
      {a.safety ? <Note tone="warning">{a.safety}</Note> : null}
      <Section title="You'll need">
        {a.materials.length ? a.materials.map((m) => <Body key={m}>{`• ${m}`}</Body>) : <Muted>Nothing at all.</Muted>}
      </Section>
      <Section title="How to">
        <Card>
          {a.steps.map((s, i) => (
            <Row key={i} gap={10} style={{ alignItems: 'flex-start' }}>
              <Strong>{`${i + 1}.`}</Strong>
              <Body style={{ flex: 1 }}>{s}</Body>
            </Row>
          ))}
        </Card>
      </Section>
      <Row wrap gap={8}>
        <Button
          title={doneToday ? 'Done today ✓' : 'We did it!'}
          variant={doneToday ? 'secondary' : 'primary'}
          testID="done"
          onPress={() => {
            if (doneToday) return q.undoDone(a.id);
            q.markDone(a.id);
            track('core_action_completed', { what: 'activity_done', energy: a.energy });
            celebrate({ scene: 'sticker', emoji: '⭐', title: 'Sticker on the chart!', body: `${a.title}: done.` });
          }}
        />
        <Button small variant="secondary" title={saved ? 'Saved ★' : 'Save'} onPress={() => q.toggleSaved(a.id)} testID="save" />
        <Button small variant="secondary" title="Plan it" icon="calendar-outline" onPress={() => setPlanning(true)} testID="plan" />
      </Row>
      <Label>Ideas only: please check activities suit your children and supervise as needed.</Label>
      <Sheet visible={planning} onClose={() => setPlanning(false)} title="Which day this week?">
        <Stack>
          <Row wrap gap={8}>
            {weekDays(today).map((d) => (
              <Chip
                key={d}
                label={formatDay(d)}
                selected={(q.plan[d] ?? []).includes(a.id)}
                testID={`plan-${d}`}
                onPress={() => {
                  q.planFor(d, a.id);
                  setPlanning(false);
                  toast(`Planned for ${formatDay(d, 'long')}.`);
                }}
              />
            ))}
          </Row>
        </Stack>
      </Sheet>
    </Screen>
  );
}
