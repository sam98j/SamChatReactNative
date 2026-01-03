// boilerplate code for Zustand store managing users
import { getUserProfile } from '@/api/users';
import { create } from 'zustand';

interface UserProfile {
  _id: string;
  avatar: string;
  email: string;
  name: string;
  usrname: string;
}

// Define the shape of the user state
interface UserState {
  currentUserProfile: UserProfile | null;
  getUserProfile: (profileId: string) => Promise<UserProfile | string>;
}

// Create the Zustand store for users
export const useUsersStore = create<UserState>((set) => ({
  currentUserProfile: null,
  getUserProfile: async (profileId: string) => {
    const userProfile = await getUserProfile(profileId);
    set({ currentUserProfile: userProfile });
    return userProfile;
  },
}));
