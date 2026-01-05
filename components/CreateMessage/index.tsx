// basic imports
import React, { useRef, useState } from 'react';
import 'react-native-image-keyboard';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { v4 as uuid } from 'uuid';
import { useSearchParams } from 'expo-router/build/hooks';
import { ChatActionsTypes, ChatCard, ChatMessage, MessagesTypes } from '@/interfaces/chats';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useChatSounds } from '@/hooks/sounds';
import { secondsToDurationConverter } from '@/utils/time';
import { useAuthStore } from '@/store/authStore';
import { ChatActions, useChatsStore } from '@/store/chatsStore';
import { useSystemStore } from '@/store/systemStore';
import SoundIcon from '@/assets/icons/sound.png';
import i18n from '@/i18n';
import ResponseToMsgPopUp from '../ResponseToMsgPopUp';
import * as ImagePicker from 'expo-image-picker';

const CreateMessage = () => {
  // url search params
  const urlSearchParams = useSearchParams(); // Access the chat_id parameter

  // type message input ref
  const typeMessageInputRef = useRef<TextInput>(null);

  // chat id
  const chatId = urlSearchParams.get('chat_id')!;

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

  // foucs text input on response to message pop
  if (responseToMessage) typeMessageInputRef.current?.focus();

  // zustand system
  const { openAttachFileBottomSheet, isAttachFileBottomSheetOpen } = useSystemStore();

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
  const [chatAction, setChatAction] = useState<ChatActions | null>(null);

  // handleInputFocus
  const handleInputFocus = () =>
    setCurrentUsrDoingAction({
      ...chatAction!,
      type: ChatActionsTypes.TYPEING,
    });

  // handleInputBlur
  const handleInputBlur = () => {
    console.log('blurred');
    setCurrentUsrDoingAction({ ...chatAction!, type: null });
  };

  //  check if it's recording
  const showSendMsgBtn = isRec || textMessage;

  //   input change handler
  const inputChangeHandler = (text: string) => setTextMessage(text);

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

    // voiceNoteDuration
    const voiceMsgNoteDuration = String(voiceNoteDurationMillis);
    // voice message content
    const content = recordingUri!;
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
    // set voiceNoteTime
    voiceNoteTime = secondsToDurationConverter(0);
    // add message to the chat
    addMessageToChat(voiceNoteMessage);
    // change chat last message
    setChatLastMessage({ msg: voiceNoteMessage, currentUserId: currentUsr!._id });
  };

  //   send message handler
  const handleSendMessage = async () => {
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

  //TODO: handle image change
  const handleImageChange = (event) => {
    const { uri, linkUri, mime, data } = event.nativeEvent;
    console.log('uri', uri);
    console.log('linkUri', linkUri);
    console.log('mime', mime);
    console.log('data', data);
  };

  // open camera and take photo
  const openCamera = async () => {
    // check camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    // if camera permission is not granted
    if (status !== 'granted') {
      alert('Camera permission is required to take photos.');
      return;
    }
    // take photo
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.8,
    });
    // if photo is taken
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      // create message object
      const message: ChatMessage = {
        _id: uuid(),
        content: uri,
        type: MessagesTypes.PHOTO,
        replyTo: responseToMessage?._id || null,
        msgReplyedTo: responseToMessage,
        sender: currentUsr!,
        fileName: result.assets[0].fileName!,
        fileSize: String(result.assets[0].fileSize),
        receiverId: chatId,
        status: null,
        date: new Date().toISOString(),
        voiceNoteDuration: '',
      };
      // check if it's first message in the chat
      if (chatMessages?.length === 0) {
        // create chat card
        const chatCard: ChatCard = {
          lastMessage: message,
          unReadedMsgs: 1,
          ...openedChat!,
        };
        // add chat to the top
        addNewChat(chatCard);
      }
      // push message to the chat
      addMessageToChat(message);
      // change chat last message
      setChatLastMessage({ msg: message, currentUserId: currentUsr!._id });
      // place current chat to the top
      placeLastUpdatedChatToTheTop({ chatId });
    }
  };

  // interval variable
  const intervalRef = useRef<number | null>(null);

  // observe isRec
  React.useEffect(() => {
    // terminate if it's not recording
    if (!isRec) {
      // set loggedInUser Doing Action
      setCurrentUsrDoingAction({ ...chatAction!, type: null });
      clearInterval(intervalRef.current!);
      setVoiceNoteDurationMillis(0);
      return;
    }
    // set loggedInUser Doing Action
    setCurrentUsrDoingAction({
      ...chatAction!,
      type: ChatActionsTypes.RECORDING_VOICE,
    });
    // interval
    intervalRef.current = setInterval(() => setVoiceNoteDurationMillis((prev) => prev + 1), 1000);
  }, [isRec]);

  // listen for opened chat
  React.useEffect(() => {
    // if no opened chat
    if (!openedChat) return;
    // chat members IDs
    const openedChatMembersIDs = openedChat?.members.map((member) => member._id);
    // chat action
    const chatAction = {
      type: null,
      chatId: openedChat!._id,
      chatMembers: openedChatMembersIDs!,
      senderId: currentUsr!._id,
    };
    // setChatAction
    setChatAction(chatAction);
  }, [openedChat]);

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* response to message pop up */}
      <ResponseToMsgPopUp />

      {/* input filed */}
      <View style={styles.mainContainer}>
        {/* if it's recording */}
        {isRec && (
          <View style={styles.inputContainer}>
            <Text style={{ color: 'gray', fontFamily: 'BalooBhaijaan2', flexGrow: 1 }}>
              {i18n.t('openedChat.create-message-input.recording-voice-message-alert')}
            </Text>
            <Text style={{ color: 'gray', fontFamily: 'BalooBhaijaan2' }}>{voiceNoteTime}</Text>
          </View>
        )}

        {/* if it's not recording */}
        {!isRec && (
          <View style={styles.inputContainer}>
            {/* open a camera when click on the icon */}
            <TouchableOpacity onPress={openCamera}>
              <Icon name='camera-outline' size={26} color='dodgerblue' />
            </TouchableOpacity>
            {/* input field */}
            <TextInput
              style={styles.input}
              ref={typeMessageInputRef}
              placeholder={i18n.t('openedChat.create-message-input.type-message-input-placeholder')}
              cursorColor={'dodgerblue'}
              value={textMessage}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChangeText={(e) => inputChangeHandler(e)}
              onImageChange={() => handleImageChange}
            />
            {/* attach file and stickers icons */}
            <MIcon name='sticker-circle-outline' size={26} color='dodgerblue' />
            {/* attach file bottom sheet */}
            <TouchableOpacity onPress={() => openAttachFileBottomSheet(!isAttachFileBottomSheetOpen)}>
              <Icon name='attach' size={28} color='dodgerblue' style={{ transform: [{ rotate: '45deg' }] }} />
            </TouchableOpacity>
          </View>
        )}
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

        {/* stop recording btn */}
        {isRec && (
          <TouchableOpacity style={styles.stopRecBtn} onPress={handleRecordStopRecording}>
            <Icon name='stop-circle-outline' size={28} color='white' />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateMessage;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopColor: '#eee',
    borderTopWidth: 0.5,
  },
  // main container
  mainContainer: {
    flexGrow: 1,
    borderRadius: 22.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    gap: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    direction: 'rtl',
    gap: 10,
    borderRadius: 22.5,
    paddingHorizontal: 10,
    fontFamily: 'BalooBhaijaan2',
    backgroundColor: '#eee',
    flexGrow: 1,
  },
  input: {
    flex: 1,
    fontFamily: 'BalooBhaijaan2',
  },
  sendButton: {
    backgroundColor: '#007bff',
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
