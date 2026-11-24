import { router } from 'expo-router';
import { AdBanner } from '@/kit/ads';
import { formatDay, todayKey } from '@/kit/dates';
import { Card, H1, IconButton, Muted, Row, Screen, Section, Strong } from '@/kit/ui';
import { weekDays } from '@/domain/activities';
import { library, useQuest } from '@/state/quest';

export default function Plan() {
  const q = useQuest();
  const today = todayKey();
  const days = weekDays(today);
  const planned = days.reduce((n, d) => n + (q.plan[d]?.length ?? 0), 0);
  return (
    <Screen testID="week" banner={<AdBanner placement="plan_banner" />}>
      <H1>This week</H1>
      <Muted>{planned ? `${planned} activities planned. 🚀` : 'Open any activity and tap "Plan it" to put it on a day.'}</Muted>
      {days.map((d) => (
        <Section key={d} title={`${formatDay(d, 'long')}${d === today ? ' · today' : ''}`}>
          {(q.plan[d] ?? []).length === 0 ? <Muted>Free day.</Muted> : null}
          {(q.plan[d] ?? []).map((id) => {
            const a = library.find((x) => x.id === id);
            if (!a) return null;
            const done = (q.done[d] ?? []).includes(id);
            return (
              <Card key={id} onPress={() => router.push(`/activity/${id}`)} testID={`planned-${d}-${id}`}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Strong>{`${done ? '⭐ ' : ''}${a.title}`}</Strong>
                  <IconButton icon="close" label={`Remove ${a.title} from ${formatDay(d, 'long')}`} onPress={() => q.unplan(d, id)} />
                </Row>
              </Card>
            );
          })}
        </Section>
      ))}
    </Screen>
  );
}
