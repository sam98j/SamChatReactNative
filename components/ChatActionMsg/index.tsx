import React, { FC } from 'react';
import { ChatMessage } from '@/interfaces/chats';
import { useChatsStore } from '@/store/zuChats';
import { useAuthStore } from '@/store/zuAuth';
import i18n from '@/i18n';
import { Text, View } from 'react-native';

// component props
type Props = Pick<ChatMessage, 'sender' | 'actionMsgType'> & {
  groupName: string;
};

const ChatActionMsg: FC<{ data: Props }> = ({ data }) => {
  // destruct props
  const { sender, actionMsgType, groupName } = data;
  // zustand zuChats
  const { openedChat } = useChatsStore();
  // loggedInUserId
  const loggedInUserId = useAuthStore().currentUser?._id;
  // translate method
  //   is action created by current user
  const isActionCreatedByCurrentUser = loggedInUserId === sender._id;
  // get current locale from expo router
  const locale = i18n.locale;
  //   translate function
  const t = i18n.t.bind(i18n);
  // taa letter in arabic langugae
  const taaLetterinArabicLang = locale === 'ar' && isActionCreatedByCurrentUser ? 'ت' : '';
  //   chat creation action text
  const chatCreationActionText = `${
    isActionCreatedByCurrentUser ? t('openedChat.chatActionsMessages.creation.youPronoun') : sender.name
  } ${t('openedChat.chatActionsMessages.creation.created')}${taaLetterinArabicLang} ${t(
    'openedChat.chatActionsMessages.creation.theGroup'
  )} ' ${groupName} '`;
  //   chat action message
  return (
    <View is-chat-open={String(Boolean(openedChat))}>
      <Text>{actionMsgType === 'CREATION' && chatCreationActionText}</Text>
    </View>
  );
};

export default ChatActionMsg;
