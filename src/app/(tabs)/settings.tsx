import { KitSettings } from '@/kit/Settings';
import { Card, ListRow, Section } from '@/kit/ui';
import { library } from '@/state/quest';

export default function Settings() {
  return (
    <KitSettings reminder={{ title: 'KidQuest', body: 'Weekend coming up? Plan a screen-free adventure.', explain: 'A weekly nudge before the weekend. Never more.', weekly: true }}>
      <Section title="About KidQuest">
        <Card>
          <ListRow icon="people-outline" title="Made for parents and carers" subtitle="We only store your children's ages, on this phone. No names, photos or accounts." />
          <ListRow icon="library-outline" title={`${library.length} activities`} subtitle={`${library.filter((a) => a.free).length} free, the rest with Premium. All work offline.`} />
        </Card>
      </Section>
    </KitSettings>
  );
}
