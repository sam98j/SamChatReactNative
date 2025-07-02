import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetch } from 'expo/fetch';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const loginUser = createAsyncThunk('loginUser', async (userCred: any, thunkAPI) => {
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
    return thunkAPI.rejectWithValue('Internal Server Error');
  }
  // if the login failed
  if (response.status >= 400) {
    return thunkAPI.rejectWithValue('Email Or Password is Not Correct!');
  }
  return (await response).json();
});
