import { Avatar, Button } from '@rneui/themed';

import ChatCard from '@/components/ChatCard';
import { Text, View, StyleSheet } from 'react-native';
import { RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import WelcomeScreen from '../welcome';
import * as SecureStore from 'expo-secure-store';
import Chats from './chats';
import { AnyAction } from '@reduxjs/toolkit';
import { getUserChats } from '@/api/chats';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/zuAuth';

export default function Index() {
  const dispatch = useDispatch();
  // check if the user is logged in
  // get user chats
  // zustand store
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
    console.log('run');
    // get usr chats
    setCurrentUser();
  }, []);
  // observe currentUser state change
  useEffect(() => {
    // check if currentUser is null
    if (currentUser === null) return;
    // push to chats
    router.push('/(tabs)/chats');
  }, [currentUser]);
  // is user is logged in
  const isUserLoggedIn = accessToken !== null;

  return <View style={styles.container}>{!Boolean(isUserLoggedIn) && <WelcomeScreen />}</View>;
}

// styles
const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: 'white',
  },
});
