import { ChatMessage } from '@/interfaces/chats';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Modal, StatusBar, TouchableOpacity, Text } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import EnTypoIcon from 'react-native-vector-icons/Entypo';
import VideoThumbnail from '../VideoThumbnail';
import FileMsgUploadIndicator from '../FileMsgUploadIndicator';

// props
type Props = {
  msg: ChatMessage;
};

const VideoScreen = ({ msg }: Props) => {
  // api host
  const apiHost = process.env.EXPO_PUBLIC_API_URL;
  // is image viewer open useState
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  // handle click to open image viewer and close it if it is already open
  const handleClick = () => setIsVideoPlayerOpen(!isVideoPlayerOpen);
  // swipe up detection
  const swipeUpGesture = Gesture.Pan().onEnd((event) => {
    const { velocityY, translationY } = event;
    if (translationY < -50 && velocityY < -200) {
      // close image viewer
      runOnJS(setIsVideoPlayerOpen)(false);
    }
  });
  // destructure message
  const { content, _id } = msg;
  // file url
  const fileUrl = content.startsWith('file') ? content : `${apiHost}${content}`;

  const player = useVideoPlayer(fileUrl, () => {
    // player.loop = true;
    // player.play();
  });

  // observe isVideoPlayerOpen
  useEffect(() => {
    // if isVideoPlayerOpen is true, play the video
    if (isVideoPlayerOpen) return player.play();
    // otherwise pause the video
    player.pause();
  }, [isVideoPlayerOpen]);

  return (
    <View>
      {/* modal */}
      <Modal animationType='fade' transparent={true} visible={isVideoPlayerOpen} onRequestClose={handleClick}>
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
          {/* modal image container */}
          <View style={styles.modalVideoContainer}>
            <GestureDetector gesture={swipeUpGesture}>
              <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
            </GestureDetector>
          </View>
        </GestureHandlerRootView>
      </Modal>
      <TouchableOpacity onPress={handleClick} style={styles.videoThumbnail}>
        <FileMsgUploadIndicator _id={_id} />
        <VideoThumbnail videoUri={fileUrl} />
      </TouchableOpacity>
    </View>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '50%',
  },
  controlsContainer: {
    padding: 10,
  },
  modalVideoContainer: {
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
  // vido thumbnail
  videoThumbnail: {
    position: 'relative',
  },
});
