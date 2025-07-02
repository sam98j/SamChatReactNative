import { Avatar, Button } from '@rneui/themed';

import ChatCard from '@/components/ChatCard';
import { Text, View, StyleSheet } from 'react-native';
import { RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { logout } from '@/store/auth.slice';

export default function Profile() {
  // expo router
  const router = useRouter();
  // dispatch method
  const dispatch = useDispatch();
  // check if the user is logged in
  const { apiResponse, currentUser } = useSelector((state: RootState) => state.authSlice);
  useEffect(() => {}, []);
  // remove access token
  const btnPressHandler = async () => {
    // logout user
    dispatch(logout());
    // remove access token
    // push to welcome screen
    router.push('/');
  };
  return (
    <View style={styles.container}>
      <Button radius={10} color='red' onPress={btnPressHandler}>
        <Text style={{ color: 'white', fontFamily: 'BalooBhaijaan2' }}>تسجيل الخروج</Text>
      </Button>
    </View>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: '100%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'flex-end',
  },
});
