import { getUserChats } from '@/api/chats';
import { create } from 'zustand';
import { useChatsStore } from './chatsStore';
import { loginUser, signupUser } from '@/api/auth';
import * as SecureStore from 'expo-secure-store';
import { LoggedInApiResponse, LoginDto, SignUpDto } from '@/interfaces/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { clearChatsDB, getChatsFromDB, initDatabase, saveChatsToDB } from '@/services/database';

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

  // TODO: handle 400 and 500 api responses
  // set current user
  setCurrentUser: async () => {
    // 1. Try to load from cache first for offline-first
    try {
      const cachedUser = await SecureStore.getItemAsync('user_data');
      if (cachedUser) {
        set({ currentUser: JSON.parse(cachedUser) });
      }
      
      // Initialize DB and load cached chats
      await initDatabase();
      // load cached chats
      const cachedChats = await getChatsFromDB();
      // set cached chats in zuChats
      if (cachedChats && cachedChats.length > 0) useChatsStore.getState().setCurrentUserChats(cachedChats);
    } catch (e) {
      console.error('Failed to load cached user or chats', e);
      // set api response
      set({ apiResponse: { err: true, msg: 'Failed to load cached user or chats' } });
    }

    // 2. Fetch fresh data from API
    try {
      // get user chats from api
      const resp = await getUserChats();

      if (typeof resp === 'string') {
        console.error(resp);
        return;
      }

      const { chats, loggedInUser } = resp;

      // set currentUser and cache it
      set({ currentUser: loggedInUser });
      await SecureStore.setItemAsync('user_data', JSON.stringify(loggedInUser));

      // set chats in zuChats and cache them
      useChatsStore.getState().setCurrentUserChats(chats);
      // save chats to db
      if (Array.isArray(chats)) await saveChatsToDB(chats);
    } catch (e) {set({ apiResponse: { err: true, msg: 'Failed to fetch fresh user data' } })}
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
    // Remove access token and user data from SecureStore, and clear DB
    await Promise.all([
      SecureStore.deleteItemAsync('access_token'),
      SecureStore.deleteItemAsync('user_data'),
      clearChatsDB()
    ]);
  },
}));
