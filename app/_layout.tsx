import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import font baloo
import BalooBhaijaan2 from '@/assets/fonts/BalooBhaijaan2-Regular.ttf';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function RootLayout() {
  // check if the user is logged in
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      BalooBhaijaan2,
    }).then(() => setFontsLoaded(true));
    // check if the user is logged in
  }, []);

  if (!fontsLoaded) return null;
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView key={Math.random()}>
        <SafeAreaProvider>
          <Slot />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
