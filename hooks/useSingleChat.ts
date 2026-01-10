import { getChatMessages } from '@/api/chats';
import { ChangeMessageStatusDTO, ChatMessage, ChatTypes, MessageStatus, MessagesTypes } from '@/interfaces/chats';
import { useAuthStore } from '@/store/authStore';
import { useChatsStore } from '@/store/chatsStore';
import { groupChatMessagesByDate } from '@/utils/chats';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'expo-router/build/hooks';
import { useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid';

export const useSingleChat = () => {
  const chat_id = useSearchParams().get('chat_id');
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
  const setUserOnlineStatus = useChatsStore((state) => state.setUserOnlineStatus);
  const setMessageToBeMarketAsReaded = useChatsStore((state) => state.setMessageToBeMarketAsReaded);
  const deleteChat = useChatsStore((state) => state.deleteChat);

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['chatMessages', chat_id],
    queryFn: ({ pageParam = 1 }) => getChatMessages({ chatId: chat_id as string, msgBatch: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.isLastBatch ? undefined : allPages.length + 1;
    },
    initialPageParam: 1,
    enabled: !!chat_id && !!openedChat,
  });

  // Sync React Query data to Zustand store
  useEffect(() => {
    if (data?.pages) {
      const allMessages = data.pages.flatMap((page) => page.chatMessages);
      setChatMessages(allMessages);
    }
  }, [data?.pages, setChatMessages]);

  const [isFetchingChatMessages, setIsFetchingChatMessages] = useState(false);

  // Sync fetching state (optional, if UI depends on it)
  useEffect(() => {
    setIsFetchingChatMessages(isFetching);
  }, [isFetching]);

  // Memoized messages grouped by date
  // Using 'ar' as locale hardcoded in original file, keeping it for now but casting fix
  const sections = useMemo(() => {
    const grouped = groupChatMessagesByDate(chatMessages as ChatMessage[], 'ar' as never);
    if (!grouped) return [];

    // Transform to SectionList format and reverse for inverted list (Newest first)
    return grouped.dates
      .map((date, index) => ({
        title: date,
        data: grouped.messages[index].slice(), // Reverse messages to show newest at bottom (start of inverted list)
      }))
      // .reverse(); // Reverse sections to show newest date section at bottom
  }, [chatMessages]);

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
      console.log('SingleChat unmounted');
      clearChatMessages();
      setUserOnlineStatus(undefined, null);
      setOpenedChat(undefined);
      if (openedChat?.type === ChatTypes.INDIVISUAL) deleteChat(chat_id as string);
    };
  }, []);

  // Load more messages for infinite scroll
  const loadMoreMessages = () => {
    if (hasNextPage) {
      fetchNextPage();
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
