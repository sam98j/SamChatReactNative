import Icon from 'react-native-vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import ChatsHeaderBtns from '@/components/ChatsHeaderBtns';
import i18n from '../../i18n';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChangeMessageStatusDTO, ChatCard, ChatMessage, MessageStatus } from '@/interfaces/chats';
import useChatMessagesSender from '@/hooks/chats';
import { useChatSounds, usePlayChatSound } from '@/hooks/sounds';
import { useAudioPlayer } from 'expo-audio';
import { useAuthStore } from '@/store/zuAuth';
import { useChatsStore } from '@/store/zuChats';

export default function TabLayout() {
  // api url
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  // get curentUser state zustand zuAuth
  const { currentUser } = useAuthStore();
  // check if currentUser is truthy
  const isUserLoggedIn = currentUser !== null ? true : false;
  // use playchatsound hook
  const { playReceivedMessageSound } = usePlayChatSound();
  // socket instance
  const [socketClient, setSocket] = useState<Socket | null>(null);
  // multichunk msg
  const { sendChatMessage } = useChatMessagesSender(socketClient!);
  // dispatch method
  // chat messages
  const {
    chatMessages,
    messageToBeMarketAsReaded,
    isCurrentUsrDoingAction,
    openedChat,
    setChatUsrStatus,
    setMessageStatus,
    placeLastUpdatedChatToTheTop,
    setChatLastMessage,
    setChatUnReadedMessagesCount,
    addMessageToChat,
    setChatUsrDoingAction,
    addNewChat,
  } = useChatsStore();
  // audio file path
  const audioFilePath = require('@/assets/sounds/imessage_send.mp3');
  // audio player
  const audioPlayer = useAudioPlayer(audioFilePath);
  // listen fro socket clietn and current user and opened chat
  useEffect(() => {
    // when one of the chats is go online
    socketClient?.on('usr_online_status', (data) => {
      // check if no chat is opened
      if (!openedChat) return;
      // chat Usr
      const chatUser = openedChat.members.filter((member) => member._id !== currentUser?._id)[0];
      // check if the openedChat and the client doing the action of online status
      if (chatUser._id !== data.id) return;
      // all conditions passed
      setChatUsrStatus(data.status);
    });
    // clear listener
    socketClient?.removeAllListeners('message_status_changed');
    // receive message status
    socketClient?.on('message_status_changed', (data: ChangeMessageStatusDTO) => {
      // check for message sent status
      if (data.msgStatus === MessageStatus.SENT) audioPlayer.play();
      // set message status
      setMessageStatus(data);
    });
  }, [socketClient, currentUser, openedChat]);
  // listen for incoming messages
  useEffect(() => {
    // clear listener
    socketClient?.removeAllListeners('message');
    // receive message
    socketClient?.on('message', (message: ChatMessage) => {
      // place last updated chat to the top
      placeLastUpdatedChatToTheTop({ chatId: message.receiverId });
      // set chat's last message
      setChatLastMessage({ msg: message, currentUserId: currentUser!._id });
      // mark received message as delevered if there is no opened chat
      if (!openedChat || openedChat._id !== message.receiverId) {
        // change message status dto
        const data: ChangeMessageStatusDTO = {
          msgIDs: [message._id],
          senderIDs: [message.sender._id],
          chatId: message.receiverId,
          msgStatus: MessageStatus.DELEVERED,
        };
        // inform the server that the message is delevered
        socketClient?.emit('message_status_changed', data);
        setChatUnReadedMessagesCount(message);
        return;
      }
      // chatUser
      const chatUserId = openedChat!.members.filter((member) => member._id !== currentUser!._id)[0]._id;
      // check if the msg releated to current chat
      if (message.sender._id !== chatUserId && message.receiverId !== chatUserId) return;
      // if the message is not a multichunk message, add it to the chat messages
      addMessageToChat(message);
      // play sound
      playReceivedMessageSound();
    });
  }, [socketClient, openedChat]);
  // make socket connection
  useEffect(() => {
    // disconnect the web socket when usr logged out
    if (currentUser === undefined) socketClient?.disconnect();
    // terminate if usr is logged out
    if (!currentUser) return;
    // make socket io connection
    const socket = io(`${apiUrl}`, { query: { client_id: currentUser._id } });
    // set socket
    setSocket(socket);
  }, [currentUser]);
  // listen for multichunk msg
  useEffect(() => {
    // terminate if chat's messages not fetched yet
    if (!chatMessages) return;
    // msgs  to sent
    const messagesToSent = chatMessages.filter((msg: ChatMessage) => msg.status === null);
    // terminate if there is no message waiting for send
    if (!messagesToSent[0]) return;
    // send
    sendChatMessage(messagesToSent[0]);
  }, [chatMessages]);
  // listen for message to be mark as readed
  useEffect(() => {
    // terminate if there is no message
    if (!messageToBeMarketAsReaded) return;
    // tell the server about readed message
    socketClient?.emit('message_status_changed', messageToBeMarketAsReaded);
  }, [messageToBeMarketAsReaded]);
  // listen for chat user doing action
  useEffect(() => {
    // check for usr and socket
    if (!socketClient) return;
    // listen for chat usr doing action
    socketClient?.on('chatusr_typing_status', (actionData) => setChatUsrDoingAction(actionData));
    // listen for new chat created
    socketClient?.on('new_chat_created', (newChat: ChatCard) => {
      // add the new chat to the user's chats list
      addNewChat(newChat);
      // change message status dto
      const changeMessageStatusData: ChangeMessageStatusDTO = {
        msgIDs: [newChat.lastMessage._id],
        msgStatus: MessageStatus.DELEVERED,
        chatId: newChat._id,
        senderIDs: [newChat.lastMessage.sender._id],
      };
      // emit the received chat's message as delevered
      socketClient.emit('message_status_changed', changeMessageStatusData);
    });
  }, [socketClient]);
  // listen to isCurrentUsrDoingAction
  useEffect(() => {
    // chatusr_start_typing
    socketClient?.emit('chatusr_typing_status', isCurrentUsrDoingAction);
  }, [isCurrentUsrDoingAction]);
  return (
    <Tabs
      initialRouteName='chats/index'
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'blue',
        headerStyle: { shadowColor: 'white' },
        headerTitleAlign: 'center',
        headerTitleStyle: { fontFamily: 'BalooBhaijaan2', display: isUserLoggedIn ? 'flex' : 'none' },
        tabBarLabelStyle: { fontFamily: 'BalooBhaijaan2' },
        headerShown: isUserLoggedIn ? true : false, // Dynamically control header visibility
        tabBarStyle: {
          display: isUserLoggedIn ? 'flex' : 'none', // Dynamically control tabBar visibility
        },
      })}
    >
      {/* index  */}
      <Tabs.Screen
        name='index'
        options={{
          href: null,
        }}
      />
      {/* home screen */}
      <Tabs.Screen
        name='profile/index'
        options={{
          title: i18n.t('tabsLayout.profile'),
          tabBarIcon: ({ color }) => <Icon size={28} name='person-circle-outline' color={color} />,
        }}
      />
      {/* chats screen */}
      <Tabs.Screen
        name='chats/index'
        options={{
          title: i18n.t('tabsLayout.chats'),
          tabBarIcon: ({ color }) => <Icon size={28} name='chatbubbles-outline' color={color} />,
          headerRight: () => isUserLoggedIn && <ChatsHeaderBtns />,
        }}
      />
      <Tabs.Screen
        name='calls/index'
        options={{
          title: i18n.t('tabsLayout.calls'),
          tabBarIcon: ({ color }) => <Icon size={28} name='call-outline' color={color} />,
        }}
      />
      {/* setting screen */}
      <Tabs.Screen
        name='settings/index'
        options={{
          title: i18n.t('tabsLayout.settings'),
          tabBarIcon: ({ color }) => <Icon size={28} name='settings-outline' color={color} />,
        }}
      />
    </Tabs>
  );
}
