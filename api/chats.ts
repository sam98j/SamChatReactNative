import { fetch, FetchRequestInit } from 'expo/fetch';
import * as SecureStore from 'expo-secure-store';
import { SingleChat } from '@/interfaces/chats';

// api url
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// get user chats
export const getUserChats = async () => {
  const access_token = await SecureStore.getItemAsync('access_token');
  // request parmas
  const requestInit = {
    method: 'GET',
    headers: { authorization: access_token },
  } as FetchRequestInit;
  // fetch request
  const response = await fetch(`${apiUrl}/chats`, requestInit);
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

// get usr online status
export const getUsrOnlineStatus = async (usrId: string) => {
  // access token
  const access_token = await SecureStore.getItemAsync('access_token');
  // get request
  const response = await fetch(`${apiUrl}/users/get_online_status/${usrId}`, {
    method: 'GET',
    headers: { authorization: access_token! },
  });
  // check for internal serval error
  if (response.status >= 500) {
    return 'Internal Server Error';
  }
  // if the clinet err
  if (response.status >= 400) {
    return 'You Are Not Authente. Yet';
  }
  const resp = (await response.text()) as string;

  // there is no error
  return resp;
};

// get chat's messages with specific usr
export const getChatMessages = async (data: { chatId: string; msgBatch: number }) => {
  // access token
  const { chatId, msgBatch } = data;
  // access token
  const access_token = await SecureStore.getItemAsync('access_token');
  // req
  const response = await fetch(`${apiUrl}/messages/getchatmessages/${chatId}?msgs_batch=${msgBatch}`, {
    method: 'GET',
    headers: {
      authorization: access_token,
    },
  } as FetchRequestInit);
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

// create chat
export const createChat = async (chatData: { chat: SingleChat; avatar?: File }) => {
  // access token
  const access_token = await SecureStore.getItemAsync('access_token');
  // // formData
  const formData = new FormData();
  // // append chat
  formData.append('chat', JSON.stringify(chatData.chat));
  formData.append('avatar', chatData.avatar!);
  // // get request
  const response = await fetch(`${apiUrl}/chats/create_chat`, {
    method: 'POST',
    headers: { authorization: access_token! },
    body: formData,
  });

  // // check for internal serval error
  if (response.status >= 500) {
    return 'Internal Server Error';
  }
  // // if the clinet err
  if (response.status >= 400) {
    return 'You Are Not Authente. Yet';
  }
  const resp = (await response.json()) as boolean;
  // // there is no error
  return resp;
};

// delete chat
export const deleteChat = async (_id: string) => {
  // access token
  const access_token = await SecureStore.getItemAsync('access_token');

  // get request
  const response = await fetch(`${apiUrl}/chats/${_id}`, {
    method: 'DELETE',
    headers: { authorization: access_token! },
  });

  // check for internal serval error
  if (response.status >= 500) {
    return 'Internal Server Error';
  }
  // if the clinet err
  if (response.status >= 400) {
    return 'You Are Not Authente. Yet, you cant delete the chat';
  }
  const resp = await response.json();

  // there is no error
  return resp;
};
