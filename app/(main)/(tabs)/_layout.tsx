import Icon from 'react-native-vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import ChatsHeaderBtns from '@/components/ChatsHeaderBtns';
import i18n from '../../../i18n';
import { useAuthStore } from '@/store/zuAuth';
import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  // get curentUser state zustand zuAuth
  const { currentUser } = useAuthStore();
  // check if currentUser is truthy
  const isUserLoggedIn = currentUser !== null ? true : false;
  return (
    <Tabs
      screenOptions={() => ({
        tabBarActiveTintColor: 'dodgerblue',
        headerStyle: { shadowColor: 'transparent', elevation: 0 },
        headerTitleAlign: 'center',
        headerTitleStyle: { fontFamily: 'BalooBhaijaan2', display: isUserLoggedIn ? 'flex' : 'none' },
        tabBarLabelStyle: { fontFamily: 'BalooBhaijaan2', fontSize: 13, marginTop: 5 },
        headerShown: isUserLoggedIn ? true : false, // Dynamically control header visibility
        tabBarStyle: {
          display: isUserLoggedIn ? 'flex' : 'none',
          ...styles.tapBarStyle,
        },
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
      {/* home screen */}
      <Tabs.Screen
        name='profile/index'
        options={{
          title: i18n.t('tabsLayout.profile'),
          tabBarIcon: ({ color }) => <Icon size={30} name='person-circle-outline' color={color} />,
        }}
      />
      {/* chats screen */}
      <Tabs.Screen
        name='chats/index'
        options={{
          title: i18n.t('tabsLayout.chats'),
          tabBarIcon: ({ color }) => <Icon size={30} name='chatbubbles-outline' color={color} />,
          headerRight: () => isUserLoggedIn && <ChatsHeaderBtns />,
        }}
      />
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
    borderRadius: 20,
    elevation: 0,
    position: 'absolute',
    marginHorizontal: 10,
    marginBottom: 10,
  },

  // blur view style
  blurViewStyle: {
    borderRadius: 20,
    flex: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});
