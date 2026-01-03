import ChatCardContainer from '@/components/ChatCard';
import { View, StyleSheet, FlatList } from 'react-native';
import { SearchBar } from '@rneui/themed';
import CustomBottomSheet from '@/components/BottomSheet';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useChatsStore } from '@/store/chatsStore';
import NoChatsVector from '@/components/NoChatsVector';
import i18n from '@/i18n';
import { useEffect, useState } from 'react';
import { ChatCard } from '@/interfaces/chats';
import { useAuthStore } from '@/store/authStore';

export default function Chats() {
  // get chats from zustand zuChats
  const { chats } = useChatsStore();

  // current user
  const { currentUser } = useAuthStore();

  // filtered chats state
  const [filteredChats, setFilteredChats] = useState<ChatCard[] | null>(() => chats!);

  // get lang from i18n
  const lang = i18n.locale; // replace with actual i18n language detection

  // searrch query
  const [searchQuery, setSearchQuery] = useState('');

  // observe chats and update filtered chats
  useEffect(() => {
    // terminate if there is no chats
    if (!chats) return;

    // filter chats
    const filteredChats = chats.filter((chat) => {
      // get chat name
      const chatName = chat.name || chat.members.filter((member) => member._id !== currentUser!._id)[0].name;
      return chatName.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // set filtered chats
    setFilteredChats(filteredChats);
  }, [chats, searchQuery]);

  // handle search
  const handleSearch = (text: string) => setSearchQuery(text);
  // log chat
  return (
    <View style={styles.container}>
      {/* search bar */}
      <SearchBar
        placeholder={`${i18n.t('chatsListScreen.search-bar-placeholder')}`}
        onChangeText={handleSearch}
        value={searchQuery}
        textAlign={`${lang === 'ar' ? 'right' : 'left'}`}
        containerStyle={styles.searchInputContainerStyle}
        cursorColor={'dodgerblue'}
        inputContainerStyle={{ backgroundColor: '#eee' }}
        inputStyle={{ backgroundColor: '#eee', fontFamily: 'BalooBhaijaan2' }}
        searchIcon={<FeatherIcon name='search' size={20} color='gray' />}
        clearIcon={{ color: 'gray' }}
        platform='default'
        round
      />

      {/* chats list */}
      <View style={{ marginTop: 10 }}>
        {chats?.length === 0 && <NoChatsVector />}
        {/*  */}
        <FlatList
          data={filteredChats}
          extraData={filteredChats} // <-- This tells FlatList to rerender when chats changes
          keyExtractor={(item) => item._id} // Make sure each chat has a unique _id
          contentContainerStyle={styles.chatsConainerStyle}
          renderItem={({ item }) => <ChatCardContainer chat={item} />}
        />
      </View>

      {/* Bottom Sheet */}
      <CustomBottomSheet />
    </View>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    position: 'relative',
    backgroundColor: 'white',
  },
  // chats container
  chatsConainerStyle: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },

  // chat search input container style
  searchInputContainerStyle: {
    backgroundColor: '#eee',
    padding: 0,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 15,
    borderRadius: 15,
  },
});
