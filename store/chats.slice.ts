import { createChat, getChatMessages, getUserChats, getUsrOnlineStatus } from '@/api/chats';
import { ChangeMessageStatusDTO, ChatActionsTypes, ChatCard, ChatMessage, SingleChat } from '@/interfaces/chats';
import { createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

// responseToMessageData
export type ResponseToMessageData = Pick<
  ChatMessage,
  'sender' | 'content' | 'type' | '_id' | 'voiceNoteDuration' | 'fileName'
>;

// state slice shape
export interface ChatState {
  chats: ChatCard[] | null | undefined;
  chatMessages: ChatMessage[] | null;
  isLastChatMessagesBatch: boolean | null;
  openedChat: SingleChat | null | undefined;
  isChatUsrDoingAction: any;
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
}

// inital state
const initialState: ChatState = {
  fileMessageUploadIndicator: null,
  messagesToBeForwared: null,
  createChatAPIres: null,
  isLastChatMessagesBatch: null,
  addChatMembersRes: null,
  responseToMessage: null,
  chats: null,
  chatMessages: [],
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
};

// chatActionsDTO
export interface ChatActions {
  type: ChatActionsTypes | null;
  senderId: string;
  chatId: string;
  chatMembers: string[];
}

const chatsSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    // Reducer to set the currently opened chat
    setOpenedChat(state, action: PayloadAction<SingleChat | undefined>) {
      state.openedChat = action.payload; // Update the openedChat property with the provided chat details
    },
    // clear chat messages
    clearChatMessages: (state) => {
      state.chatMessages = [];
    },
    // add Message To Chat
    addMessageToChat: (state, action: PayloadAction<ChatMessage>) => {
      // terminate if no message
      if (!action.payload) return;
      // check if message is already in chat
      const msgToRender = state.chatMessages?.filter((msg) => msg._id === action.payload?._id)[0];
      // terminate if msg exist
      if (msgToRender) return;
      // push message to chat
      state.chatMessages?.push(action.payload);
    },
    // set response to message
    setResponseToMessage(state, action: PayloadAction<ResponseToMessageData | null>) {
      state.responseToMessage = action.payload;
    },
    // messageToBeMarketAsReaded
    setMessageToBeMarketAsReaded(state, action: PayloadAction<ChangeMessageStatusDTO>) {
      state.messageToBeMarketAsReaded = action.payload;
    },
    // set current usr typing state
    setCurrentUsrDoingAction(state, action: PayloadAction<ChatActions>) {
      state.isCurrentUsrDoingAction = action.payload;
    },
    // set chat messages batch no
    setChatMessagesBatchNo: (state, action: PayloadAction<number>) => {
      state.chatMessagesBatchNo = action.payload;
    },
    // change message status
    setMessageStatus: (state, action: PayloadAction<ChangeMessageStatusDTO>) => {
      // change message's status in chatCard's lastMessage
      const updateChats = state.chats?.map((chat) => {
        if (chat._id === action.payload.chatId) {
          return {
            ...chat,
            lastMessage: {
              ...chat.lastMessage,
              status: action.payload.msgStatus,
            },
          };
        }
        return chat;
      });
      // set chats
      state.chats = updateChats;
      // break if no opened chat
      if (!state.openedChat) return;
      // get index of the message
      if (!state.chatMessages) return;
      // change messages status
      action.payload.msgIDs.map((msgId) => {
        const msgIndex = state.chatMessages?.findIndex((msg) => msg._id === msgId);
        state.chatMessages![msgIndex!].status = action.payload.msgStatus;
      });
    },
    // place last update chat to the top
    placeLastUpdatedChatToTheTop(state, action: PayloadAction<{ chatId: string }>) {
      // get updated chat id
      state.chats?.find((chat, index) => {
        if (chat._id === action.payload.chatId) {
          const chatsFirstPart = state.chats?.slice(0, index);
          const chatsSecondPart = state.chats?.slice(index + 1);
          const updatedChat = state.chats?.slice(index, index + 1);
          state.chats = Array.prototype.concat(updatedChat, chatsFirstPart, chatsSecondPart);
        }
      });
    },
    // setChatLastMessage
    setChatLastMessage: (state, action: PayloadAction<{ msg: ChatMessage; currentUserId: string }>) => {
      // new message
      const lastMessage = action.payload.msg;
      // updatedChat
      const updatedChats = state.chats!.map((chat) => {
        if (chat._id === lastMessage.receiverId) {
          return { ...chat, lastMessage };
        }
        return chat;
      });
      // terminate if no chats
      state.chats = updatedChats;
    },
    // setChatUnReadedMessagesCount
    setChatUnReadedMessagesCount: (state, action: PayloadAction<{ msg: ChatMessage }>) => {
      // find update chat's index
      const chatIndex = state.chats?.findIndex((chat) => chat._id === action.payload.msg.receiverId);
      // old chat's unreaded messages
      const oldChatUnReadedMessaegs = state.chats![chatIndex!].unReadedMsgs;
      state.chats![chatIndex!].unReadedMsgs = oldChatUnReadedMessaegs + 1;
    },
    // set chat usr status
    setChatUsrStatus: (state, action: PayloadAction<string | null | undefined>) => {
      state.chatUsrStatus = action.payload;
    },
    // change chat user typing state
    setChatUsrDoingAction: (state, action: PayloadAction<ChatActions>) => {
      state.isChatUsrDoingAction = action.payload;
    },
    // add new chat to the chats
    addNewChat(state, action: PayloadAction<ChatCard>) {
      state.chats = [action.payload, ...state.chats!];
    },
  },
  extraReducers(builder) {
    // builder.addCase(getUserChats.fulfilled, (state, action) => {
    //   const chats = action.payload.chats;
    //   console.log('from chats slice', chats);
    //   // sorted Chats
    //   const sortedChats = chats.sort((a: any, b: any) => {
    //     return new Date(b.lastMessage.date).getTime() - new Date(a.lastMessage.date).getTime();
    //   });
    //   // cached chats is null
    //   state.chats = sortedChats;
    //   state.chatMessages = [];
    // });
    // builder.addCase(getChatMessages.fulfilled, (state, action) => {
    //   const { chatMessages, isLastBatch } = action.payload;
    //   state.isLastChatMessagesBatch = isLastBatch;
    //   state.chatMessages = chatMessages;
    // });
    // builder.addCase(getChatMessages.pending, (state) => {
    //   state.chatMessages = null;
    // });
    // set usr online status
    // builder.addCase(getUsrOnlineStatus.fulfilled, (state, action: PayloadAction<string>) => {
    //   state.chatUsrStatus = action.payload;
    // });
    // create chat group
    // builder.addCase(createChat.fulfilled, (state, action) => {
    //   const res = action.payload;
    //   state.createChatAPIres = res;
    //   console.log(res);
    // });
  },
});

export const {
  setChatUsrStatus,
  setOpenedChat,
  setMessageStatus,
  clearChatMessages,
  addMessageToChat,
  setResponseToMessage,
  setChatMessagesBatchNo,
  setMessageToBeMarketAsReaded,
  placeLastUpdatedChatToTheTop,
  setChatUnReadedMessagesCount,
  setChatLastMessage,
  setChatUsrDoingAction,
  addNewChat,
  setCurrentUsrDoingAction,
} = chatsSlice.actions;

export default chatsSlice.reducer;
