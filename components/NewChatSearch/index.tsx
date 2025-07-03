import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useUsersApi from './hooks';
import { UIActivityIndicator } from 'react-native-indicators';
import NewChatUserCard from '../NewChatUserCard';
import { LoggedInUserData } from '@/store/auth.slice';

// component state
type State = {
  fetchedUsers: Omit<LoggedInUserData, 'email'>[];
  loading: boolean;
};

const NewChatSearch: React.FC = () => {
  // search query state
  const [query, setQuery] = useState('');

  //   the fetchUsers hook
  const { fetchUsers } = useUsersApi();
  // Placeholder for search logic
  const [state, setState] = useState<State>({
    fetchedUsers: [],
    loading: false,
  });
  // handle user search
  const handleFormChange = async (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const query = e.nativeEvent.text;
    //
    setQuery(query);

    if (query) {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
    }
    const fetchedUsers = await fetchUsers(query);
    setState((prevState) => ({
      ...prevState,
      fetchedUsers,
      loading: false,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name='search' size={20} color='#8e8e93' style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={'Search a user by name or username'}
          placeholderTextColor='#8e8e93'
          cursorColor='dodgerblue'
          onChange={(e) => handleFormChange(e)}
          value={query}
          clearButtonMode='while-editing'
        />
        {state.loading && <UIActivityIndicator size={20} color='black' style={{ alignItems: 'flex-end' }} />}
      </View>
      {/* loop throge fetched user using flatlist */}
      {state.fetchedUsers.map((user) => (
        <NewChatUserCard key={user._id} name={user.name} avatarUrl={user.avatar} usrname={user.usrname!} _id={user._id} />
      ))}
    </View>
  );
};

export default NewChatSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
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
