import { Stack } from 'expo-router';
import React from 'react';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChangeMessageStatusDTO, ChatCard, ChatMessage, MessageStatus } from '@/interfaces/chats';
import useChatMessagesSender from '@/hooks/chats';
import { useAudioPlayer } from 'expo-audio';
import { useAuthStore } from '@/store/authStore';
import { useChatsStore } from '@/store/chatsStore';
import sentSound from '@/assets/sounds/imessage_send.mp3';
import recieve_msg_sound from '@/assets/sounds/imessage_recieve.mp3';

const MainLayout = () => {
  // api url
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // get curentUser state zustand zuAuth
  const { currentUser } = useAuthStore();

  // socket instance
  const [socketClient, setSocket] = useState<Socket | null>(null);

  // multichunk msg
  const { sendChatMessage } = useChatMessagesSender(socketClient!);

  // chat messages
  const {
    chatMessages,
    messageToBeMarketAsReaded,
    isCurrentUsrDoingAction,
    openedChat,
    messagesToBeForwared,
    setMessagesToBeForwared,
    setChatUsrStatus,
    setMessageStatus,
    placeLastUpdatedChatToTheTop,
    setChatLastMessage,
    setChatUnReadedMessagesCount,
    addMessageToChat,
    setChatUsrDoingAction,
    addNewChat,
    setFileMessageUploadIndicator,
  } = useChatsStore();

  // sent message audio player
  const sentMsgAudioPlayer = useAudioPlayer(sentSound);

  // recieve message audio player
  const recieveMsgAudioPlayer = useAudioPlayer(recieve_msg_sound);

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
      // set message status
      setMessageStatus(data);
      // check for message sent status
      if (data.msgStatus === MessageStatus.SENT) {
        sentMsgAudioPlayer.play();
        sentMsgAudioPlayer.seekTo(0);
        setFileMessageUploadIndicator(0);
      }
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
        setChatUnReadedMessagesCount(message.receiverId, false);
        return;
      }
      // chatUser
      const chatUserId = openedChat!.members.filter((member) => member._id !== currentUser!._id)[0]._id;
      // check if the msg releated to current chat
      if (message.sender._id !== chatUserId && message.receiverId !== chatUserId) return;
      // if the message is not a multichunk message, add it to the chat messages
      addMessageToChat(message);
      // expo audio
      // play sound
      recieveMsgAudioPlayer.play();
      recieveMsgAudioPlayer.seekTo(0);
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

  // listen for forwarded messages
  useEffect(() => {
    // messages forwarded done
    socketClient?.on('forward_messages_done', () => {
      // terminate if no messages to forwarded
      console.log(messagesToBeForwared);
      // place chats to the top
      messagesToBeForwared!.chats.map((chatId) => placeLastUpdatedChatToTheTop({ chatId }));

      // set messages to forwarded to null
      setMessagesToBeForwared(null);
    });
    // terminate if no chats to forwarded to them
    if (!messagesToBeForwared || !messagesToBeForwared.chats.length) return;

    // send socket TODO: BUG: the message is sent twice to the backend
    socketClient?.emit('forward_messages', messagesToBeForwared);
  }, [messagesToBeForwared]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="single_chat/[chat_id]"
        options={{
          headerShown: false,
          presentation: 'pageSheet',
          animation: 'ios_from_right',
          animationDuration: 50,
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
};

export default MainLayout;
