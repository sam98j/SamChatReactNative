import { getUserChats } from '@/api/chats';
import { createSlice, ThunkAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

// Login Successfly Response
export interface LoggedInUserData {
  _id: string;
  email: string;
  avatar: string;
  name: string;
  usrname?: string;
  chatId?: string;
}

// state slice shape
export interface AuthState {
  currentUser: Pick<LoggedInUserData, '_id' | 'avatar' | 'name'> | null | undefined;
  apiResponse: { err: boolean; msg: string } | null;
  isOAuthActive: boolean;
}
// inital state
const initialState: AuthState = {
  currentUser: null,
  apiResponse: null,
  isOAuthActive: false,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    // Logout reducer
    logout: (state) => {
      state.currentUser = null;
      state.apiResponse = null;
      SecureStore.deleteItemAsync('access_token'); // Remove access token from SecureStore
    },
  },
  extraReducers(builder) {
    // user loggedIn successfully
    builder.addCase('loginUser/fulfilled', (state, action: any) => {
      const { access_token, loggedInUser } = action.payload;
      // store the user access token in the localstorage
      SecureStore.setItem('access_token', `Bearer ${access_token}`);
      state.currentUser = loggedInUser;
      state.apiResponse = null;
    });

    // user has valid access token and chats fetched
    // builder.addCase(getUserChats.fulfilled, (state, action) => {
    //   const { loggedInUser } = action.payload;
    //   // log loggedInUser
    //   state.currentUser = loggedInUser; // Set the logged-in user
    // });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
