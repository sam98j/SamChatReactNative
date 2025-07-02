import ChatCardContainer from '@/components/ChatCard';
import { Text, View, StyleSheet, FlatList, Button } from 'react-native';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { SearchBar } from '@rneui/themed';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CustomBottomSheet from '@/components/BottomSheet';
// feather icons
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useChatsStore } from '@/store/zuChats';
import NoChatsVector from '@/components/NoChatsVector';

export default function Chats() {
  // get chats from zustand zuChats
  const { chats } = useChatsStore();

  // log chat
  return (
    <View style={styles.container}>
      {/* Overlay */}
      <SearchBar
        placeholder='Search Conversations'
        onChangeText={(text) => console.log(text)}
        value=''
        containerStyle={{
          backgroundColor: '#ddd',
          padding: 0,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          marginHorizontal: 15,
          borderRadius: 10,
        }}
        inputContainerStyle={{ backgroundColor: '#ddd' }}
        inputStyle={{ backgroundColor: '#ddd' }}
        searchIcon={<FeatherIcon name='search' size={20} color='gray' />}
        clearIcon={{ color: 'black' }}
        platform='default'
        round
      />
      <View style={{ marginTop: 10 }}>
        {chats?.length === 0 && <NoChatsVector />}
        <FlatList
          data={chats}
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
