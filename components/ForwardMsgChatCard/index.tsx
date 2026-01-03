import { Avatar } from '@rneui/themed';
import { FC, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { ChatCard, ChatTypes } from '@/interfaces/chats';
import i18n from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  chat: ChatCard;
  selectChat?: React.Dispatch<React.SetStateAction<string[]>>;
};

export const ForwardMsgChatCard: FC<Props> = ({ chat, selectChat }) => {
  // api url
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  //   chat card checked
  const [chatCardChecked, setChatCardChecked] = useState(false);

  // zustand zuAuhtStore
  const loggedInUser = useAuthStore().currentUser?._id;

  // chat name
  const [chatUser] = useState(() => chat.members.filter((member) => member._id !== loggedInUser)[0]);

  // chat avatar
  const [chatAvatar] = useState(() => {
    // get chat member
    const chatMember = chat.members.filter((member) => member._id !== loggedInUser)[0];
    // check if the chat avatar has https
    if (chatMember.avatar?.includes('https')) return chatMember.avatar;
    // return
    return `${apiUrl}${chat.type === ChatTypes.GROUP ? chat.avatar : chatMember.avatar}`;
  });

  // language
  const prefLang = i18n.locale;

  // chatName
  const [chatName] = useState(() => (chat.name ? chat.name : chatUser.name));

  // handle card press
  const handleCardPress = () => {
    // set chat card checked
    setChatCardChecked((state) => !state);

    // select chat
    selectChat!((checkedChats) => {
      // is chat checked
      const isChecked = checkedChats.includes(chat._id);

      return isChecked ? [...checkedChats].filter((id) => id !== chat._id) : [...checkedChats, chat._id];
    });
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
          <Text>{chatName}</Text>
        </View>

        {/* right section */}
        {chatCardChecked && (
          <View style={styles.chatCardRightSection}>
            <Icon name='checkmark-circle' size={30} color='dodgerblue' />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ForwardMsgChatCard;
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
    fontSize: 16,
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
