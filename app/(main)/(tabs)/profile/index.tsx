import { Button } from '@rneui/themed';

import { Text, View, StyleSheet, Image } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useUsersStore } from '@/store/usersStore';

export default function Profile() {
  // expo router
  const router = useRouter();
  // zustand users
  const { currentUserProfile, getUserProfile } = useUsersStore();
  // zustand
  const { logout, currentUser } = useAuthStore();
  // check if the user is logged in
  useEffect(() => {
    // check if the user is not logged in
    if (!currentUser) return router.replace('/welcome');
    // get current user profile
    getUserProfile(currentUser!._id as string);
  }, [currentUser]);

  const btnPressHandler = async () => logout();

  // get avtar url
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // get current user avatar
  const { avatar } = currentUser!;
  // Placeholder avatar and user info
  const avatarUri = avatar.startsWith('http') ? avatar : `${apiUrl}${avatar}`;
  const name = currentUser?.name || 'اسم المستخدم';

  // return
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        {/* profile image */}
        <View style={styles.avatar}>
          <Image source={{ uri: avatarUri }} style={styles.avatar_image} />
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{currentUserProfile?.email}</Text>
        <Text style={styles.usrname}>@{currentUserProfile?.usrname}</Text>
        <Button
          type='outline'
          radius={10}
          containerStyle={styles.editBtnContainer}
          onPress={() => {
            /* Add navigation to edit profile here */
          }}
        >
          <Text style={styles.editBtnText}>تعديل الملف الشخصي</Text>
        </Button>
      </View>
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
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    flexGrow: 1,
  },
  avatar: {
    marginBottom: 16,
  },
  avatar_image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'BalooBhaijaan2',
  },
  usrname: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'BalooBhaijaan2',
  },
  email: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'BalooBhaijaan2',
  },
  editBtnContainer: {
    width: '60%',
    marginTop: 10,
  },
  editBtnText: {
    color: '#007bff',
    fontFamily: 'BalooBhaijaan2',
    fontSize: 16,
  },
});
