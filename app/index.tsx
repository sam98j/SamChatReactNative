import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const App = () => {
  const { setCurrentUser } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasToken, setHasToken] = React.useState(false);

  // init function
  const init = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      setHasToken(!!token);
      // Start loading user data (offline-first will load cache immediately)
      setCurrentUser();
    } catch (e) {
      console.error('Initial load failed', e);
    } finally {
      setIsLoading(false);
    }
  };

  // init effect
  useEffect(() => {
    init();
  }, []);

  if (isLoading) {
    return <View className='flex-1 bg-white' />;
  }

  return <Redirect href={hasToken ? '/(main)/(tabs)/chats' : '/(onboarding)'} />;
};

export default App;
