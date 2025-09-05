import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import { store } from '../store';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// i cant use module there
// import font baloo
import BalooBhaijaan2 from '@/assets/fonts/BalooBhaijaan2-Regular.ttf';

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
    <Provider store={store}>
      <GestureHandlerRootView key={Math.random()}>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='(tabs)/index' options={{ headerShown: false }} />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
