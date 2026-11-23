import { CardLibrary, type CardPack } from '@/kit/cards';
import { H1, Muted, Screen } from '@/kit/ui';
import raw from '@/content/cards.json';

const pack = raw as CardPack;

export default function Learn() {
  return (
    <Screen testID="learn">
      <H1>Why play matters</H1>
      <Muted>Why screen-free, hands-on and outdoor play is good for children. Evidence-based, for grown-ups.</Muted>
      <CardLibrary pack={pack} app="kidquest" />
    </Screen>
  );
}
