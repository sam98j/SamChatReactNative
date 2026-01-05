import AttchFileBottomSheet from '@/components/AttackFileMenu';
import ChatActions from '@/components/ChatActions';
import ChatMessagesLoader from '@/components/ChatMessagesLoader';
import CreateMessage from '@/components/CreateMessage';
import NoMessages from '@/components/NoMessages';
import SingleChatHeader from '@/components/SingleChatHeader';
import { ChangeMessageStatusDTO, ChatMessage, ChatTypes, MessageStatus, MessagesTypes } from '@/interfaces/chats';
import { useAuthStore } from '@/store/authStore';
import { useChatsStore } from '@/store/chatsStore';
import { groupChatMessagesByDate } from '@/utils/chats';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ImageBackground, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { UIActivityIndicator } from 'react-native-indicators';
import { v4 } from 'uuid';
import chatBackground from '../../../assets/images/chat_background.png';
import ForwardMsgMenu from '../forwordMsgReciversList';

const SingleChat = () => {
  // Selectors to avoid unnecessary re-renders
  const chatMessages = useChatsStore((state) => state.chatMessages);
  const chatMessagesBatchNo = useChatsStore((state) => state.chatMessagesBatchNo);
  const isLastChatMessagesBatch = useChatsStore((state) => state.isLastChatMessagesBatch);
  const createChatAPIres = useChatsStore((state) => state.createChatAPIres);
  const openedChat = useChatsStore((state) => state.openedChat);
  const isChatUsrDoingAction = useChatsStore((state) => state.isChatUsrDoingAction);
  const messagesToBeForwared = useChatsStore((state) => state.messagesToBeForwared);

  // Actions - assuming stable reference from store, but selecting individually to be safe
  const setOpenedChat = useChatsStore((state) => state.setOpenedChat);
  const addMessageToChat = useChatsStore((state) => state.addMessageToChat);
  const setOpenedChatMessages = useChatsStore((state) => state.setOpenedChatMessages);
  const clearChatMessages = useChatsStore((state) => state.clearChatMessages);
  const setChatMessagesBatchNo = useChatsStore((state) => state.setChatMessagesBatchNo);
  const setUserOnlineStatus = useChatsStore((state) => state.setUserOnlineStatus);
  const setMessageToBeMarketAsReaded = useChatsStore((state) => state.setMessageToBeMarketAsReaded);
  const deleteChat = useChatsStore((state) => state.deleteChat);

  // scroll view ref
  const messagesContainerRef = useRef<ScrollView>(null);

  // is fetching chat messages
  const [isFetchingChatMessages, setIsFetchingChatMessages] = useState(false);

  // opeened chat id
  const chat_id = useSearchParams().get('chat_id'); // Access the chat_id parameter

  // logedIn user
  const loggedInUser = useAuthStore((state) => state.currentUser);

  // split chat messages with dates - Memoized
  const messages = useMemo(() => {
    return groupChatMessagesByDate(chatMessages as ChatMessage[], 'ar' as never)!;
  }, [chatMessages]);

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

      // terminate if there is no messages to be market as readed
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
    if (createChatAPIres && chatMessages?.length === 0 && openedChat?.type === ChatTypes.GROUP) {
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
  }, [
    chatMessages,
    createChatAPIres,
    loggedInUser?._id,
    chat_id,
    openedChat,
    addMessageToChat,
    setMessageToBeMarketAsReaded,
  ]);

  // listen for opened chat
  useEffect(() => {
    if (!openedChat || chatMessages?.length) return;
    // if (openedChat?.type === ChatTypes.GROUP) dispatch(setChatUsrStatus(undefined));
    // get chats messages
    setOpenedChatMessages({ chatId: chat_id!, msgBatch: 1 });
  }, [openedChat, chatMessages?.length, setOpenedChatMessages]);

  // observer chat messages to scroll to the bottom
  useEffect(() => {
    // Only run when chatMessages is loaded for the first time
    if (chatMessages && chatMessagesBatchNo !== 1) return;
    // scroll to the bottom of the view
    if (messagesContainerRef.current) messagesContainerRef.current.scrollToEnd({ animated: true });
  }, [chatMessages, chatMessagesBatchNo]);

  // component un mount
  useEffect(() => {
    // set is fetching chat messages
    setIsFetchingChatMessages(true);
    // scroll to the end
    return () => {
      // log component un mount
      console.log('SingleChat unmounted');
      clearChatMessages();
      // clear usr ononline status
      setUserOnlineStatus(undefined, null);
      // reset chat messages batch no
      setChatMessagesBatchNo(1);
      // set opened chat
      setOpenedChat(undefined);

      // check for chat type individual
      if (openedChat?.type === ChatTypes.INDIVISUAL) deleteChat(chat_id!);
    };
  }, []);

  // Fix for stale closure in cleanup (though out of scope, it's good practice)
  const openedChatRef = useRef(openedChat);

  // set openedChatRef on change
  useEffect(() => {
    openedChatRef.current = openedChat;
  }, [openedChat]);

  // TODO: refactor this code
  // scroll to the bottom of the view when chatmessages change
  useEffect(() => {
    // chatMessages last item
    const lastMessage = chatMessages?.length ? chatMessages[chatMessages.length - 1] : null;
    if (lastMessage?.status === null) {
      if (messagesContainerRef.current) messagesContainerRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  const onScrollEndHandler = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;

      if (offsetY <= 0) {
        // when usr reach last oldest message
        if (isLastChatMessagesBatch) return;
        if (!isLastChatMessagesBatch) {
          // get chat messages based on page no
          setOpenedChatMessages({
            chatId: chat_id!,
            msgBatch: chatMessagesBatchNo + 1,
          });
          setChatMessagesBatchNo(chatMessagesBatchNo + 1);
        }
      }
    },
    [isLastChatMessagesBatch, chatMessagesBatchNo, chat_id, setOpenedChatMessages, setChatMessagesBatchNo]
  );

  const onBackPress = useCallback(() => {}, []);

  return (
    <View style={styles.container}>
      {/* forward messages menu */}
      {messagesToBeForwared && <ForwardMsgMenu />}

      {/* header */}
      <SingleChatHeader onBackPress={onBackPress} title='' />

      {/* messages container */}
      <ImageBackground
        source={chatBackground}
        resizeMode='repeat'
        imageStyle={styles.backgroundImage}
        style={styles.backgroundContainer}
      >
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={[
            styles.scrollContentContainer,
            { justifyContent: chatMessages?.length ? 'flex-start' : 'center' },
          ]}
          onScroll={onScrollEndHandler}
          ref={messagesContainerRef}
          scrollEventThrottle={16} // Good practice for onScroll
        >
          {/* display messages */}
          {chatMessages !== undefined && !chatMessages?.length && !isFetchingChatMessages && <NoMessages />}
          {/* messages loading */}
          {isFetchingChatMessages && <UIActivityIndicator size={20} color='gray' />}
          {/* loop messages and display them in flat list */}
          {messages !== undefined && <ChatMessagesLoader messages={messages} />}
          {/* chat actions */}
          {isChatUsrDoingAction.type !== null && <ChatActions />}
        </ScrollView>
      </ImageBackground>

      {/* bottom sheet */}
      <AttchFileBottomSheet />

      {/* messages container */}
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
    backgroundColor: '#fff',
  },
  messagesContainer: {
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
    marginBottom: 70, // to avoid overlap with the message input
  },
  // create message container
  createMessageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  backgroundImage: {
    opacity: 0.1,
  },
  backgroundContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
  },
});
