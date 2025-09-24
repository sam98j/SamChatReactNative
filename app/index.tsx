import { useAuthStore } from '@/store/zuAuth';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const App = () => {
  // get auth zustand zuAuth
  const { setCurrentUser } = useAuthStore();
  //   get access token from expo secure store
  const accessToken = SecureStore.getItem('access_token');
  //   get current user when component mount
  useEffect(() => {
    setCurrentUser();
  }, []);
  return (
    <View>
      <Redirect href={`${accessToken ? '/(tabs)/chats' : '/(onboarding)'}`} />
    </View>
  );
};

export default App;
