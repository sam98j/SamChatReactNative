import { ChangeMessageStatusDTO, ChatMessage, ChatTypes, MessageStatus, MessagesTypes } from '@/interfaces/chats';
import { useAuthStore } from '@/store/authStore';
import { useChatsStore } from '@/store/chatsStore';
import { groupChatMessagesByDate } from '@/utils/chats';
import { useSearchParams } from 'expo-router/build/hooks';
import { useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid';

export const useSingleChat = () => {
  const chat_id = useSearchParams().get('chat_id');
  const loggedInUser = useAuthStore((state) => state.currentUser);

  // Selectors
  const chatMessages = useChatsStore((state) => state.chatMessages);
  const chatMessagesBatchNo = useChatsStore((state) => state.chatMessagesBatchNo);
  const isLastChatMessagesBatch = useChatsStore((state) => state.isLastChatMessagesBatch);
  const createChatAPIres = useChatsStore((state) => state.createChatAPIres);
  const openedChat = useChatsStore((state) => state.openedChat);
  const isChatUsrDoingAction = useChatsStore((state) => state.isChatUsrDoingAction);
  const messagesToBeForwared = useChatsStore((state) => state.messagesToBeForwared);

  // Actions
  const setOpenedChat = useChatsStore((state) => state.setOpenedChat);
  const addMessageToChat = useChatsStore((state) => state.addMessageToChat);
  const setOpenedChatMessages = useChatsStore((state) => state.setOpenedChatMessages);
  const clearChatMessages = useChatsStore((state) => state.clearChatMessages);
  const setChatMessagesBatchNo = useChatsStore((state) => state.setChatMessagesBatchNo);
  const setUserOnlineStatus = useChatsStore((state) => state.setUserOnlineStatus);
  const setMessageToBeMarketAsReaded = useChatsStore((state) => state.setMessageToBeMarketAsReaded);
  const deleteChat = useChatsStore((state) => state.deleteChat);

  const [isFetchingChatMessages, setIsFetchingChatMessages] = useState(false);

  // Memoized messages grouped by date
  // Using 'ar' as locale hardcoded in original file, keeping it for now but casting fix
  const sections = useMemo(() => {
    const grouped = groupChatMessagesByDate(chatMessages as ChatMessage[], 'ar' as never);
    if (!grouped) return [];

    // Transform to SectionList format and reverse for inverted list (Newest first)
    return grouped.dates
      .map((date, index) => ({
        title: date,
        data: grouped.messages[index].slice().reverse(), // Reverse messages to show newest at bottom (start of inverted list)
      }))
      .reverse(); // Reverse sections to show newest date section at bottom
  }, [chatMessages]);

  // Initial fetch and setup
  useEffect(() => {
    if (!openedChat || chatMessages?.length) return;
    setOpenedChatMessages({ chatId: chat_id!, msgBatch: 1 });
  }, [openedChat, chatMessages?.length, setOpenedChatMessages, chat_id]);

  // Handle Mark as Read and Create Chat Action
  useEffect(() => {
    if (chatMessages !== undefined) setIsFetchingChatMessages(false);

    if (chatMessages && chatMessages.length) {
      const messagesToBeMarkedAsRead = chatMessages
        .filter((message) => message.status !== MessageStatus.READED && message.sender._id !== loggedInUser?._id)
        .map((message) => message._id);

      const messagesSendersIDs = chatMessages
        .filter((message) => message.status !== MessageStatus.READED && message.sender._id !== loggedInUser?._id)
        .map((message) => message.sender._id);

      if (messagesToBeMarkedAsRead.length) {
        const changeMessageStatusData: ChangeMessageStatusDTO = {
          chatId: chat_id!,
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
    setIsFetchingChatMessages(true);
    return () => {
      console.log('SingleChat unmounted');
      clearChatMessages();
      setUserOnlineStatus(undefined, null);
      setChatMessagesBatchNo(1);
      setOpenedChat(undefined);
      if (openedChat?.type === ChatTypes.INDIVISUAL) deleteChat(chat_id!);
    };
  }, []);

  // Load more messages for infinite scroll
  const loadMoreMessages = () => {
    if (isLastChatMessagesBatch) return;
    setOpenedChatMessages({
      chatId: chat_id!,
      msgBatch: chatMessagesBatchNo + 1,
    });
    setChatMessagesBatchNo(chatMessagesBatchNo + 1);
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
