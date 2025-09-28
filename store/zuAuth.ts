import { getUserChats } from '@/api/chats';
import { create } from 'zustand';
import { useChatsStore } from './zuChats';
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
    const { chats, loggedInUser } = await getUserChats();

    // set currentUser
    set({ currentUser: loggedInUser });

    // set chats in zuChats
    useChatsStore.getState().setCurrentUserChats(chats);
  },

  // login user (use the mehod in api/auth.ts)
  loginUser: async (loginDto: LoginDto) => {
    const { access_token, loggedInUser } = await loginUser(loginDto);
    // set currentUser
    set({ currentUser: loggedInUser });
    // set chats in zuChats
    useChatsStore.setState({ chats: [] });
    // store the user access token in the localstorage
    SecureStore.setItem('access_token', `Bearer ${access_token}`);
    return loggedInUser;
  },

  // signup user (use the mehod in api/auth.ts)
  signupUser: async (userCred: SignUpDto) => {
    const { access_token, loggedInUser } = await signupUser(userCred);
    // set currentUser
    set({ currentUser: loggedInUser });
    // set chats in zuChats
    useChatsStore.setState({ chats: [] });
    // store the user access token in the localstorage
    SecureStore.setItem('access_token', `Bearer ${access_token}`);
    return loggedInUser;
  },

  // google OAuth
  googleOAuth: async (loggedInUserApiRes: LoggedInApiResponse) => {
    // google auth endpoint from api/auth.ts
    const { loggedInUser, access_token } = loggedInUserApiRes;
    // set currentUser
    set({ currentUser: loggedInUser });
    // set chats in zuChats
    useChatsStore.setState({ chats: [] });
    // store the user access token in the localstorage
    SecureStore.setItem('access_token', `Bearer ${access_token}`);
    return loggedInUser;
  },

  // logout
  logout: () => {
    // clear auth state
    set({ currentUser: null, apiResponse: null });
    // google sign out
    if (GoogleSignin.hasPreviousSignIn()) GoogleSignin.signOut();
    // clear chats state
    useChatsStore.setState({ chats: [] });
    // Remove access token from SecureStore
    SecureStore.deleteItemAsync('access_token');
  },
}));
