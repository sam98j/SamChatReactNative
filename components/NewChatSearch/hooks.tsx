import { fetch } from 'expo/fetch';
import * as SecureStore from 'expo-secure-store';

const useUsersApi = () => {
  const fetchUsers = async (searchqr: string) => {
    // expo env var
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    // access token from secure store
    const access_token = await SecureStore.getItemAsync('access_token');

    const apiRes = await fetch(`${apiUrl}/users/${searchqr}`, {
      method: 'GET',
      headers: { authorization: access_token! },
    });
    // check for server err
    if (apiRes.status >= 500 || apiRes.status >= 400) {
      return [];
    }
    return await apiRes.json();
  };
  return { fetchUsers };
};

export default useUsersApi;
