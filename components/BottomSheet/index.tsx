import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useSystemStore } from '@/store/zuSystem';
import NewChatSearch from '../NewChatSearch';

const CustomBottomSheet = () => {
  // Bottom sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['80%'], []);
  // State to track if the bottom sheet is open
  const { isBottomSheetOpen, toggleBottomSheet } = useSystemStore();

  // Handle bottom sheet index changes
  const handleSheetChanges = useCallback((index: number) => index === -1 && toggleBottomSheet(), []);

  // Open the bottom sheet
  const openSheet = () => bottomSheetRef.current?.snapToIndex(0); // Open to the first snap point

  // observe if the bottom sheet is open
  useEffect(
    useCallback(() => {
      if (isBottomSheetOpen) openSheet();
    }, [isBottomSheetOpen])
  );

  return (
    <View style={styles.container}>
      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        handleIndicatorStyle={{ backgroundColor: '#ddd' }}
        index={-1} // Start closed
        snapPoints={snapPoints}
        enablePanDownToClose={true} // Allow closing by swiping down
        onChange={handleSheetChanges} // Listen for index changes
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.contentContainer}>
          <NewChatSearch />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default CustomBottomSheet;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    marginLeft: 7,
    marginRight: 7,
  },
  bottomSheetBackground: {
    backgroundColor: '#eee',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    // Box shadow properties
    // iOS specific shadow properties
    borderColor: '#ddd',
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 13,
  },

  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    fontSize: 16,
    flexGrow: 1,
    color: '#000',
  },
});
