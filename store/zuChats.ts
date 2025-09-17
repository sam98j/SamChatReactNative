import { create } from 'zustand';
import { ChangeMessageStatusDTO, ChatActionsTypes, ChatCard, ChatMessage, SingleChat } from '@/interfaces/chats';
import { createChat, getChatMessages, getUsrOnlineStatus } from '@/api/chats';

export type ResponseToMessageData = Pick<
  ChatMessage,
  'sender' | 'content' | 'type' | '_id' | 'voiceNoteDuration' | 'fileName'
>;

export interface ChatActions {
  type: ChatActionsTypes | null;
  senderId: string;
  chatId: string;
  chatMembers: string[];
}
// TODO: linting
export interface ChatState {
  chats: ChatCard[] | null | undefined;
  chatMessages: ChatMessage[] | null;
  isLastChatMessagesBatch: boolean | null;
  openedChat: SingleChat | null | undefined;
  isChatUsrDoingAction: ChatActions;
  isCurrentUsrDoingAction: any;
  chatUsrStatus: string | null | undefined;
  messageToBeMarketAsReaded: null | any;
  currentChatPorfile: null | any;
  chatMessagesBatchNo: number;
  aggreUnRededMsgs: number;
  fileMessageUploadIndicator: number | null;
  addChatMembersRes: boolean | null;
  responseToMessage: any | null;
  messagesToBeForwared: any | null;
  createChatAPIres: null | boolean;

  // actions
  setOpenedChat: (chat: SingleChat | undefined) => void;
  clearChatMessages: () => void;
  addMessageToChat: (msg: ChatMessage) => void;
  setResponseToMessage: (data: ResponseToMessageData | null) => void;
  setMessageToBeMarketAsReaded: (data: ChangeMessageStatusDTO) => void;
  setCurrentUsrDoingAction: (data: ChatActions) => void;
  setChatMessagesBatchNo: (n: number) => void;
  setMessageStatus: (data: ChangeMessageStatusDTO) => void;
  placeLastUpdatedChatToTheTop: (data: { chatId: string }) => void;
  setChatLastMessage: (data: { msg: ChatMessage; currentUserId: string }) => void;
  setChatUnReadedMessagesCount: (msg: ChatMessage) => void;
  setChatUsrStatus: (status: string | null | undefined) => void;
  setChatUsrDoingAction: (data: ChatActions) => void;
  addNewChat: (chat: ChatCard) => void;
  setCurrentUserChats: (chats: ChatCard[]) => void;
  setOpenedChatMessages: (data: { chatId: string; msgBatch: number }) => Promise<void>;
  setUserOnlineStatus: (userId?: string, status?: string | null | undefined) => Promise<void>;
  setFileMessageUploadIndicator: (n: number) => void;
}

export const useChatsStore = create<ChatState>((set, get) => ({
  chats: null,
  chatMessages: [],
  isLastChatMessagesBatch: null,
  openedChat: undefined,
  isChatUsrDoingAction: {
    chatId: '',
    chatMembers: [],
    senderId: '',
    type: null,
  },
  isCurrentUsrDoingAction: {
    chatId: '',
    chatMembers: [],
    senderId: '',
    type: null,
  },
  chatUsrStatus: '',
  messageToBeMarketAsReaded: null,
  currentChatPorfile: null,
  chatMessagesBatchNo: 1,
  aggreUnRededMsgs: 0,
  fileMessageUploadIndicator: null,
  addChatMembersRes: null,
  responseToMessage: null,
  messagesToBeForwared: null,
  createChatAPIres: null,

  setOpenedChat: (chat) => set({ openedChat: chat }),
  clearChatMessages: () => set({ chatMessages: [] }),
  addMessageToChat: (msg) =>
    set((state) => {
      if (!msg) return {};
      if (state.chatMessages?.some((m) => m._id === msg._id)) return {};
      return { chatMessages: [...(state.chatMessages || []), msg] };
    }),
  setResponseToMessage: (data) => set({ responseToMessage: data }),
  setMessageToBeMarketAsReaded: (data) => set({ messageToBeMarketAsReaded: data }),
  setCurrentUsrDoingAction: (data) => set({ isCurrentUsrDoingAction: data }),
  setChatMessagesBatchNo: (n) => set({ chatMessagesBatchNo: n }),
  setMessageStatus: ({ chatId, msgStatus, msgIDs }) =>
    set((state) => {
      // update chats
      const chats = state.chats?.map((chat) =>
        chat._id === chatId ? { ...chat, lastMessage: { ...chat.lastMessage, status: msgStatus as any } } : chat
      );
      // update chatMessages
      const chatMessages = state.chatMessages?.map((msg) =>
        msgIDs.includes(msg._id) ? { ...msg, status: msgStatus as any } : msg
      );
      return { chats, chatMessages };
    }),
  placeLastUpdatedChatToTheTop: ({ chatId }) =>
    set((state) => {
      if (!state.chats) return {};
      const idx = state.chats.findIndex((chat) => chat._id === chatId);
      if (idx === -1) return {};
      const updatedChat = state.chats[idx];
      const newChats = [updatedChat, ...state.chats.slice(0, idx), ...state.chats.slice(idx + 1)];
      return { chats: newChats };
    }),
  setChatLastMessage: ({ currentUserId, msg }) =>
    set((state) => {
      if (!state.chats) return {};
      const updatedChats = state.chats.map((chat) => (chat._id === msg.receiverId ? { ...chat, lastMessage: msg } : chat));
      return { chats: updatedChats };
    }),
  setChatUnReadedMessagesCount: (msg) =>
    set((state) => {
      if (!state.chats) return {};
      const chatIndex = state.chats.findIndex((chat) => chat._id === msg.receiverId);
      if (chatIndex === -1) return {};
      const chats = [...state.chats];
      chats[chatIndex] = {
        ...chats[chatIndex],
        unReadedMsgs: (chats[chatIndex].unReadedMsgs || 0) + 1,
      };
      return { chats };
    }),
  setChatUsrStatus: (status) => set({ chatUsrStatus: status }),
  setChatUsrDoingAction: (data) => set({ isChatUsrDoingAction: data }),
  addNewChat: async (chat) => {
    set((state) => ({
      chats: [chat, ...(state.chats || [])],
    }));
    // call the api of create chat
    const res = await createChat({ chat });
    if (typeof res === 'string') return;
    set({ createChatAPIres: res });
  },
  setCurrentUserChats: (chats: ChatCard[]) =>
    set(() => {
      // sorted Chats
      const sortedChats = chats.sort((a: any, b: any) => {
        return new Date(b.lastMessage.date).getTime() - new Date(a.lastMessage.date).getTime();
      });
      return {
        chats: sortedChats,
        chatMessages: [],
      };
    }),
  setOpenedChatMessages: async (data: { chatId: string; msgBatch: number }) => {
    const { chatMessages, isLastBatch } = await getChatMessages(data);

    set({ chatMessages, isLastChatMessagesBatch: isLastBatch });
  },
  setUserOnlineStatus: async (userId?: string, status?: string | null | undefined) => {
    // check if status is passed
    if (status) return set({ chatUsrStatus: status });
    // get user online status
    const usrOnlineStatus = await getUsrOnlineStatus(userId!);
    // log
    set({ chatUsrStatus: usrOnlineStatus });
  },
  setFileMessageUploadIndicator: (n: number) => set({ fileMessageUploadIndicator: n }),
}));
