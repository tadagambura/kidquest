import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { usePremium } from '@/kit/premium';
import { useTheme } from '@/kit/theme';
import { Card, Muted, Row, Stack, Strong } from '@/kit/ui';
import type { Activity } from '@/domain/activities';

export const placeIcon = { indoor: '🏠', outdoor: '🌳', either: '🏠🌳' } as const;
export const energyLabel = { calm: 'Calm', medium: 'Busy', high: 'Full of beans' } as const;

export function ActivityCard({ a, onLocked }: { a: Activity; onLocked?: () => void }) {
  const { c } = useTheme();
  const { isPremium } = usePremium();
  const locked = !a.free && !isPremium;
  return (
    <Card onPress={() => (locked ? onLocked?.() : router.push(`/activity/${a.id}`))} testID={`activity-${a.id}`} accessibilityLabel={`${a.title}${locked ? ', Premium' : ''}. ${a.summary}`}>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Stack gap={2} style={{ flex: 1 }}>
          <Strong>{a.title}</Strong>
          <Muted numberOfLines={2}>{a.summary}</Muted>
        </Stack>
        {locked ? <Ionicons name="lock-closed" size={16} color={c.textMuted} /> : null}
      </Row>
      <Muted>{`${placeIcon[a.place]} · ${a.minutes} min · ages ${a.ageMin}–${a.ageMax} · ${energyLabel[a.energy]}${a.cost === 'free' ? ' · free' : ''}`}</Muted>
    </Card>
  );
}
