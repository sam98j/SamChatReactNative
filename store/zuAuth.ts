import { getUserChats } from '@/api/chats';
import { FetchRequestInit } from 'expo/fetch';
import { use } from 'react';
import { create } from 'zustand';
import { useChatsStore } from './zuChats';
import { ChatCard } from '@/interfaces/chats';

// Login Successfly Response
export interface LoggedInUserData {
  _id: string;
  email: string;
  avatar: string;
  name: string;
  usrname?: string;
  chatId?: string;
}

export type CurrentUser = Pick<LoggedInUserData, '_id' | 'avatar' | 'name'>;

// state slice shape
export interface AuthState {
  currentUser: CurrentUser | null | undefined;
  apiResponse: { err: boolean; msg: string } | null;
  isOAuthActive: boolean;
  setCurrentUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  apiResponse: null,
  isOAuthActive: false,
  setCurrentUser: async () => {
    const { chats, loggedInUser } = await getUserChats();
    console.log('loggedInUser', loggedInUser);
    // set currentUser
    set({ currentUser: loggedInUser });
    // set chats in zuChats
    useChatsStore.setState({ chats });
  },
}));
