import { getChatMessages } from '@/api/chats';
import { ChangeMessageStatusDTO, ChatMessage, ChatTypes, MessageStatus, MessagesTypes } from '@/interfaces/chats';
import { useAuthStore } from '@/store/authStore';
import { useChatsStore } from '@/store/chatsStore';
import { groupChatMessagesByDate } from '@/utils/chats';

import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { v4 } from 'uuid';

export const useSingleChat = () => {
  const { chat_id } = useLocalSearchParams<{ chat_id: string }>();
  const loggedInUser = useAuthStore((state) => state.currentUser);

  // Selectors
  const chatMessages = useChatsStore((state) => state.chatMessages);
  const createChatAPIres = useChatsStore((state) => state.createChatAPIres);
  const openedChat = useChatsStore((state) => state.openedChat);
  const isChatUsrDoingAction = useChatsStore((state) => state.isChatUsrDoingAction);
  const messagesToBeForwared = useChatsStore((state) => state.messagesToBeForwared);

  // Actions
  const setOpenedChat = useChatsStore((state) => state.setOpenedChat);
  const addMessageToChat = useChatsStore((state) => state.addMessageToChat);
  const setChatMessages = useChatsStore((state) => state.setChatMessages);
  const clearChatMessages = useChatsStore((state) => state.clearChatMessages);
  const setChatUsrStatus = useChatsStore((state) => state.setChatUsrStatus);
  const setMessageToBeMarketAsReaded = useChatsStore((state) => state.setMessageToBeMarketAsReaded);
  const deleteChat = useChatsStore((state) => state.deleteChat);
  const setChatUnReadedMessagesCount = useChatsStore((state) => state.setChatUnReadedMessagesCount);

  console.log('useSingleChat render');
  const [page, setPage] = useState(1);
  const [isLastBatch, setIsLastBatch] = useState(false);
  const [isFetchingChatMessages, setIsFetchingChatMessages] = useState(false);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [inputHeight, setInputHeight] = useState(0);
  const createMessageContainerRef = useRef<View>(null);

  // keyboard show and hide listeners
  useEffect(() => {
    // measure create message container height
    createMessageContainerRef.current?.measure((x, y, width, height) => {
      setInputHeight(height / 2);
    });

    // keyboard show and hide listeners
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));

    // remove listeners on unmount
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // fetch messages
  const fetchMessages = async (pageNum: number) => {
    // checking
    if (!chat_id || isFetchingChatMessages || (pageNum > 1 && isLastBatch)) return;

    // set fetching state
    setIsFetchingChatMessages(true);
    try {
      const response = await getChatMessages({ chatId: chat_id as string, msgBatch: pageNum });

      // TODO: error need to handle
      if (typeof response === 'string') return;

      const { chatMessages: newMessages, isLastBatch: lastBatch } = response as {
        chatMessages: ChatMessage[];
        isLastBatch: boolean;
      };

      // if it's first page, set messages
      if (pageNum === 1) return setChatMessages(newMessages);

      // Append new messages to the existing ones
      // Since it's an inverted list, newer messages are at the "bottom" of the array (index 0 usually for flat lists, but here it's just a chronological list in the store)
      // The store should probably append them to the end of the array.
      setChatMessages([...newMessages]);

      setIsLastBatch(lastBatch);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    } finally {
      setIsFetchingChatMessages(false);
    }
  };

  // Memoized messages grouped by date
  const sections = useMemo(() => {
    const grouped = groupChatMessagesByDate(chatMessages as ChatMessage[], 'ar' as never);
    if (!grouped) return [];

    // Transform to SectionList format and reverse for inverted list (Newest first)
    return grouped.dates
      .map((date, index) => ({
        title: date,
        data: grouped.messages[index].slice(),
      }))
      .reverse();
  }, [chatMessages]);

  // Flattened messages for FlatList
  const flattenedMessages = useMemo(() => {
    // For inverted list:
    const result: (ChatMessage | { type: 'date'; date: string; _id: string })[] = [];

    // loop through sections and reverse each section's data
    sections.forEach((section) => {
      // reverse section messages
      section.data
        .slice()
        .reverse()
        .forEach((msg) => {
          result.push(msg);
        });
      // add section title which is the date
      result.push({ type: 'date', date: section.title, _id: `date-${section.title}` });
    });

    // return result;
    return result;
  }, [sections]);

  // Initial fetch
  useEffect(() => {
    if (chat_id && openedChat) {
      setPage(1);
      setIsLastBatch(false);
      fetchMessages(1);
    }
  }, [chat_id, !!openedChat]);

  // Handle Mark as Read and Create Chat Action
  useEffect(() => {
    if (chatMessages && chatMessages.length) {
      const messagesToBeMarkedAsRead = chatMessages
        .filter((message) => message.status !== MessageStatus.READED && message.sender._id !== loggedInUser?._id)
        .map((message) => message._id);

      const messagesSendersIDs = chatMessages
        .filter((message) => message.status !== MessageStatus.READED && message.sender._id !== loggedInUser?._id)
        .map((message) => message.sender._id);

      // if no messages to be marked as read, return
      if (!messagesToBeMarkedAsRead.length) return;

      // Only trigger update if it's not already being processed for these messages
      const changeMessageStatusData: ChangeMessageStatusDTO = {
        chatId: chat_id as string,
        msgIDs: messagesToBeMarkedAsRead,
        senderIDs: messagesSendersIDs,
        msgStatus: MessageStatus.READED,
      };
      setMessageToBeMarketAsReaded(changeMessageStatusData);
    }

    // If chat is a group chat and there are no messages, add action message
    if (createChatAPIres && chatMessages?.length === 0 && openedChat?.type === ChatTypes.GROUP) {
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

      // Add action message to chat
      addMessageToChat(actionMessage);
    }
  }, [
    chatMessages?.length, // Only re-run when length changes or specific dependencies change
    createChatAPIres,
    loggedInUser?._id,
    chat_id,
    openedChat?._id,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearChatMessages();
      setChatUsrStatus(null);
      setOpenedChat(undefined);
      if (openedChat?.type === ChatTypes.INDIVISUAL) deleteChat(chat_id!);
    };
  }, []);

  // Load more messages for infinite scroll
  const loadMoreMessages = () => {
    if (!isLastBatch && !isFetchingChatMessages) {
      fetchMessages(page + 1);
    }
  };

  return {
    chatMessages,
    sections,
    flattenedMessages,
    isFetchingChatMessages,
    isChatUsrDoingAction,
    messagesToBeForwared,
    loadMoreMessages,
    isKeyboardOpen,
    inputHeight,
    createMessageContainerRef,
  };
};
