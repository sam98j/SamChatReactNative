import { createSlice } from '@reduxjs/toolkit';

// inital state
const initialState = {
  isBottomSheetOpen: false,
  isAttachFileBottomSheetOpen: false,
  isImageViewerOpen: false,
};

const systemSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    // Logout reducer
    toggleBottomSheet: (state) => {
      // Toggle the bottom sheet state
      state.isBottomSheetOpen = !state.isBottomSheetOpen;
    },
    // Logout reducer
    toggleAttachFileBottomSheet: (state) => {
      // Toggle the bottom sheet state
      state.isAttachFileBottomSheetOpen = !state.isAttachFileBottomSheetOpen;
    },
    // toggle image viewer
    toggleImageViewer: (state) => {
      state.isImageViewerOpen = !state.isImageViewerOpen;
    },
  },
});

export const { toggleBottomSheet, toggleAttachFileBottomSheet, toggleImageViewer } = systemSlice.actions;

export default systemSlice.reducer;
