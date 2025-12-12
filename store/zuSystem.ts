import { create } from 'zustand';

type SystemState = {
  isBottomSheetOpen: boolean;
  isAttachFileBottomSheetOpen: boolean;
  isImageViewerOpen: boolean;
  toggleBottomSheet: () => void;
  openAttachFileBottomSheet: (state: boolean) => void;
  toggleImageViewer: () => void;
  onboarding: {
    screensPaths: [
      '/',
      '/privacy',
      '/secure_messaging',
      '/fast_and_reliable',
      '/vidoe_voice_calls',
      '/share_media_and_files'
    ];
    currentScreen: number;
    setCurrentScreen: (n: number) => void;
  };
};

export const useSystemStore = create<SystemState>((set, get) => ({
  isBottomSheetOpen: false,
  isAttachFileBottomSheetOpen: false,
  isImageViewerOpen: false,
  onboarding: {
    screensPaths: [
      '/',
      '/privacy',
      '/secure_messaging',
      '/fast_and_reliable',
      '/vidoe_voice_calls',
      '/share_media_and_files',
    ],
    currentScreen: 0,
    setCurrentScreen: (n) => {
      // get onboarding
      const onboarding = get().onboarding;
      set({ onboarding: { ...onboarding, currentScreen: n } });
    },
  },
  toggleBottomSheet: () => set((state) => ({ isBottomSheetOpen: !state.isBottomSheetOpen })),
  openAttachFileBottomSheet: (state: boolean) => set({ isAttachFileBottomSheetOpen: state }),
  toggleImageViewer: () => set((state) => ({ isImageViewerOpen: !state.isImageViewerOpen })),
}));
