import AttchFileBottomSheet from '@/components/AttackFileMenu';
import ChatMessagesLoader from '@/components/ChatMessagesLoader';
import CreateMessage from '@/components/CreateMessage';
import NoMessages from '@/components/NoMessages';
import SingleChatHeader from '@/components/SingleChatHeader';
import { ChangeMessageStatusDTO, ChatMessage, MessageStatus, MessagesTypes } from '@/interfaces/chats';
import { useAuthStore } from '@/store/zuAuth';
import { useChatsStore } from '@/store/zuChats';
import { groupChatMessagesByDate } from '@/utils/chats';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { UIActivityIndicator } from 'react-native-indicators';
import { v4 } from 'uuid';

const SingleChat = () => {
  // dispatch method
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
  // scroll view ref
  const messagesContainerRef = useRef<ScrollView>(null);
  // is fetching chat messages
  const [isFetchingChatMessages, setIsFetchingChatMessages] = useState(false);
  // opeened chat id
  const chat_id = useSearchParams().get('chat_id'); // Access the chat_id parameter
  // split chat messages with dates
  const messages = groupChatMessagesByDate(chatMessages as ChatMessage[], 'ar' as never)!;

  // loggedIn user
  const loggedInUser = useAuthStore().currentUser;

  // scroll to the bottom of the view
  useEffect(() => {
    // set is fetching chat messages
    if (chatMessages !== undefined) setIsFetchingChatMessages(false);
    // set message to be market as readed
    if (chatMessages && chatMessages.length) {
      // messages to be market as readed
      const messagesToBeMarketAsReaded = chatMessages
        .filter((message) => message.status !== MessageStatus.READED && message.sender._id !== loggedInUser?._id)
        .map((message) => message._id);
      // messages senders
      const messagesSendersIDs = chatMessages
        .filter((message) => message.status !== MessageStatus.READED && message.sender._id !== loggedInUser?._id)
        .map((message) => message.sender._id);
      // terminate if message is sended by current user
      if (!messagesToBeMarketAsReaded.length) return;
      // messagesToBeMarket as Readed
      const changeMessageStatusData: ChangeMessageStatusDTO = {
        chatId: chat_id!,
        msgIDs: messagesToBeMarketAsReaded,
        senderIDs: messagesSendersIDs,
        msgStatus: MessageStatus.READED,
      };
      // set messages to market as readed
      setMessageToBeMarketAsReaded(changeMessageStatusData);
    }

    // check for chat creattion
    if (createChatAPIres && chatMessages?.length === 0) {
      // create chat action
      const actionMessage: ChatMessage = {
        _id: v4(),
        receiverId: openedChat!._id,
        status: null,
        sender: {
          _id: loggedInUser!._id,
          name: '',
          avatar: '',
        },
        content: 'Chat Action Message',
        date: new Date().toString(),
        fileName: null,
        fileSize: null,
        msgReplyedTo: null,
        replyTo: undefined,
        type: MessagesTypes.ACTION,
        voiceNoteDuration: '',
        actionMsgType: 'CREATION',
      };
      addMessageToChat(actionMessage);
    }
    // if (chatMessagesBatchNo > 1) return;
    if (messagesContainerRef.current) messagesContainerRef.current.scrollToEnd({ animated: true });
    // scroll to the bottom of the view
  }, [chatMessages, createChatAPIres]);

  // listen for opened chat
  useEffect(() => {
    if (!openedChat) return;
    // get usr online status
    // get usr online status
    // if (openedChat?.type === ChatTypes.GROUP) dispatch(setChatUsrStatus(undefined));
    // terminate if there is chat messages
    if (chatMessages?.length) return;
    // get chats messages
    setOpenedChatMessages({
      chatId: chat_id!,
      msgBatch: 1,
    });
  }, [openedChat]);

  // component un mount
  useEffect(() => {
    // set is fetching chat messages
    setIsFetchingChatMessages(true);
    return () => {
      // log component un mount
      console.log('SingleChat unmounted');
      clearChatMessages();
      // clear usr ononline status
      setUserOnlineStatus(undefined, null);
    };
  }, []);

  // scroll to the bottom of the view when chatmessages change
  useEffect(() => {
    if (messagesContainerRef.current) messagesContainerRef.current.scrollToEnd({ animated: true });
  }, [chatMessages]);
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
    <View style={styles.container}>
      <SingleChatHeader onBackPress={() => {}} title='' />
      {/* messages container */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={{
          display: 'flex',
          justifyContent: chatMessages?.length ? 'flex-start' : 'center',
          flexGrow: 1,
          alignItems: 'center',
        }}
        onScroll={onScrollEndHandler}
        ref={messagesContainerRef}
      >
        {/* display messages */}
        {chatMessages !== undefined && !chatMessages?.length && !isFetchingChatMessages && <NoMessages />}
        {/* messages loading */}
        {isFetchingChatMessages && <UIActivityIndicator size={20} color='gray' />}
        {/* loop messages and display them in flat list */}
        {messages !== undefined && <ChatMessagesLoader messages={messages} />}
      </ScrollView>
      {/* messages container */}
      <AttchFileBottomSheet />
      <KeyboardAvoidingView style={styles.createMessageContainer}>
        <CreateMessage />
      </KeyboardAvoidingView>
    </View>
  );
};

export default SingleChat;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
    backgroundColor: 'white',
  },
  messagesContainer: {
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 70, // to avoid overlap with the message input
  },
  // create message container
  createMessageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
