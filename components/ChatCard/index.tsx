import { Avatar } from '@rneui/themed';
import { FC, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ChatCard, ChatTypes, MessagesTypes } from '@/interfaces/chats';
import i18n from '@/i18n';
import NonTextMsgPreview from '../NonTextMsgPreview';
import { useRouter } from 'expo-router';
import { getTime, TimeUnits } from '@/utils/time';
import { useAuthStore } from '@/store/zuAuth';
import { useChatsStore } from '@/store/zuChats';
import ChatCardLastMsgPreview from '../ChatCardLastMsgPreview';

type Props = {
  chat: ChatCard;
  selectChat?: React.Dispatch<React.SetStateAction<string[]>>;
};

export const ChatCardContainer: FC<Props> = ({ chat }) => {
  // api url
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  // zustand zuAuhtStore
  const loggedInUser = useAuthStore().currentUser?._id;
  // get zustand zuChats
  const { setOpenedChat } = useChatsStore();
  // router
  const router = useRouter();
  // chat name
  const [chatUser] = useState(() => chat.members.filter((member) => member._id !== loggedInUser)[0]);
  // chat avatar
  const [chatAvatar] = useState(() => {
    // get chat member
    const chatMember = chat.members.filter((member) => member._id !== loggedInUser)[0];
    // return
    return `${apiUrl}${chat.type === ChatTypes.GROUP ? chat.avatar : chatMember.avatar}`;
  });
  // language
  const prefLang = i18n.locale;
  // chatName
  const [chatName] = useState(() => (chat.name ? chat.name : chatUser.name));
  // handle card press
  const handleCardPress = () => {
    // dispatch
    setOpenedChat(chat);
    // if selectChat is passed, call it
    router.push(`/single_chat/${chat._id}`);
  };

  if (!chat.lastMessage) return;
  return (
    <TouchableOpacity onPress={handleCardPress}>
      <View style={[styles.chatCardContainer, { direction: prefLang === 'ar' ? 'rtl' : 'ltr' }]}>
        {/* chat avatar */}
        <Avatar size={50} rounded containerStyle={{ backgroundColor: 'blue' }} source={{ uri: `${chatAvatar}` }} />
        {/* chat name */}
        <View style={{ flex: 1, display: 'flex', height: '100%', paddingHorizontal: 10 }}>
          {/* chat name */}
          <Text style={[styles.chatCardName]}>{chatName!}</Text>
          {/* last message content*/}
          <ChatCardLastMsgPreview lastMsg={chat.lastMessage} />
        </View>
        {/* right section */}
        <View style={styles.chatCardRightSection}>
          <Text style={[styles.textFontFamily, { color: 'gray' }]}>{getTime(chat.lastMessage.date, TimeUnits.time)}</Text>
          {/*unreaded messages badge  */}
          <View style={[styles.chatCardUnreadedBadge]}>
            <View
              style={{
                backgroundColor: 'dodgerblue',
                borderRadius: 50,
                width: 25,
                height: 25,
                display: chat.unReadedMsgs > 0 ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={[styles.textFontFamily, { color: 'white' }]}>{chat.unReadedMsgs}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatCardContainer;
// styles
const styles = StyleSheet.create({
  chatCardContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  // chat name
  chatCardName: {
    fontSize: 20,
    flexGrow: 1,
    fontFamily: 'BalooBhaijaan2',
  },
  // right section
  chatCardRightSection: {
    display: 'flex',
    alignItems: 'flex-end',
    color: 'dodgerblue',
    justifyContent: 'flex-end',
  },
  chatCardUnreadedBadge: {
    display: 'flex',
    alignItems: 'flex-end',
    flexGrow: 1,
    width: '100%',
  },
  textFontFamily: {
    fontFamily: 'BalooBhaijaan2',
  },
});
