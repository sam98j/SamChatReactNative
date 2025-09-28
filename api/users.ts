import * as SecureStore from 'expo-secure-store';
import { fetch } from 'expo/fetch';

// apiUrl .env variable
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
// access token from expo secure store

export const getUserProfile = async (profileId: string) => {
  const access_token = await SecureStore.getItemAsync('access_token');
  // call fetch
  const response = await fetch(`${apiUrl}/users/profile/${profileId}`, {
    method: 'GET',
    headers: {
      authorization: access_token!,
    },
  });

  // check for internal serval error
  if (response.status >= 500) {
    return 'Internal Server Error';
  }
  // if the login failed
  if (response.status >= 400) {
    return 'You Are Not Authente. Yet';
  }
  const resp = await response.json();
  // there is no error
  return resp;
};
