import { ChatMessage } from '@/interfaces/chats';
import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Modal, StatusBar, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import EnTypoIcon from 'react-native-vector-icons/Entypo';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import FileMsgUploadIndicator from '../FileMsgUploadIndicator';
import { Image } from 'expo-image';
import { useAuthStore } from '@/store/authStore';
import { getTime, TimeUnits } from '@/utils/time';
import i18n from '@/i18n';
import { File, Paths } from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import ImageOptionsDropdown from './ImageOptionsDropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

// props
type Props = { msg: ChatMessage };

const ImageMsgViewer: React.FC<Props> = ({ msg }) => {
  // destructure message
  const {
    content,
    sender: { name: senderName },
    date,
  } = msg;

  // current user
  const { currentUser } = useAuthStore();

  // is msg sended by current user
  const isSendedByCurrentUser = msg.sender._id === currentUser?._id;

  // format message time
  const messageTime = getTime(date, TimeUnits.fullTime, i18n.locale as never);

  // message sender name
  const messageSenderName = isSendedByCurrentUser ? i18n.t('openedChat.media-viewer.you') : senderName;

  // is image viewer open useState
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  // show menu useState
  const [showMenu, setShowMenu] = useState(false);

  // handle click to open image viewer and close it if it is already open
  const handleClick = () => {
    setIsImageViewerOpen(!isImageViewerOpen);
    setShowMenu(false); // Close menu when closing viewer
  };

  // toggle menu
  const toggleMenu = () => setShowMenu(!showMenu);

  // handle share
  const handleShare = async () => {
    try {
      // close menu
      setShowMenu(false);
      const fileUrl = content.startsWith('file') ? content : `${process.env.EXPO_PUBLIC_API_URL}${content}`;

      let fileUri = fileUrl;

      // If it's a remote URL, download it first
      if (!fileUrl.startsWith('file')) {
        const fileName = content.split('/').pop() || 'image.jpg';

        // handle if destination already exists
        const destination = new File(Paths.document, fileName);

        // handle if file already exists
        if (destination.exists) {
          fileUri = destination.uri;
        } else {
          // download file
          const file = await File.downloadFileAsync(fileUrl, destination);
          fileUri = file.uri;
        }
      }

      // share file
      await shareAsync(fileUri);
    } catch (error) {
      console.error('Error sharing image', error);
      // show error toast
      ToastAndroid.show('Error sharing image', ToastAndroid.SHORT);
    }
  };

  // handle save
  const handleSave = async () => {
    // TODO: Implement save logic
    console.log('Save to gallery');
    setShowMenu(false);
  };

  // handle delete
  const handleDelete = async () => {
    // TODO: Implement delete logic
    console.log('Delete message');
    setShowMenu(false);
  };

  // swipe up detection
  const swipeUpGesture = Gesture.Pan().onEnd((event) => {
    const { velocityY, translationY } = event;
    if (translationY < -50 && velocityY < -200) {
      // close image viewer
      runOnJS(setIsImageViewerOpen)(false);
    }
  });

  // dimentinos
  // api url  expo e  nv variable
  const apiHost = process.env.EXPO_PUBLIC_API_URL;

  // is image viewer open
  // file url
  const fileUrl = content.startsWith('file') ? content : `${apiHost}${content}`;

  return (
    <View>
      {/* status bar */}
      <Modal
        animationType='fade'
        transparent={true}
        visible={isImageViewerOpen}
        onRequestClose={handleClick}
        hardwareAccelerated={true}
      >
        <GestureHandlerRootView>
          {/* moadal header */}
          <SafeAreaView style={styles.modalHeader}>
            {/* back button */}
            <TouchableOpacity onPress={handleClick}>
              <Icon name='chevron-back' size={35} color='white' />
            </TouchableOpacity>

            {/* image sender and msg time */}
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <Text style={styles.messageSenderName}>{messageSenderName}</Text>
              <Text style={styles.messageTime}>{messageTime}</Text>
            </View>

            {/* image options */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
              {/* forward image */}
              <TouchableOpacity>
                <Icon name='return-up-forward' size={28} color='white' />
              </TouchableOpacity>

              {/* image options menu*/}
              <TouchableOpacity onPress={toggleMenu}>
                <EnTypoIcon name='dots-three-vertical' size={20} color='white' />
              </TouchableOpacity>
            </View>

            {/* Menu Dropdown */}
            <ImageOptionsDropdown
              visible={showMenu}
              onClose={() => setShowMenu(false)}
              onShare={handleShare}
              onSave={handleSave}
              onDelete={handleDelete}
            />
          </SafeAreaView>

          <View style={styles.modalImageContainer}>
            <GestureDetector gesture={swipeUpGesture}>
              <Image source={{ uri: fileUrl }} style={styles.imageOpen} />
            </GestureDetector>
          </View>
        </GestureHandlerRootView>

        {/* modal end */}
      </Modal>

      {/* image container */}
      <TouchableOpacity onPress={handleClick} style={styles.imageContainer}>
        <FileMsgUploadIndicator _id={msg._id} />
        <Image source={fileUrl} style={styles.image} autoplay={true} />
      </TouchableOpacity>
    </View>
  );
};

export default ImageMsgViewer;

// styles sheet
const styles = StyleSheet.create({
  modalImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  },
  // modal header
  modalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    // height: 50, // Remove fixed height
    backgroundColor: 'black', // or any color you prefer
    paddingHorizontal: 10,
    paddingBottom: 10, // Add some bottom padding
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  // image container
  imageContainer: {
    position: 'relative',
  },
  image: {
    margin: 2,
    marginTop: 7,
    borderRadius: 7,
    width: 200,
    height: 200,
  },
  // image open styles
  imageOpen: {
    width: '100%',
    height: '50%',
    resizeMode: 'contain',
  },

  // modal header content color
  messageSenderName: {
    color: 'white',
    fontFamily: 'BalooBhaijaan2',
  },

  // message time
  messageTime: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'BalooBhaijaan2',
  },
});
