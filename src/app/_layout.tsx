import { Nunito_800ExtraBold, useFonts } from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Intro } from '@/kit/Intro';
import { prefsStore } from '@/kit/prefs';
import { KitRoot } from '@/kit/Root';
import { useTheme } from '@/kit/theme';
import { brand } from '@/brand';

SplashScreen.preventAutoHideAsync().catch(() => {});
const usePrefs = prefsStore('kidquest', 9);
const Art = ({ children }: { children: string }) => <Text style={{ fontSize: 88 }}>{children}</Text>;

function Shell() {
  const { c } = useTheme();
  const onboarded = usePrefs((s) => s.onboarded);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="activity/[id]" options={{ headerShown: true, title: '', headerTintColor: c.text, headerStyle: { backgroundColor: c.bg }, headerShadowVisible: false }} />
      </Stack>
      {!onboarded ? (
        <View style={StyleSheet.absoluteFill}>
          <Intro
            cta="Find an activity"
            onDone={() => usePrefs.getState().setOnboarded()}
            steps={[
              { title: 'Bored? Sorted.', body: 'Screen-free activities for ages 2 to 12, filtered by age, time, indoors or out, and what it costs.', art: <Art>🎲</Art> },
              { title: 'Simple steps', body: 'Every idea has a materials list, short steps and safety notes. Most use things you already have.', art: <Art>✂️</Art> },
              { title: 'For grown-ups', body: "KidQuest is made for parents and carers. We only ask your children's ages, never names or photos.", art: <Art>🧑‍🧒</Art> },
            ]}
          />
        </View>
      ) : null}
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({ Nunito_800ExtraBold });
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <KitRoot brand={brand}>
      <Shell />
    </KitRoot>
  );
}
