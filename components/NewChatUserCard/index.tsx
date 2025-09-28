import 'react-native-get-random-values';
import { ChatCard, ChatTypes, SingleChat } from '@/interfaces/chats';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { v4 } from 'uuid';
import { useAuthStore } from '@/store/zuAuth';
import { useChatsStore } from '@/store/zuChats';
import { useSystemStore } from '@/store/zuSystem';

type NewChatUserCardProps = {
  name: string;
  avatarUrl?: string;
  usrname: string;
  _id?: string;
};

const NewChatUserCard: React.FC<NewChatUserCardProps> = ({ name, avatarUrl, usrname, _id }) => {
  // api url
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  // logged in user id from auth slice
  const currentUser = useAuthStore().currentUser;
  // zustand zuChats
  const { setOpenedChat, addNewChat } = useChatsStore();

  // zustand system
  const { toggleBottomSheet } = useSystemStore();
  // router
  const router = useRouter();

  // usr avatar uri
  const avatarUri = avatarUrl?.startsWith('http') ? avatarUrl : `${apiUrl}${avatarUrl}`;

  // handle user press
  const onPress = () => {
    // create chat
    const chat: SingleChat = {
      _id: v4(),
      type: ChatTypes.INDIVISUAL,
      avatar: '',
      members: [
        { _id: currentUser!._id, avatar: currentUser!.avatar, name: currentUser!.name },
        { _id: _id!, avatar: avatarUrl!, name },
      ],
      name: '',
    };

    // toggle bottom sheet
    toggleBottomSheet();

    // set openedChat
    setOpenedChat(chat);
    // create new chat request
    addNewChat(chat as ChatCard);
    // navigate to the chat screen
    router.push(`/(main)/single_chat/${chat._id}`);
  };

  //
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: avatarUri }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={[styles.name, styles.fontFamily]}>{name}</Text>
        <Text style={styles.fontFamily}>{usrname}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NewChatUserCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  // font family
  fontFamily: {
    fontFamily: 'BalooBhaijaan2',
  },
});
