import { getUserChats } from '@/api/chats';
import { create } from 'zustand';
import { useChatsStore } from './chatsStore';
import { loginUser, signupUser } from '@/api/auth';
import * as SecureStore from 'expo-secure-store';
import { LoggedInApiResponse, LoginDto, SignUpDto } from '@/interfaces/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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
  logout: () => void;
  setCurrentUser: () => void;
  loginUser: (loginDto: LoginDto) => Promise<LoggedInUserData | string>;
  signupUser: (userCred: SignUpDto) => Promise<LoggedInUserData | string>;
  googleOAuth: (loggedInUserApiRes: LoggedInApiResponse) => Promise<CurrentUser | string>;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  apiResponse: null,
  isOAuthActive: false,

  // set current user
  setCurrentUser: async () => {
    // 1. Try to load from cache first for offline-first
    try {
      const cachedUser = await SecureStore.getItemAsync('user_data');
      if (cachedUser) {
        set({ currentUser: JSON.parse(cachedUser) });
      }
    } catch (e) {
      console.error('Failed to load cached user', e);
    }

    // 2. Fetch fresh data from API
    try {
      const resp = await getUserChats();
      if (typeof resp === 'string') {
        console.error(resp);
        return;
      }

      const { chats, loggedInUser } = resp;

      // set currentUser and cache it
      set({ currentUser: loggedInUser });
      await SecureStore.setItemAsync('user_data', JSON.stringify(loggedInUser));

      // set chats in zuChats
      useChatsStore.getState().setCurrentUserChats(chats);
    } catch (e) {
      console.error('Failed to fetch fresh user data', e);
    }
  },

  // login user (use the mehod in api/auth.ts)
  loginUser: async (loginDto: LoginDto) => {
    const { access_token, loggedInUser } = await loginUser(loginDto);
    // set currentUser
    set({ currentUser: loggedInUser });
    // cache user
    await SecureStore.setItemAsync('user_data', JSON.stringify(loggedInUser));
    // set chats in zuChats
    useChatsStore.setState({ chats: [] });
    // store the user access token in the localstorage
    await SecureStore.setItemAsync('access_token', `Bearer ${access_token}`);
    return loggedInUser;
  },

  // signup user (use the mehod in api/auth.ts)
  signupUser: async (userCred: SignUpDto) => {
    const { access_token, loggedInUser } = await signupUser(userCred);
    // set currentUser
    set({ currentUser: loggedInUser });
    // cache user
    await SecureStore.setItemAsync('user_data', JSON.stringify(loggedInUser));
    // set chats in zuChats
    useChatsStore.setState({ chats: [] });
    // store the user access token in the localstorage
    await SecureStore.setItemAsync('access_token', `Bearer ${access_token}`);
    return loggedInUser;
  },

  // google OAuth
  googleOAuth: async (loggedInUserApiRes: LoggedInApiResponse) => {
    // google auth endpoint from api/auth.ts
    const { loggedInUser, access_token } = loggedInUserApiRes;
    // set currentUser
    set({ currentUser: loggedInUser });
    // cache user
    await SecureStore.setItemAsync('user_data', JSON.stringify(loggedInUser));
    // set chats in zuChats
    useChatsStore.setState({ chats: [] });
    // store the user access token in the localstorage
    await SecureStore.setItemAsync('access_token', `Bearer ${access_token}`);
    return loggedInUser;
  },

  // logout
  logout: async () => {
    // clear auth state
    set({ currentUser: null, apiResponse: null });
    // google sign out
    if (await GoogleSignin.hasPreviousSignIn()) await GoogleSignin.signOut();
    // clear chats state
    useChatsStore.setState({ chats: [] });
    // Remove access token and user data from SecureStore
    await Promise.all([SecureStore.deleteItemAsync('access_token'), SecureStore.deleteItemAsync('user_data')]);
  },
}));
