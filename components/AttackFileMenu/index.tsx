import React, { useRef, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import IonicIcons from 'react-native-vector-icons/Ionicons';
import { useFilePicker } from '@/hooks/filesPicker';
import { v4 as uuid } from 'uuid';
import { ChatMessage, MessagesTypes } from '@/interfaces/chats';
import { useSearchParams } from 'expo-router/build/hooks';
import { getFileSize, readFileAsDataURL } from '@/utils/files';
import { useSystemStore } from '@/store/zuSystem';
import { useAuthStore } from '@/store/zuAuth';
import { useChatsStore } from '@/store/zuChats';

const AttchFileBottomSheet = () => {
  // url search params
  const urlSearchParams = useSearchParams(); // Access the chat_id parameter
  // Bottom sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { pickImage, pickVideo, pickFile } = useFilePicker();

  // current loggedIn user
  const currentUsr = useAuthStore().currentUser;
  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['40%', '50%'], []);
  // response to message
  const { responseToMessage, addMessageToChat, setChatLastMessage } = useChatsStore();
  // State to track if the bottom sheet is open
  const { isAttachFileBottomSheetOpen, openAttachFileBottomSheet } = useSystemStore();

  // Handle bottom sheet index changes
  const handleSheetChanges = useCallback((index: number) => {
    // Check if the bottom sheet is closed
    if (index === -1) openAttachFileBottomSheet(false);
  }, []);

  // Open the bottom sheet
  const openSheet = () => bottomSheetRef.current?.snapToIndex(0);

  // observe if the bottom sheet is open
  useEffect(() => {
    if (isAttachFileBottomSheetOpen) return openSheet();
    // close the bottom sheet
    bottomSheetRef.current?.close();
  }, [isAttachFileBottomSheetOpen]);

  // Handle image picking
  const handlePickImage = async (msg: ChatMessage) => {
    try {
      const image = await pickImage();
      if (image) {
        // read file as data url expo file system
        const fileData = await readFileAsDataURL(image.uri);
        // image message
        const imageMessage: ChatMessage = {
          ...msg,
          fileName: image.name,
          fileSize: getFileSize(fileData as string),
          status: null,
          content: fileData as string,
          type: MessagesTypes.PHOTO,
          voiceNoteDuration: '',
        };
        // Handle the selected image (e.g., upload it or display it)
        console.log('Selected image:', image);
        // Dispatch the message to the chat (you can implement this function)
        addMessageToChat(imageMessage);
        setChatLastMessage({ msg: imageMessage, currentUserId: currentUsr!._id });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // Handle video picking
  const handlePickVideo = async (msg: ChatMessage) => {
    try {
      const video = await pickVideo();
      if (video) {
        // read file as data url expo file system
        const fileData = await readFileAsDataURL(video.uri);
        // video message
        const videoMessage: ChatMessage = {
          ...msg,
          fileName: video.name,
          fileSize: getFileSize(fileData as string),
          status: null,
          content: fileData as string,
          type: MessagesTypes.VIDEO,
          voiceNoteDuration: '',
        };
        // Handle the selected video (e.g., upload it or display it)
        console.log('Selected video:', video);
        // Dispatch the message to the chat (you can implement this function)
        addMessageToChat(videoMessage);
        setChatLastMessage({ msg: videoMessage, currentUserId: currentUsr!._id });
      }
    } catch (error) {
      console.error('Error picking video:', error);
    }
  };

  // Handle image picking
  const handlePickDocument = async (msg: ChatMessage) => {
    try {
      const doc = await pickFile();
      if (doc) {
        // read file as data url expo file system
        const fileData = await readFileAsDataURL(doc.uri, doc.mimeType);
        console.log(doc.mimeType);
        // image message
        const docMessage: ChatMessage = {
          ...msg,
          fileName: doc.name,
          fileSize: getFileSize(fileData as string),
          status: null,
          content: fileData as string,
          type: MessagesTypes.FILE,
          voiceNoteDuration: '',
        };
        // Dispatch the message to the chat (you can implement this function)
        addMessageToChat(docMessage);
        setChatLastMessage({ msg: docMessage, currentUserId: currentUsr!._id });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  // send picked file
  const sendPickedFile = async (msgType: MessagesTypes) => {
    // chat message
    const message = {
      _id: uuid(),
      receiverId: urlSearchParams.get('chat_id'),
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
    // send file
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
          {/* icon container */}
          <TouchableOpacity onPress={() => sendPickedFile(MessagesTypes.PHOTO)} style={styles.fileTypeContainer}>
            <IonicIcons name='image-outline' size={25} color='gold' style={styles.icon} />
            <Text style={styles.fontFamily}>صورة</Text>
          </TouchableOpacity>
          {/* icon container */}
          <TouchableOpacity onPress={() => sendPickedFile(MessagesTypes.VIDEO)} style={styles.fileTypeContainer}>
            <IonicIcons name='videocam-outline' size={28} color='lightgreen' style={styles.icon} />
            <Text style={styles.fontFamily}>فديو</Text>
          </TouchableOpacity>
          {/* icon container */}
          <TouchableOpacity onPress={() => sendPickedFile(MessagesTypes.FILE)} style={styles.fileTypeContainer}>
            <IonicIcons name='document-text-outline' size={28} color='blue' style={styles.icon} />
            <Text style={styles.fontFamily}>ملف</Text>
          </TouchableOpacity>
          {/* icon container */}
          <TouchableOpacity onPress={() => sendPickedFile(MessagesTypes.VIDEO)} style={styles.fileTypeContainer}>
            <IonicIcons name='musical-notes-outline' size={28} color='red' style={styles.icon} />
            <Text style={styles.fontFamily}>صوتي</Text>
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
    marginLeft: 7,
    marginRight: 7,
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
    gap: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 13,
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
