import { ChatTypes } from '@/interfaces/chats';
import { Avatar } from '@rneui/themed';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getTime, TimeUnits } from '@/utils/time';
import i18n from '../../i18n';
import { useChatsStore } from '@/store/chatsStore';
import { useAuthStore } from '@/store/authStore';
import MsgActionsMenu from '../MsgActionsMenu';

type SingleChatHeaderProps = {
  title: string;
  onBackPress: () => void;
};

const SingleChatHeader: React.FC<SingleChatHeaderProps> = () => {
  // api url
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // get opened chat from redux
  const { openedChat, setUserOnlineStatus, chatUsrStatus, msgsActionsMenu } = useChatsStore();

  // logged in user id from zustand zuAuth
  const loggedInUser = useAuthStore().currentUser?._id;

  // chat name
  const [chatUser] = useState(() => openedChat!.members.filter((member) => member._id !== loggedInUser)[0]);

  // chat avatar
  const [chatAvatar] = useState(() => {
    // get chat member
    const chatMember = openedChat!.members.filter((member) => member._id !== loggedInUser)[0];
    // return chat avatar if it's contain https
    if (chatMember.avatar?.startsWith('https://')) return chatMember.avatar;
    // return
    return `${apiUrl}${openedChat!.type === ChatTypes.GROUP ? openedChat!.avatar : chatMember.avatar}`;
  });

  // chatName
  const [chatName] = useState(() => (openedChat!.name ? openedChat!.name : chatUser.name));

  // chat usr last seen
  const [chatUsrLastSeen, setChatUsrLastSeen] = useState('');

  // use router to navigate back
  const router = useRouter();

  // get locale
  const locale = i18n.locale;

  // is chat usr online
  const isChatUsrOnline = chatUsrStatus === 'online' && chatUsrStatus && i18n.t('chatHeader.online');
  // is chat usr offline
  const isChatUsrOffline = chatUsrStatus !== 'online' && chatUsrStatus && chatUsrLastSeen;

  // handle back button press
  const handleBackPress = () => router.back();

  // observe openedChat 
  React.useEffect(() => {
    // check if no opened chat
    if (!openedChat) return;

    // get usr online status
    if (openedChat?.type === ChatTypes.INDIVISUAL) setUserOnlineStatus(chatUser!._id);

    // get usr online status
    if (openedChat?.type === ChatTypes.GROUP) setUserOnlineStatus(undefined);

  }, [openedChat]);

  // observe chatUsrStatus
  React.useEffect(() => {
    // check if no chat usr status
    if (!chatUsrStatus) return;

    // set chat usr last seen
    setChatUsrLastSeen(`${i18n.t('chatHeader.last_seen')} ${getTime(
    chatUsrStatus!,
    TimeUnits.fullTime,
    locale as never
  )}`);
  }, [chatUsrStatus]);

  return (
    <View style={[styles.headerContainer, locale === 'ar' && styles.arDirection]}>
      {/* msg actions menu */}
      {msgsActionsMenu && <MsgActionsMenu />}

      {/* back button */}
      <View style={styles.mainContainer}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleBackPress}>
          <Icon  name='chevron-forward' size={30} color='dodgerblue' />
        </TouchableOpacity>

        {/* Avatar */}
        <Avatar source={{ uri: chatAvatar }} size={'small'} containerStyle={{ backgroundColor: '#bbb' }} rounded />

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{chatName}</Text>
          {/* is chat usr offline */}
          {isChatUsrOffline && <Text style={styles.lastseen}>{isChatUsrOffline}</Text>}
          {/* user online status */}
          {isChatUsrOnline && <Text style={styles.onlineStatus}>{isChatUsrOnline}</Text>}
        </View>

        {/* chats calls */}
        <View style={styles.chatsCallsContainer}>
          <TouchableOpacity>
            <Icon name='call-outline' size={23} color='dodgerblue' />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name='videocam-outline' size={25} color='dodgerblue' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SingleChatHeader;

const styles = StyleSheet.create({
  headerContainer: {
    // height: 55,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
    width: '100%',
  },

  mainContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // ardir
  arDirection: {
    direction: 'rtl',
  },
  
  //   title container
  titleContainer: {
    flex: 1,
    display: 'flex',
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: 'BalooBhaijaan2',
    fontSize: 16,
    color: '#000',
  },
  lastseen: {
    fontSize: 12,
    color: '#aaa',
    fontFamily: 'BalooBhaijaan2',
  },
  //   online status
  onlineStatus: {
    fontSize: 12,
    color: 'green',
    fontFamily: 'BalooBhaijaan2',
  },
  //   chats calls container
  chatsCallsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
  },
});
