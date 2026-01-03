import { MessagesToBeForwarded } from '@/interfaces/chats';
import { useChatsStore } from '@/store/chatsStore';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MsgActionsMenu = () => {
  // zuchats store
  const { setMsgsActionsMenu, msgsActionsMenu, setMessagesToBeForwared } = useChatsStore();

  // handle forward messages
  const handleForwardMessages = () => {
    // messages to be forwared
    const messageToBeForwared: MessagesToBeForwarded = {
      messages: [...msgsActionsMenu!],
      chats: [],
    };
    // close menu
    setMessagesToBeForwared(messageToBeForwared);
  };

  return (
    <View style={styles.container}>
      {/* close icon */}
      <TouchableOpacity onPress={() => setMsgsActionsMenu(null)} style={styles.closeIcon}>
        <Icon name='close' size={20} color='gray' />
      </TouchableOpacity>

      {/* selected messages count */}
      <View style={styles.selectedMessagesCountContainer}>
        <Text style={styles.selectedMessagesCountText}>1</Text>
      </View>

      {/* actions */}
      <View style={styles.actionsContainer}>
        {/* copy icon */}
        <TouchableOpacity>
          <Icon name='copy-outline' size={20} color='dodgerblue' />
        </TouchableOpacity>
        {/* forward icon */}
        <TouchableOpacity>
          <Icon name='star-outline' size={20} color='dodgerblue' />
        </TouchableOpacity>
        {/* delete icon */}
        <TouchableOpacity onPress={handleForwardMessages}>
          <Icon name='return-up-forward-outline' size={20} color='dodgerblue' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MsgActionsMenu;

// styles sheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 15,
  },

  // close icon
  closeIcon: {
    backgroundColor: '#ddd',
    borderRadius: 50,
    width: 30,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // selected messages count
  selectedMessagesCountContainer: {
    flexGrow: 1,
  },

  // selected messages count text
  selectedMessagesCountText: {
    color: 'gray',
    fontSize: 18,
    fontFamily: 'BalooBhaijaan2',
  },

  // actions container
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
  },
});
