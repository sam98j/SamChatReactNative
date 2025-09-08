import { CurrentUser } from '@/store/zuAuth';

export interface SignUpDto {
  email: string;
  password: string;
  avatar: Blob | null;
  name: string;
  usrname: string;
}

// LoginDto
export interface LoginDto {
  email: string;
  password: string;
}

// Login Successfly Response
export interface LoggedInApiResponse {
  access_token: string;
  loggedInUser: CurrentUser;
}
