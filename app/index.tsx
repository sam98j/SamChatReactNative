import { useAuthStore } from '@/store/zuAuth';
import { Redirect, Slot, Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const App = () => {
  // get auth zustand zuAuth
  const { currentUser, setCurrentUser } = useAuthStore();
  //   expo router
  const router = useRouter();
  //   get access token from expo secure store
  const accessToken = SecureStore.getItem('access_token');
  //   get current user when component mount
  useEffect(() => {
    setCurrentUser();
  }, []);
  useEffect(() => {
    // check if current user is null
    // if (currentUser) return router.replace('/(tabs)/chats');
    // router.replace('/(auth)/login');
  }, [currentUser]);
  return (
    <View>
      <Redirect href={`${accessToken ? '/(tabs)/chats' : '/(onboarding)'}`} />
    </View>
  );
};

export default App;
