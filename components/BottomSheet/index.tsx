import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import { NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputChangeEventData, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBottomSheet } from '@/store/system.slice';
import { RootState } from '@/store';
import SearchBar from 'react-native-platform-searchbar';
import Icon from 'react-native-vector-icons/Ionicons';
import { UIActivityIndicator } from 'react-native-indicators';
import { LoggedInUserData } from '@/store/auth.slice';
import useUsersApi from './hooks';
import NewChatUserCard from '../NewChatUserCard';
import { useSystemStore } from '@/store/zuSystem';

// component state
type State = {
  searchqr: string;
  fetchedUsers: Omit<LoggedInUserData, 'email'>[];
  loading: boolean;
};

const CustomBottomSheet = () => {
  // Bottom sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // componet state
  const [state, setState] = useState<State>({
    searchqr: '',
    fetchedUsers: [],
    loading: false,
  });

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['80%'], []);
  // handle user search
  const handleFormChange = async (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const query = e.nativeEvent.text;
    if (query) {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
    }
    const fetchedUsers = await fetchUsers(query);
    setState((prevState) => ({
      ...prevState,
      searchqr: query,
      fetchedUsers,
      loading: false,
    }));
  };
  // fetch users hooks
  const { fetchUsers } = useUsersApi();

  // State to track if the bottom sheet is open
  const { isBottomSheetOpen, toggleBottomSheet } = useSystemStore();

  // Handle bottom sheet index changes
  const handleSheetChanges = useCallback((index: number) => {
    // Check if the bottom sheet is closed
    if (index === -1) toggleBottomSheet();
  }, []);

  // Open the bottom sheet
  const openSheet = () => {
    // log 'run'
    bottomSheetRef.current?.snapToIndex(0); // Open to the first snap point
  };

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
        index={-1} // Start closed
        snapPoints={snapPoints}
        enablePanDownToClose={true} // Allow closing by swiping down
        onChange={handleSheetChanges} // Listen for index changes
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.searchContainer}>
            <Icon name='search' size={20} color='#8e8e93' style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder={'Search'}
              placeholderTextColor='#8e8e93'
              cursorColor='dodgerblue'
              onChange={(e) => handleFormChange(e)}
              value={state.searchqr}
              clearButtonMode='while-editing'
            />
            {state.loading && <UIActivityIndicator size={20} color='black' style={{ alignItems: 'flex-end' }} />}
          </View>
          {/* loop throge fetched user using flatlist */}
          {state.fetchedUsers.map((user) => (
            <NewChatUserCard
              key={user._id}
              name={user.name}
              avatarUrl={user.avatar}
              usrname={user.usrname!}
              _id={user._id}
            />
          ))}
          {/* Additional Content */}
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
