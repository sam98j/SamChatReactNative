import Icon from 'react-native-vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import ChatsHeaderBtns from '@/components/ChatsHeaderBtns';
import i18n from '../../../i18n';
import { useAuthStore } from '@/store/zuAuth';

export default function TabLayout() {
  // get curentUser state zustand zuAuth
  const { currentUser } = useAuthStore();
  // check if currentUser is truthy
  const isUserLoggedIn = currentUser !== null ? true : false;
  return (
    <Tabs
      screenOptions={() => ({
        tabBarActiveTintColor: 'dodgerblue',
        headerStyle: { shadowColor: 'white' },
        headerTitleAlign: 'center',
        headerTitleStyle: { fontFamily: 'BalooBhaijaan2', display: isUserLoggedIn ? 'flex' : 'none' },
        tabBarLabelStyle: { fontFamily: 'BalooBhaijaan2', fontSize: 14 },
        headerShown: isUserLoggedIn ? true : false, // Dynamically control header visibility
        tabBarStyle: {
          display: isUserLoggedIn ? 'flex' : 'none', // Dynamically control tabBar visibility
          paddingHorizontal: 10,
          height: 60,
        },
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
