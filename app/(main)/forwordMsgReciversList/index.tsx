import ForwardMsgChatCard from '@/components/ForwardMsgChatCard';
import NoChatsVector from '@/components/NoChatsVector';
import i18n from '@/i18n';
import { MessagesToBeForwarded } from '@/interfaces/chats';
import { useChatsStore } from '@/store/zuChats';
import { Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StatusBar, ToastAndroid } from 'react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ForwardMsgMenu = () => {
  // chat zustand
  const { setMessagesToBeForwared, chats, msgsActionsMenu, setMsgsActionsMenu } = useChatsStore();

  // cheched chats
  const [checkedChats, setCheckedChats] = useState<string[]>([]);

  // component isloading
  const [isLoading, setIsLoading] = useState(false);

  // handle close menu
  const handleCloseMenu = () => setMessagesToBeForwared(null);

  // local
  const local = i18n.locale;

  // router
  const router = useRouter();

  // handle forward
  const handleForward = () => {
    // messages to be forwarded
    const msgToBeForwarded: MessagesToBeForwarded = {
      chats: checkedChats,
      messages: msgsActionsMenu!,
    };

    // set is loading
    setIsLoading(true);

    // dispatch to zustand
    setMessagesToBeForwared(msgToBeForwarded);
  };

  // component unmount
  useEffect(() => {
    return () => {
      // remove all listeners
      router.push('/(main)/(tabs)/chats');

      // reset states
      setMsgsActionsMenu(null);

      // locals
      const msgsForwardingStatus = i18n.t('openedChat.messages-forwarding-menu.messages-forwarded-successfully');

      // show toast
      ToastAndroid.show(msgsForwardingStatus, ToastAndroid.SHORT);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* status bar */}
      <StatusBar backgroundColor={'#eee'} animated={true} barStyle='dark-content' />

      {/* menu header */}
      <View style={[styles.menuHeader, local === 'ar' && styles.arDirection]}>
        {/* back button */}
        <TouchableOpacity onPress={handleCloseMenu} style={local === 'ar' && styles.flipDir}>
          <Icon name='chevron-back' size={30} color='black' />
        </TouchableOpacity>
        {/* menu header text */}
        <Text style={styles.menuHeaderText}>Forward Messages</Text>

        {/* search chat input */}
        <TouchableOpacity>
          <Icon name='search-outline' size={25} color='dodgerblue' />
        </TouchableOpacity>

        {/* forward button */}
        <Button
          style={styles.forwardButton}
          title=''
          color={'#007bff13'}
          radius={50}
          disabled={checkedChats.length === 0}
          disabledStyle={styles.disabledButton}
          onPress={handleForward}
        >
          {!isLoading && <Icon name='send' size={20} color='dodgerblue' style={local === 'ar' && styles.flipDir} />}

          {/* activity indicator */}
          {isLoading && <ActivityIndicator size={20} color='gray' />}
        </Button>
      </View>

      {/* list of chats */}
      <View style={{ marginTop: 10 }}>
        {chats?.length === 0 && <NoChatsVector />}
        {/*  */}
        <FlatList
          data={chats}
          extraData={chats} // <-- This tells FlatList to rerender when chats changes
          keyExtractor={(item) => item._id} // Make sure each chat has a unique _id
          contentContainerStyle={styles.chatsConainerStyle}
          renderItem={({ item }) => <ForwardMsgChatCard chat={item} selectChat={setCheckedChats} />}
        />
      </View>

      {/* button */}
    </View>
  );
};

export default ForwardMsgMenu;

// styles sheet
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: 'white',
    width: '100%',
    zIndex: 12,
  },

  // menu header
  menuHeader: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    gap: 20,
  },

  // menu header text
  menuHeaderText: {
    fontFamily: 'BalooBhaijaan2',
    fontSize: 20,
    flexGrow: 1,
    color: 'black',
  },

  // chats container
  chatsConainerStyle: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },

  // direction
  arDirection: {
    direction: 'rtl',
  },

  // flip dir
  flipDir: {
    transform: [{ scaleX: -1 }],
  },

  // forward button
  forwardButton: {
    height: 35,
    width: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22.5,
  },

  // disabled button
  disabledButton: {
    opacity: 0.3,
  },
});
