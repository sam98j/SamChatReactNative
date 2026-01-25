import { getChatMessages } from '@/api/chats';
import { ChangeMessageStatusDTO, ChatMessage, ChatTypes, MessageStatus, MessagesTypes } from '@/interfaces/chats';
import { useAuthStore } from '@/store/authStore';
import { useChatsStore } from '@/store/chatsStore';
import { groupChatMessagesByDate } from '@/utils/chats';

import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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

  console.log('useSingleChat render');
  const [page, setPage] = useState(1);
  const [isLastBatch, setIsLastBatch] = useState(false);
  const [isFetchingChatMessages, setIsFetchingChatMessages] = useState(false);

  const fetchMessages = async (pageNum: number) => {
    if (!chat_id || isFetchingChatMessages || (pageNum > 1 && isLastBatch)) return;

    setIsFetchingChatMessages(true);
    try {
      const response = await getChatMessages({ chatId: chat_id as string, msgBatch: pageNum });
      if (typeof response !== 'string') {
        const { chatMessages: newMessages, isLastBatch: lastBatch } = response as { chatMessages: ChatMessage[]; isLastBatch: boolean };
        
        if (pageNum === 1) {
          setChatMessages(newMessages);
        } else {
          // If we want to append/prepend based on store logic, we should be careful.
          // The store's setChatMessages currently replaces the messages.
          // Let's check how setChatMessages is implemented in chatsStore.
          // Based on the hook's previous behavior:
          // const allMessages = data.pages.flatMap((page) => page.chatMessages);
          // setChatMessages(allMessages);
          // This implies the hook was responsible for aggregating all pages.
          setChatMessages(newMessages);
        }
        
        setIsLastBatch(lastBatch);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    } finally {
      setIsFetchingChatMessages(false);
    }
  };

  // Memoized messages grouped by date
  // Using 'ar' as locale hardcoded in original file, keeping it for now but casting fix
  const sections = useMemo(() => {
    const grouped = groupChatMessagesByDate(chatMessages as ChatMessage[], 'ar' as never);
    if (!grouped) return [];

    // Reverse the order of dates and messages for inverted list
    // newest date will be at index 0, and newest message in that date at index 0
    const reversedDates = [...grouped.dates].reverse();
    const reversedMessages = [...grouped.messages].reverse().map(msgs => [...msgs].reverse());

    return reversedDates.map((date, index) => ({
      title: date,
      data: reversedMessages[index],
    }));
  }, [chatMessages]);

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

      if (messagesToBeMarkedAsRead.length) {
        const changeMessageStatusData: ChangeMessageStatusDTO = {
          chatId: chat_id as string,
          msgIDs: messagesToBeMarkedAsRead,
          senderIDs: messagesSendersIDs,
          msgStatus: MessageStatus.READED,
        };
        setMessageToBeMarketAsReaded(changeMessageStatusData);
      }
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
    chatMessages,
    createChatAPIres,
    loggedInUser?._id,
    chat_id,
    openedChat,
    addMessageToChat,
    setMessageToBeMarketAsReaded,
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
    isFetchingChatMessages,
    isChatUsrDoingAction,
    messagesToBeForwared,
    loadMoreMessages,
  };
};
