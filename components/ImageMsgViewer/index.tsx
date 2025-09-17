import { ChatMessage } from '@/interfaces/chats';
import React, { useState } from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity, Modal, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import EnTypoIcon from 'react-native-vector-icons/Entypo';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

// props
type Props = {
  msg: ChatMessage;
};

const ImageMsgViewer: React.FC<Props> = ({ msg }) => {
  // destructure message
  const { content } = msg;
  // is image viewer open useState
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  // handle click to open image viewer and close it if it is already open
  const handleClick = () => setIsImageViewerOpen(!isImageViewerOpen);
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
  const [fileUrl] = useState(() => {
    // check if content contain http
    if (content.includes('data:')) return content;
    // otherwize
    return `${apiHost}${content}`;
  });
  return (
    <View>
      {/* status bar */}
      <Modal animationType='fade' transparent={true} visible={isImageViewerOpen} onRequestClose={handleClick}>
        <StatusBar backgroundColor={'black'} animated={true} barStyle='light-content' />
        <GestureHandlerRootView>
          {/* moadal header */}
          <View style={styles.modalHeader}>
            {/* back button */}
            <TouchableOpacity onPress={handleClick}>
              <Icon name='chevron-back' size={35} color='white' />
            </TouchableOpacity>
            {/* image sender and msg time */}
            <View style={{ flex: 1, alignItems: 'flex-start' }}>
              <Text style={{ color: 'white', fontFamily: 'BalooBhaijaan2' }}>HosamAlden Mustafa</Text>
              <Text style={{ color: 'white', fontFamily: 'BalooBhaijaan2', fontSize: 12 }}>today at 12:00 PM</Text>
            </View>
            {/* image options */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
              <TouchableOpacity>
                <Icon name='return-up-forward' size={28} color='white' />
              </TouchableOpacity>
              {/* image options */}
              <TouchableOpacity>
                <EnTypoIcon name='dots-three-vertical' size={20} color='white' />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.modalImageContainer}>
            <GestureDetector gesture={swipeUpGesture}>
              <Image source={{ uri: fileUrl }} style={styles.imageOpen} />
            </GestureDetector>
          </View>
        </GestureHandlerRootView>
      </Modal>
      <TouchableOpacity onPress={handleClick}>
        <Image source={{ uri: fileUrl }} style={styles.image} />
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
    height: 50,
    backgroundColor: 'black', // or any color you prefer
    paddingHorizontal: 10,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
});
