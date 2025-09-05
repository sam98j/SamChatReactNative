import { SignUpDto } from '@/interfaces/auth';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetch } from 'expo/fetch';
import * as FileSystem from 'expo-file-system';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const loginUser = async (userCred: any) => {
  // fetch request
  const response = await fetch(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/json',
    },
    body: JSON.stringify(userCred),
  });

  // check for internal serval error
  if (response.status >= 500) {
    return 'Internal Server Error';
  }
  // if the login failed
  if (response.status >= 400) {
    return 'Email Or Password is Not Correct!';
  }
  return (await response).json();
};

// sgin up user
export const signupUser = async (user: SignUpDto) => {
  // fetch request
  const formData = new FormData();
  formData.append('email', user.email);
  formData.append('name', user.name);
  formData.append('password', user.password);
  formData.append('usrname', user.usrname);
  formData.append('avatar', '');

  formData.append('profile_img', user.avatar!);
  const response = await fetch(`${apiUrl}/auth/signup`, {
    method: 'POST',
    body: formData,
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
  });

  // check for internal serval error
  if (response.status >= 500) {
    return 'Internal Server Error';
  }
  // if the login failed
  if (response.status >= 400) {
    return 'Email Or Password is Not Correct!';
  }
  return (await response).json();
};
