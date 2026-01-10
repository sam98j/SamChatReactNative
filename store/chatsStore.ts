import { create } from 'zustand';
import {
  ChangeMessageStatusDTO,
  ChatActionsTypes,
  ChatCard,
  ChatMessage,
  ChatProfile,
  MessagesToBeForwarded,
  SingleChat,
} from '@/interfaces/chats';
import { createChat, deleteChat, getChatMessages, getUsrOnlineStatus } from '@/api/chats';

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

export interface ChatState {
  chats: ChatCard[] | null | undefined;
  chatMessages: ChatMessage[] | null;
  isLastChatMessagesBatch: boolean | null;
  openedChat: SingleChat | null | undefined;
  isChatUsrDoingAction: ChatActions;
  isCurrentUsrDoingAction: ChatActions;
  chatUsrStatus: string | null | undefined;
  messageToBeMarketAsReaded: null | ChangeMessageStatusDTO;
  currentChatPorfile: null | ChatProfile;
  chatMessagesBatchNo: number;
  aggreUnRededMsgs: number;
  fileMessageUploadIndicator: number | null;
  addChatMembersRes: boolean | null;
  responseToMessage: ResponseToMessageData | null;
  messagesToBeForwared: MessagesToBeForwarded | null;
  createChatAPIres: null | boolean;
  msgsActionsMenu: string[] | null;

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
  setChatUnReadedMessagesCount: (chatId: string, clear: boolean) => void;
  setChatUsrStatus: (status: string | null | undefined) => void;
  setChatUsrDoingAction: (data: ChatActions) => void;
  addNewChat: (chat: ChatCard) => void;
  setCurrentUserChats: (chats: ChatCard[]) => void;
  setOpenedChatMessages: (data: { chatId: string; msgBatch: number }) => Promise<void>;
  setUserOnlineStatus: (userId?: string, status?: string | null | undefined) => Promise<void>;
  setFileMessageUploadIndicator: (n: number) => void;
  deleteChat: (_id: string) => void;
  setMsgsActionsMenu: (msgId: string | null) => void;
  setMessagesToBeForwared: (msgsToBeForwarded: MessagesToBeForwarded | null) => void;
  setChatMessages: (msgs: ChatMessage[]) => void;
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
  msgsActionsMenu: null,

  // method to set the opened chat
  setOpenedChat: (chat) => set({ openedChat: chat }),

  // method to clear the chat messages
  clearChatMessages: () => set({ chatMessages: [] }),

  // method to add a message to the chat
  addMessageToChat: (msg) => {
    if (!msg) return {};
    // chat messages
    const chatMessages = get().chatMessages;
    // check if the message is already in the chat messages
    if (chatMessages?.some((m) => m._id === msg._id)) return {};
    // set chat messages
    set({ chatMessages: [...chatMessages!, msg] });
  },

  // method to set the response to message
  setResponseToMessage: (data) => set({ responseToMessage: data }),

  // method to set the message to be market as readed
  setMessageToBeMarketAsReaded: (data) => set({ messageToBeMarketAsReaded: data }),

  // method to set the current user doing action
  setCurrentUsrDoingAction: (data) => set({ isCurrentUsrDoingAction: data }),

  // method to set the chat messages batch no
  setChatMessagesBatchNo: (n) => set({ chatMessagesBatchNo: n }),

  // method to set the message status
  setMessageStatus: ({ chatId, msgStatus, msgIDs }) => {
    const { chats, chatMessages } = get();
    // update chats
    const updatedChats = chats?.map((chat) =>
      chat._id === chatId ? { ...chat, lastMessage: { ...chat.lastMessage, status: msgStatus } } : chat
    );
    // update chatMessages
    const updatedChatMessages = chatMessages?.map((msg) => (msgIDs.includes(msg._id) ? { ...msg, status: msgStatus } : msg));
    // set chats
    set({ chats: updatedChats, chatMessages: updatedChatMessages });
  },

  // method to place the last updated chat to the top
  placeLastUpdatedChatToTheTop: ({ chatId }) => {
    const { chats } = get();
    // get chats
    const idx = chats!.findIndex((chat) => chat._id === chatId);
    const updatedChat = chats![idx];
    const newChats = [updatedChat, ...chats!.slice(0, idx), ...chats!.slice(idx + 1)];
    set({ chats: newChats });
    return { chats: newChats };
    // }),
  },

  // method to set the last message of the chat
  setChatLastMessage: ({ msg }) => {
    // get chats
    const chats = get().chats;
    if (!chats) return {};
    const updatedChats = chats.map((chat) => (chat._id === msg.receiverId ? { ...chat, lastMessage: msg } : chat));
    set({ chats: updatedChats });
  },

  // method to set the unreaded messages count of the chat
  setChatUnReadedMessagesCount: (chatId, clear) => {
    // get chats
    const chats = get().chats;
    if (!chats) return {};
    const chatIndex = chats.findIndex((chat) => chat._id === chatId);
    if (chatIndex === -1) return {};

    chats[chatIndex] = {
      ...chats[chatIndex],
      unReadedMsgs: clear ? 0 : (chats[chatIndex].unReadedMsgs || 0) + 1,
    };
    set({ chats });
  },

  // method to set the chat user status
  setChatUsrStatus: (status) => set({ chatUsrStatus: status }),

  // method to set the chat user doing action
  setChatUsrDoingAction: (data) => set({ isChatUsrDoingAction: data }),

  // method to add a new chat
  addNewChat: async (chat) => {
    // get chats
    const chats = get().chats;
    // call the api of create chat
    const res = await createChat({ chat });
    if (typeof res === 'string') return;
    set({ createChatAPIres: res, chats: [chat, ...chats!] });
  },

  // method to set the current user chats
  setCurrentUserChats: (chats: ChatCard[]) => {
    // sorted Chats
    const sortedChats = chats.sort((a, b) => {
      return new Date(b.lastMessage.date).getTime() - new Date(a.lastMessage.date).getTime();
    });

    set({ chats: sortedChats, chatMessages: [] });
  },

  // method to set the opened chat messages
  setOpenedChatMessages: async (data: { chatId: string; msgBatch: number }) => {
    // TODO: handle error
    const { chatMessages, isLastBatch } = await getChatMessages(data);
    set({ chatMessages, isLastChatMessagesBatch: isLastBatch });
  },

  // method to set the user online status
  setUserOnlineStatus: async (userId?: string, status?: string | null | undefined) => {
    // check if status is passed
    if (status) return set({ chatUsrStatus: status });
    // get user online status
    const usrOnlineStatus = await getUsrOnlineStatus(userId!);
    // log
    set({ chatUsrStatus: usrOnlineStatus });
  },

  // forwardMsgMenu
  setMessagesToBeForwared: (msgsToBeForwarded) => {
    set({ messagesToBeForwared: msgsToBeForwarded });
  },

  // method to set the file message upload indicator
  setFileMessageUploadIndicator: (n: number) => set({ fileMessageUploadIndicator: n }),

  // delete chat
  deleteChat: async (_id: string) => {
    // delete chat
    const res = await deleteChat(_id);

    if (typeof res === 'string') return;
    // get chats
    const chats = get().chats;
    if (!chats) return;
    // remove chat from chats
    const updatedChats = chats.filter((chat) => chat._id !== _id);
    set({ chats: updatedChats });
  },

  // open close msg actions menu
  setMsgsActionsMenu: (msgId) => set({ msgsActionsMenu: msgId ? [msgId] : null }),

  // method to set chat messages directly
  setChatMessages: (msgs) => set({ chatMessages: msgs }),
}));
