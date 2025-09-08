// basic imports
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { v4 as uuid } from 'uuid';
import { useSearchParams } from 'expo-router/build/hooks';
import { ChatActionsTypes, ChatCard, ChatMessage, MessagesTypes } from '@/interfaces/chats';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useChatSounds } from '@/hooks/sounds';
import { readFileAsDataURL } from '@/utils/files';
import { secondsToDurationConverter } from '@/utils/time';
import { useAuthStore } from '@/store/zuAuth';
import { ChatActions, useChatsStore } from '@/store/zuChats';
import { useSystemStore } from '@/store/zuSystem';
import SoundIcon from '@/assets/icons/sound.png';

const CreateMessage = () => {
  // url search params
  const urlSearchParams = useSearchParams(); // Access the chat_id parameter
  //   current loggedIn user
  const currentUsr = useAuthStore().currentUser;
  // zustand zuChats
  const {
    setCurrentUsrDoingAction,
    addNewChat,
    chatMessages,
    openedChat,
    responseToMessage,
    placeLastUpdatedChatToTheTop,
    addMessageToChat,
    setChatLastMessage,
  } = useChatsStore();
  // zustand system
  const { toggleAttachFileBottomSheet } = useSystemStore();
  // text message input
  const [textMessage, setTextMessage] = useState('');
  // voice note duration
  const [voiceNoteDurationMillis, setVoiceNoteDurationMillis] = useState(0);
  // voice note duration in seconds
  let voiceNoteTime = secondsToDurationConverter(voiceNoteDurationMillis);
  // use sounds hooks
  const { record, stopRecording } = useChatSounds();
  //   is recording
  const [isRec, setIsRec] = useState(false);
  // chat action
  const [chatAction] = useState<ChatActions | null>(null);
  // handleInputFocus
  const handleInputFocus = () =>
    setCurrentUsrDoingAction({
      ...chatAction!,
      type: ChatActionsTypes.TYPEING,
    });
  // handleInputBlur
  const handleInputBlur = () => setCurrentUsrDoingAction({ ...chatAction!, type: null });
  //  check if it's recording
  const showSendMsgBtn = isRec || textMessage;
  //   input change handler
  const inputChangeHandler = (text: string) => setTextMessage(text);
  //   send text message handler
  // send text message
  const sendTextMessage = (message: ChatMessage) => {
    // create meassge
    if (!textMessage) return;
    // text message file name (null)
    const fileName = null;
    // text message file size (null)
    const fileSize = null;
    // textMessage
    const newTextMessage: ChatMessage = {
      ...message,
      content: textMessage,
      type: MessagesTypes.TEXT,
      fileName,
      fileSize,
    };
    // check if it's first message in the chat
    if (chatMessages?.length === 0) {
      // create chat card
      const chatCard: ChatCard = {
        lastMessage: newTextMessage,
        unReadedMsgs: 1,
        ...openedChat!,
      };
      // add chat top the top
      addNewChat(chatCard);
    }
    // push message to the chat
    addMessageToChat(newTextMessage);
    // clear the input
    setTextMessage('');
    // change chat last message
    setChatLastMessage({ msg: newTextMessage, currentUserId: currentUsr!._id });
  };
  // send voice message
  const sendVoiceMessage = async (message: ChatMessage) => {
    // send voice msg if it's recording and input is empty
    if (!isRec || textMessage) return;
    // stop recording
    const { recordingUri } = await stopRecording();
    // stop voice memo counter
    const dataUrl = await readFileAsDataURL(recordingUri!);

    // voiceNoteDuration
    const voiceMsgNoteDuration = String(voiceNoteDurationMillis);
    // voice message content
    const content = dataUrl!;
    // voice message file name (null)
    const fileName = `AUDIO-${message.sender._id}-${message.receiverId}${String(Math.random())}`;
    // voice message file size (null)
    const fileSize = '';
    // msg type
    const type = MessagesTypes.VOICENOTE;
    // voice note message
    const voiceNoteMessage: ChatMessage = {
      ...message,
      voiceNoteDuration: voiceMsgNoteDuration,
      content,
      type,
      fileName,
      fileSize,
    };
    // add message to the chat
    setIsRec(false);
    setVoiceNoteDurationMillis(0);
    // log voice mesage io
    console.log('voiceNoteMessage', voiceNoteMessage._id);
    // set voiceNoteTime
    voiceNoteTime = secondsToDurationConverter(0);
    // add message to the chat
    addMessageToChat(voiceNoteMessage);
    // change chat last message
    setChatLastMessage({ msg: voiceNoteMessage, currentUserId: currentUsr!._id });
  };
  //   send message handler
  const handleSendMessage = async () => {
    // chat id
    const chatId = urlSearchParams.get('chat_id')!;
    // chat message
    const message = {
      _id: uuid(),
      receiverId: chatId!,
      sender: currentUsr,
      date: new Date().toString(),
      status: null,
      msgReplyedTo: responseToMessage,
      replyTo: responseToMessage?._id,
    } as ChatMessage;
    // place current chat to the top
    placeLastUpdatedChatToTheTop({ chatId });
    // if text message
    if (textMessage && !isRec) return sendTextMessage(message);
    // if voice message
    sendVoiceMessage(message);
  };
  // handle record and stop recording
  const handleRecordStopRecording = async () => {
    // if it's not recording
    if (!isRec) {
      // set isRec to false
      setIsRec(true);
      // start recording
      await record();
      return;
    }
    // if it's recording
    setIsRec(false);
    stopRecording();
  };
  // interval variable
  let interval: number;

  // observe isRec
  React.useEffect(() => {
    // terminate if it's not recording
    if (!isRec) {
      // set loggedInUser Doing Action
      setCurrentUsrDoingAction({ ...chatAction!, type: null });
      clearInterval(interval);
      return;
    }
    // interval
    interval = setInterval(() => {
      setCurrentUsrDoingAction({
        ...chatAction!,
        type: ChatActionsTypes.RECORDING_VOICE,
      });
      // log isRec
      setVoiceNoteDurationMillis((prev) => prev + 1);
    }, 1000);
  }, [isRec]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* input filed */}
      <View style={styles.mainContainer}>
        {/* if it's recording */}
        {isRec && (
          <View style={styles.inputContainer}>
            <Text style={{ color: 'gray', fontFamily: 'BalooBhaijaan2', flexGrow: 1 }}>جار تسجيل رسالة صوتية ...</Text>
            <Text style={{ color: 'gray', fontFamily: 'BalooBhaijaan2' }}>{voiceNoteTime}</Text>
          </View>
        )}
        {/* if it's not recording */}
        {!isRec && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder='Type a message...'
              cursorColor={'dodgerblue'}
              value={textMessage}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChangeText={(e) => inputChangeHandler(e)}
            />
            <MIcon name='sticker-circle-outline' size={26} color='gray' />
            <TouchableOpacity onPress={() => toggleAttachFileBottomSheet()}>
              <Icon name='attach' size={28} color='gray' style={{ transform: [{ rotate: '45deg' }] }} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* send button */}
      <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
        {/* send icon if text message is not empty */}
        {showSendMsgBtn && <Icon name='send' style={styles.sendButtonText} />}
        {/* sound png image text field is empty*/}
        {!textMessage && !isRec && (
          <TouchableOpacity onPress={handleRecordStopRecording}>
            <Image source={SoundIcon} style={styles.recordVoiceBtn} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      {isRec && (
        <TouchableOpacity style={styles.stopRecBtn} onPress={handleRecordStopRecording}>
          <Icon name='stop-circle-outline' size={28} color='white' />
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

export default CreateMessage;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopColor: 'lightgray',
    borderTopWidth: 1,
    gap: 10,
  },
  // main container
  mainContainer: {
    flexGrow: 1,
    // height: 45,
    borderRadius: 22.5,
    // backgroundColor: '#f1f1f1',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    direction: 'rtl',
    gap: 10,
    borderRadius: 22.5,
    paddingHorizontal: 10,
    fontFamily: 'BalooBhaijaan2',
    backgroundColor: '#f1f1f1',
  },
  input: {
    flex: 1,
    height: 45,
    lineHeight: 20,
    fontFamily: 'BalooBhaijaan2',
  },
  sendButton: {
    backgroundColor: '#007bff',
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    height: 45,
    width: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22.5,
  },
  stopRecBtn: {
    backgroundColor: 'red',
    height: 45,
    width: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22.5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordVoiceBtn: {
    tintColor: '#fff',
    width: 25,
    height: 30,
  },
});
