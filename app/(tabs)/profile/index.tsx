import { Button } from '@rneui/themed';

import { Text, View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/zuAuth';

export default function Profile() {
  // expo router
  const router = useRouter();
  // zustand
  const { logout, currentUser } = useAuthStore();
  // check if the user is logged in
  useEffect(() => {
    // check if the user is not logged in
    if (!currentUser) router.push('/');
  }, [currentUser]);
  // remove access token
  const btnPressHandler = async () => logout();

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
