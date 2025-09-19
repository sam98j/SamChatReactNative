import ChatCardContainer from '@/components/ChatCard';
import { View, StyleSheet, FlatList } from 'react-native';
import { SearchBar } from '@rneui/themed';
import CustomBottomSheet from '@/components/BottomSheet';
// feather icons
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useChatsStore } from '@/store/zuChats';
import NoChatsVector from '@/components/NoChatsVector';
import i18n from '@/i18n';

export default function Chats() {
  // get chats from zustand zuChats
  const { chats } = useChatsStore();
  // get lang from i18n
  const lang = i18n.locale; // replace with actual i18n language detection
  // log chat
  return (
    <View style={styles.container}>
      {/* Overlay */}
      <SearchBar
        placeholder={`${i18n.t('chatsListScreen.search-bar-placeholder')}`}
        onChangeText={(text) => console.log(text)}
        value=''
        textAlign={`${lang === 'ar' ? 'right' : 'left'}`}
        containerStyle={{
          backgroundColor: '#eee',
          padding: 0,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          marginHorizontal: 15,
          borderRadius: 10,
        }}
        inputContainerStyle={{ backgroundColor: '#eee' }}
        inputStyle={{ backgroundColor: '#eee', fontFamily: 'BalooBhaijaan2' }}
        searchIcon={<FeatherIcon name='search' size={20} color='gray' />}
        clearIcon={{ color: 'black' }}
        platform='default'
        round
      />
      <View style={{ marginTop: 10 }}>
        {chats?.length === 0 && <NoChatsVector />}
        <FlatList
          data={chats}
          extraData={chats} // <-- This tells FlatList to rerender when chats changes
          keyExtractor={(item) => item._id} // Make sure each chat has a unique _id
          contentContainerStyle={{
            paddingHorizontal: 15,
          }}
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
  chatsConainerStyle: {},
});
