import Icon from 'react-native-vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import ChatsHeaderBtns from '@/components/ChatsHeaderBtns';
import i18n from '../../../i18n';
import { useAuthStore } from '@/store/authStore';
import { useChatsStore } from '@/store/chatsStore';
import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';

export default function TabLayout() {
  // get curentUser state zustand zuAuth
  const { currentUser } = useAuthStore();
  const { chats } = useChatsStore();

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // avatar url state
  const [avatarUri, setAvatarUrl] = useState<string>('');

  // calculate total unread messages
  const totalUnreadMessages = chats?.reduce((acc, chat) => acc + (chat.unReadedMsgs || 0), 0) || 0;

  // check if currentUser is truthy
  const isUserLoggedIn = currentUser !== null ? true : false;

  // check if the user is logged in
  useEffect(() => {
    // check if the user is not logged in
    if (!currentUser) return;

    // get avatar from currentUser
    const { avatar } = currentUser;

    // Placeholder avatar and user info
    const avatarUri = avatar.startsWith('http') ? avatar : `${apiUrl}${avatar}`;

    // set avatar url
    setAvatarUrl(avatarUri);
  }, [currentUser]);

  return (
    <Tabs
      screenOptions={() => ({
        headerStyle: { shadowColor: 'transparent', elevation: 0 },
        headerStatusBarHeight: 0,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontFamily: 'BalooBhaijaan2' },
        headerShown: isUserLoggedIn ? true : false, // Dynamically control header visibility
        tabBarActiveTintColor: 'dodgerblue',
        tabBarInactiveTintColor: '#747474ff',
        tabBarLabelStyle: { fontFamily: 'BalooBhaijaan2', fontSize: 13, marginTop: 5 },
        tabBarStyle: { display: isUserLoggedIn ? 'flex' : 'none', ...styles.tapBarStyle },
        tabBarBackground: () => (
          <BlurView
            intensity={100}
            tint='light' // or "dark" / "extraLight"
            style={styles.blurViewStyle}
          />
        ),
      })}
    >
      {/* index */}
      <Tabs.Screen
        name='index'
        options={{
          href: null,
        }}
      />

      {/* profile screen */}
      <Tabs.Screen
        name='profile/index'
        options={{
          title: i18n.t('tabsLayout.profile'),
          tabBarIcon: () => <Image source={{ uri: avatarUri }} style={styles.profileAvatarStyle} />,
        }}
      />

      {/* chats screen */}
      <Tabs.Screen
        name='chats/index'
        options={{
          title: i18n.t('tabsLayout.chats'),
          tabBarIcon: ({ color }) => <Icon size={30} name='chatbubbles-outline' color={color} />,
          headerRight: () => isUserLoggedIn && <ChatsHeaderBtns />,
          tabBarBadge: totalUnreadMessages > 0 ? totalUnreadMessages : undefined,
          tabBarBadgeStyle: styles.tabbarBadgeStyle,
        }}
      />

      {/* calls screen */}
      <Tabs.Screen
        name='calls/index'
        options={{
          title: i18n.t('tabsLayout.calls'),
          tabBarIcon: ({ color }) => <Icon size={30} name='call-outline' color={color} />,
        }}
      />

      {/* setting screen */}
      <Tabs.Screen
        name='settings/index'
        options={{
          title: i18n.t('tabsLayout.settings'),
          tabBarIcon: ({ color }) => <Icon size={30} name='settings-outline' color={color} />,
        }}
      />
    </Tabs>
  );
}

// styles
const styles = StyleSheet.create({
  tapBarStyle: {
    paddingHorizontal: 10,
    height: 65,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderRadius: 50,
    elevation: 0,
    position: 'absolute',
    marginHorizontal: 10,
    marginBottom: 10,
  },

  // blur view style
  blurViewStyle: {
    borderRadius: 50,
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },

  // tabbar badge style
  tabbarBadgeStyle: {
    backgroundColor: 'dodgerblue',
    fontFamily: 'BalooBhaijaan2',
    lineHeight: 23,
  },

  // profile avatar style
  profileAvatarStyle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
  },
});
