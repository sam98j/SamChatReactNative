import { ChatMessage, MessagesTypes } from '@/interfaces/chats';
import { RootState } from '@/store';
import { MessagesGroubedByDate } from '@/utils/chats';
import React, { FC, useRef } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import ChatMessageViewer from '../ChatMessageViewer';
import { View } from 'react-native';
import ChatActionMsg from '../ChatActionMsg';
import { useChatsStore } from '@/store/zuChats';
import { useSearchParams } from 'expo-router/build/hooks';

// component props
type Props = { messages: MessagesGroubedByDate };

const ChatMessagesLoader: FC<Props> = ({ messages }) => {
  // get opened chat name
  const groupName = useSelector((state: RootState) => state.chatsSlice.openedChat?.name)!;
  // scroll view ref
  const messagesContainerRef = useRef<ScrollView>(null);
  // opeened chat id
  const chat_id = useSearchParams().get('chat_id'); // Access the chat_id parameter
  // chat messages from zustand zuChats
  const {
    chatMessages,
    chatMessagesBatchNo,
    isLastChatMessagesBatch,
    createChatAPIres,
    openedChat,
    addMessageToChat,
    setOpenedChatMessages,
    clearChatMessages,
    setChatMessagesBatchNo,
    setUserOnlineStatus,
    setMessageToBeMarketAsReaded,
  } = useChatsStore();
  // scroll to the bottom of the view
  const onScrollEndHandler = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    if (offsetY <= 0) {
      console.log('Scrolled to top');
      // when usr scroll throwout the messages
      // when usr reach last oldest message
      if (isLastChatMessagesBatch) return;
      if (!isLastChatMessagesBatch) {
        // terminate if it's last batch of chat messages
        console.log('fetching new messages', isLastChatMessagesBatch);
        // get chat messages based on page no
        setOpenedChatMessages({
          chatId: chat_id!,
          msgBatch: chatMessagesBatchNo + 1,
        });
        setChatMessagesBatchNo(chatMessagesBatchNo + 1);
      }
    }
  };
  return (
    <ScrollView style={styles.messagesContainer} onScroll={onScrollEndHandler} ref={messagesContainerRef}>
      {messages.dates?.map((date, i) => {
        return (
          <View key={i}>
            {/* messages data */}
            <Text style={styles.messagesDate}>{date}</Text>
            {messages.messages[i].map((msg: ChatMessage) => {
              // destruct
              const { sender, actionMsgType, status } = msg;
              // log msg state
              // check for chat action message
              if (msg.type === MessagesTypes.ACTION) {
                return <ChatActionMsg data={{ sender, actionMsgType, groupName }} key={msg._id} />;
              }
              // if it's a regular chat message
              return <ChatMessageViewer msg={msg} key={msg._id} />;
            })}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ChatMessagesLoader;

// style sheet
const styles = StyleSheet.create({
  // messages container
  messagesContainer: {
    width: '100%',
    paddingHorizontal: 15,
  },
  messagesDate: {
    textAlign: 'center', // Align text to the center
    color: '#3b82f6', // Equivalent to 'blue.500'
    marginTop: 30, // Add top margin
    backgroundColor: '#ebf8ff', // Equivalent to 'blue.50'
    borderRadius: 10, // Rounded corners (equivalent to 'xl')
    padding: 3, // Padding inside the text
    alignSelf: 'center', // Center the text horizontally
    fontFamily: 'BalooBhaijaan2',
  },
});
