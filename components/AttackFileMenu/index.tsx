import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import IonicIcons from 'react-native-vector-icons/Ionicons';
import { useFilePicker } from '@/hooks/filesPicker';
import { v4 as uuid } from 'uuid';
import { ChatMessage, MessagesTypes } from '@/interfaces/chats';
import { useSearchParams } from 'expo-router/build/hooks';
import { useSystemStore } from '@/store/systemStore';
import { useAuthStore } from '@/store/authStore';
import { useChatsStore } from '@/store/chatsStore';
import i18n from '../../i18n';

const AttchFileBottomSheet = () => {
  // url search params
  const urlSearchParams = useSearchParams(); // Access the chat_id parameter

  // Bottom sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);

  // file picker
  const { pickImage, pickVideo, pickFile } = useFilePicker();

  // current loggedIn user
  const currentUsr = useAuthStore().currentUser;

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['40%', '50%'], []);

  // response to message
  const { responseToMessage, addMessageToChat, setChatLastMessage, placeLastUpdatedChatToTheTop } = useChatsStore();

  // State to track if the bottom sheet is open
  const { isAttachFileBottomSheetOpen, openAttachFileBottomSheet } = useSystemStore();

  // Handle bottom sheet index changes
  const handleSheetChanges = useCallback((index: number) => {
    // Check if the bottom sheet is closed
    if (index === -1) openAttachFileBottomSheet(false);
  }, []);

  // Open the bottom sheet
  const openSheet = () => bottomSheetRef.current?.snapToIndex(1);

  // observe if the bottom sheet is open
  useEffect(() => {
    if (!isAttachFileBottomSheetOpen) return bottomSheetRef.current?.close();
    // open the bottom sheet
    openSheet();
  }, [isAttachFileBottomSheetOpen]);

  // Handle image picking
  const handlePickImage = async (msg: ChatMessage) => {
    try {
      const image = await pickImage();
      if (!image) return;

      // image message
      const imageMessage: ChatMessage = {
        ...msg,
        fileName: image.fileName!,
        fileSize: String(image.fileSize),
        status: null,
        content: image.uri,
        type: MessagesTypes.PHOTO,
        voiceNoteDuration: '',
      };

      // Handle the selected image (e.g., upload it or display it)
      addMessageToChat(imageMessage);

      // set last chat message
      setChatLastMessage({ msg: imageMessage, currentUserId: currentUsr!._id });
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // Handle video picking
  const handlePickVideo = async (msg: ChatMessage) => {
    try {
      const video = await pickVideo();
      if (!video) return;

      // video message
      const videoMessage: ChatMessage = {
        ...msg,
        fileName: video.fileName!,
        fileSize: String(video.fileSize),
        status: null,
        content: video.uri,
        type: MessagesTypes.VIDEO,
        voiceNoteDuration: '',
      };

      // Dispatch the message to the chat (you can implement this function)
      addMessageToChat(videoMessage);

      // set last chat message
      setChatLastMessage({ msg: videoMessage, currentUserId: currentUsr!._id });
    } catch (error) {
      console.error('Error picking video:', error);
    }
  };

  // Handle image picking
  const handlePickDocument = async (msg: ChatMessage) => {
    try {
      const doc = await pickFile();
      if (!doc) return;

      // image message
      const docMessage: ChatMessage = {
        ...msg,
        fileName: doc.name,
        fileSize: String(doc.size),
        status: null,
        content: doc.uri,
        type: MessagesTypes.FILE,
        voiceNoteDuration: '',
      };

      // Dispatch the message to the chat (you can implement this function)
      addMessageToChat(docMessage);

      // set last chat message
      setChatLastMessage({ msg: docMessage, currentUserId: currentUsr!._id });
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // send picked file
  const sendPickedFile = async (msgType: MessagesTypes) => {
    // chat id
    const chatId = urlSearchParams.get('chat_id')!;

    // chat message
    const message = {
      _id: uuid(),
      receiverId: chatId,
      sender: currentUsr,
      date: new Date().toString(),
      status: null,
      msgReplyedTo: responseToMessage,
      replyTo: responseToMessage?._id,
    } as ChatMessage;

    // if photo
    if (msgType === MessagesTypes.PHOTO) handlePickImage(message);
    // if video
    if (msgType === MessagesTypes.VIDEO) handlePickVideo(message);
    // if file
    if (msgType === MessagesTypes.FILE) handlePickDocument(message);

    // close attach file menu
    openAttachFileBottomSheet(false);
    // place last updated chat to the top
    placeLastUpdatedChatToTheTop({ chatId });
  };

  return (
    <View style={styles.container}>
      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // Start closed
        snapPoints={snapPoints}
        enablePanDownToClose={true} // Allow closing by swiping down
        onChange={handleSheetChanges} // Listen for index changes
        backgroundStyle={styles.bottomSheetBackground}
      >
        <BottomSheetView style={styles.contentContainer}>

          {/* photo icon container */}
          <TouchableOpacity onPress={() => sendPickedFile(MessagesTypes.PHOTO)} style={styles.fileTypeContainer}>
            <IonicIcons name='image-outline' size={25} color='gold' style={styles.icon} />
            <Text style={styles.fontFamily}>{i18n.t('attachFileMenu.image')}</Text>
          </TouchableOpacity>

          {/* video icon container */}
          <TouchableOpacity onPress={() => sendPickedFile(MessagesTypes.VIDEO)} style={styles.fileTypeContainer}>
            <IonicIcons name='videocam-outline' size={28} color='lightgreen' style={styles.icon} />
            <Text style={styles.fontFamily}>{i18n.t('attachFileMenu.video')}</Text>
          </TouchableOpacity>

          {/* file icon container */}
          <TouchableOpacity onPress={() => sendPickedFile(MessagesTypes.FILE)} style={styles.fileTypeContainer}>
            <IonicIcons name='document-text-outline' size={28} color='blue' style={styles.icon} />
            <Text style={styles.fontFamily}>{i18n.t('attachFileMenu.file')}</Text>
          </TouchableOpacity>

          {/* voice note icon container */}
          <TouchableOpacity onPress={() => sendPickedFile(MessagesTypes.VIDEO)} style={styles.fileTypeContainer}>
            <IonicIcons name='musical-notes-outline' size={28} color='red' style={styles.icon} />
            <Text style={styles.fontFamily}>{i18n.t('attachFileMenu.audio')}</Text>
          </TouchableOpacity>
          {/* Additional Content */}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default AttchFileBottomSheet;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    height: '100%',
  },
  bottomSheetBackground: {
    backgroundColor: '#eee',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 5,
    paddingBottom: 20,
  },

  fileTypeContainer: {
    display: 'flex',
    flexDirection: 'column',
    aspectRatio: 4 / 4,
    borderRadius: 15,
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    width: 80,
  },
  //   icon container
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {},
  input: {
    fontSize: 16,
    flexGrow: 1,
    color: '#000',
  },
  //   font fami8ly
  fontFamily: {
    fontFamily: 'BalooBhaijaan2',
  },
});
