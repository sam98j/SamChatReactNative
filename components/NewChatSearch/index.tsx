import React, { useState } from 'react';
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import useUsersApi from './hooks';
import { UIActivityIndicator } from 'react-native-indicators';
import NewChatUserCard from '../NewChatUserCard';
import { LoggedInUserData } from '@/store/auth.slice';
import i18n from '@/i18n';

// component state
type State = {
  fetchedUsers: Omit<LoggedInUserData, 'email'>[];
  loading: boolean;
};

const NewChatSearch: React.FC = () => {
  // pref lang
  const prefLang = i18n.locale;
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
    // get query
    const query = e.nativeEvent.text;
    // set query
    setQuery(query);

    // check if query is not empty
    if (query) {
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
    }

    // fetch users
    const fetchedUsers = await fetchUsers(query);

    // set fetched users
    setState((prevState) => ({
      ...prevState,
      fetchedUsers,
      loading: false,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, prefLang === 'ar' && styles.dirRtl]}>
        <Icon name='search' size={20} color='#8e8e93' style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder={i18n.t('chatsListScreen.create-chat-menu.search')}
          placeholderTextColor='#aaa'
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
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    fontSize: 16,
    flexGrow: 1,
    color: '#000',
    fontFamily: 'BalooBhaijaan2',
  },
  // ar dir
  dirRtl: {
    direction: 'rtl',
  },
});
