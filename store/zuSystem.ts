import { create } from 'zustand';

type SystemState = {
  isBottomSheetOpen: boolean;
  isAttachFileBottomSheetOpen: boolean;
  isImageViewerOpen: boolean;
  toggleBottomSheet: () => void;
  openAttachFileBottomSheet: (state: boolean) => void;
  toggleImageViewer: () => void;
};

export const useSystemStore = create<SystemState>((set) => ({
  isBottomSheetOpen: false,
  isAttachFileBottomSheetOpen: false,
  isImageViewerOpen: false,
  toggleBottomSheet: () => set((state) => ({ isBottomSheetOpen: !state.isBottomSheetOpen })),
  openAttachFileBottomSheet: (state: boolean) => set({ isAttachFileBottomSheetOpen: state }),
  toggleImageViewer: () => set((state) => ({ isImageViewerOpen: !state.isImageViewerOpen })),
}));
