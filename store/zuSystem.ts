import { create } from 'zustand';

type SystemState = {
  isBottomSheetOpen: boolean;
  isAttachFileBottomSheetOpen: boolean;
  isImageViewerOpen: boolean;
  toggleBottomSheet: () => void;
  toggleAttachFileBottomSheet: () => void;
  toggleImageViewer: () => void;
};

export const useSystemStore = create<SystemState>((set) => ({
  isBottomSheetOpen: false,
  isAttachFileBottomSheetOpen: false,
  isImageViewerOpen: false,
  toggleBottomSheet: () => set((state) => ({ isBottomSheetOpen: !state.isBottomSheetOpen })),
  toggleAttachFileBottomSheet: () => set((state) => ({ isAttachFileBottomSheetOpen: !state.isAttachFileBottomSheetOpen })),
  toggleImageViewer: () => set((state) => ({ isImageViewerOpen: !state.isImageViewerOpen })),
}));
