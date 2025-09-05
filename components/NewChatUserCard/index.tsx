import 'react-native-get-random-values';
import { ChatCard, ChatTypes, SingleChat } from '@/interfaces/chats';
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { v4 } from 'uuid';
import { useAuthStore } from '@/store/zuAuth';
import { useChatsStore } from '@/store/zuChats';

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
  // router
  const router = useRouter();
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
    // set openedChat
    setOpenedChat(chat);
    // create new chat request
    addNewChat(chat as ChatCard);
    console.log('User pressed');
    router.push(`/single_chat/${_id}`);
  };
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: `${apiUrl}${avatarUrl}` }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={{ color: 'gray' }}>{usrname}</Text>
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
    fontFamily: 'BalooBhaijaan2',
  },
});
