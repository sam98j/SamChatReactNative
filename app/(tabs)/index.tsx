import { View, StyleSheet, Text } from 'react-native';
import { useEffect } from 'react';
import WelcomeScreen from '../welcome';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/zuAuth';
import Onboarding from '../(onboarding)';

export default function Index() {
  // expo router
  const router = useRouter();
  // current user from zustand zuAuth
  const { currentUser } = useAuthStore();
  // access token
  const accessToken = SecureStore.getItem('access_token');

  // zustand store
  const { setCurrentUser } = useAuthStore();

  // get user chats
  useEffect(() => {
    // get usr chats
    setCurrentUser();
  }, []);
  // observe currentUser state change
  useEffect(() => {
    console.log(currentUser);
    // check if currentUser is null
    if (currentUser === null) return;
    // push to chats
    router.push('/(tabs)/chats');
  }, [currentUser]);
  // is user is logged in
  const isUserLoggedIn = accessToken !== null;

  return <View style={styles.container}>{!isUserLoggedIn && <Text>Onboarding</Text>}</View>;
}

// styles
const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white',
  },
});
