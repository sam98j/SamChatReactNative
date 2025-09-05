import { getUserChats } from '@/api/chats';
import { FetchRequestInit } from 'expo/fetch';
import { use } from 'react';
import { create } from 'zustand';
import { useChatsStore } from './zuChats';
import { ChatCard } from '@/interfaces/chats';
import { loginUser, signupUser } from '@/api/auth';
import * as SecureStore from 'expo-secure-store';
import { SignUpDto } from '@/interfaces/auth';

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
  loginUser: (userCred: any) => Promise<LoggedInUserData | string>;
  signupUser: (userCred: SignUpDto) => Promise<LoggedInUserData | string>;
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
  // login user (use the mehod in api/auth.ts)
  loginUser: async (userCred: any) => {
    const { access_token, loggedInUser } = await loginUser(userCred);
    // set currentUser
    set({ currentUser: loggedInUser });
    // set chats in zuChats
    useChatsStore.setState({ chats: [] });
    // store the user access token in the localstorage
    SecureStore.setItem('access_token', `Bearer ${access_token}`);
    return loggedInUser;
  },
  // signup user (use the mehod in api/auth.ts)
  signupUser: async (userCred: any) => {
    const { access_token, loggedInUser } = await signupUser(userCred);
    // set currentUser
    set({ currentUser: loggedInUser });
    // set chats in zuChats
    useChatsStore.setState({ chats: [] });
    // store the user access token in the localstorage
    SecureStore.setItem('access_token', `Bearer ${access_token}`);
    return loggedInUser;
  },
}));
