import { ImagePickerAsset } from 'expo-image-picker';

export interface SignUpDto {
  email: string;
  password: string;
  avatar: Blob | null;
  name: string;
  usrname: string;
}
