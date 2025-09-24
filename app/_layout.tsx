import { Slot, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { Provider } from 'react-redux';
import { store } from '../store';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import font baloo
import BalooBhaijaan2 from '@/assets/fonts/BalooBhaijaan2-Regular.ttf';
import { useAuthStore } from '@/store/zuAuth';

export default function RootLayout() {
  // check if the user is logged in
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();

  // zustand zuAuth
  const { currentUser } = useAuthStore();

  useEffect(() => {
    console.log('fonts loaded');
    Font.loadAsync({
      BalooBhaijaan2,
    }).then(() => setFontsLoaded(true));
    // check if the user is logged in
  }, []);

  useEffect(() => {
    // if (currentUser === null) router.replace('/(auth)/login');
  }, [currentUser]);
  // expo router

  // router.replace('/welcome');

  if (!fontsLoaded) return null;
  return (
    // <Provider store={store}>
    <GestureHandlerRootView key={Math.random()}>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </GestureHandlerRootView>
    // </Provider>
  );
}
