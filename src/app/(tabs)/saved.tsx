import { EmptyState, H1, Screen, Stack } from '@/kit/ui';
import { ActivityCard } from '@/components/ActivityCard';
import { library, useQuest } from '@/state/quest';

export default function Saved() {
  const saved = useQuest((s) => s.saved);
  const items = library.filter((a) => saved.includes(a.id));
  return (
    <Screen testID="saved">
      <H1>Saved</H1>
      {items.length === 0 ? <EmptyState icon="star-outline" title="Nothing saved yet" body="Tap Save on any activity to keep it here. Saved ideas work offline." /> : null}
      <Stack gap={8}>
        {items.map((a) => (
          <ActivityCard key={a.id} a={a} />
        ))}
      </Stack>
    </Screen>
  );
}
