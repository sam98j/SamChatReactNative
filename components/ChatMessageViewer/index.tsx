// basic imports
import React, { FC } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ChatMessage, MessageStatus, MessagesTypes, ResponseToMessageData } from '@/interfaces/chats';
import VoiceMsgPlayer from '../VoiceMsgPlayer';
import ImageMsgViewer from '../ImageMsgViewer';
import { useAuthStore } from '@/store/authStore';
import VideoScreen from '../VideoMsgViewer';
import ReadCheckIcon from '@/assets/icons/check-read.png';
import SentCheckIcon from '@/assets/icons/check.png';
import DocMessage from '../DocMessage';
import { getTime, TimeUnits } from '@/utils/time';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useChatsStore } from '@/store/chatsStore';
import RepliedToMessage from '../RepliedToMessage';
import * as Haptics from 'expo-haptics';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatMessageViewer: FC<{ msg: ChatMessage }> = ({ msg }) => {
  const { sender, content, _id, status, type, date, voiceNoteDuration, fileName, msgReplyedTo, isForwarded } = msg;

  // screen width
  const SCREEN_WIDTH = Dimensions.get('window').width;

  // max drag
  const MAX_DRAG = SCREEN_WIDTH / 4;

  // message time
  const messageTime = getTime(date, TimeUnits.time);

  // get current logged in user
  const loggedInUser = useAuthStore().currentUser;

  // zustand chats
  const { setResponseToMessage, setMsgsActionsMenu } = useChatsStore();

  // deconstruct messages status
  const { DELEVERED, READED, SENT } = MessageStatus;

  // translate x value for swipe gesture
  const translateX = useSharedValue(0);

  // gesture handler
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      // Clamp the value between -MAX_DRAG and MAX_DRAG
      let nextX = ctx.startX + event.translationX;
      if (nextX > MAX_DRAG) nextX = MAX_DRAG;
      if (nextX < -MAX_DRAG) nextX = -MAX_DRAG;
      translateX.value = nextX;
    },
    onEnd: (event) => {
      if (event.translationX < SCREEN_WIDTH / 2) return (translateX.value = withSpring(0));
      console.log('ended');
      translateX.value = withSpring(0);
      // Snap back to 0 or apply spring
      // response to message
      const responseToMessageData: ResponseToMessageData = {
        sender,
        voiceNoteDuration,
        _id,
        type,
        content,
        fileName,
      };
      // dispatch
      runOnJS(setResponseToMessage)(responseToMessageData);
      // haptic feedback
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    },
  });

  // animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // i want to check if the message is from me or not
  const isFromMe = loggedInUser?._id === sender._id && !isForwarded;

  // handle long press on message
  const handleMsgLongPress = () => setMsgsActionsMenu(msg._id);

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.container, isFromMe ? styles.myMessage : styles.theirMessage, animatedStyle]} key={_id}>
        {/* forwarded icon */}
        {isForwarded && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon name='return-up-forward' size={20} color='gray' />
            <Text style={{ color: 'gray', fontFamily: 'BalooBhaijaan2' }}>Forwarded</Text>
          </View>
        )}

        {/* container */}
        <TouchableOpacity onLongPress={handleMsgLongPress} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* replied to message */}
          {msgReplyedTo && <RepliedToMessage msgData={msgReplyedTo as ResponseToMessageData} />}
          {/* Text */}
          {type === MessagesTypes.TEXT && <Text style={styles.messageText}>{content}</Text>}
          {/* voice note message viewer */}
          {type === MessagesTypes.VOICENOTE && <VoiceMsgPlayer msg={msg} />}
          {/* image message viewer */}
          {type === MessagesTypes.PHOTO && <ImageMsgViewer msg={msg} />}
          {/* video message viewer */}
          {type === MessagesTypes.VIDEO && <VideoScreen msg={msg} />}
          {/* document message viewer */}
          {type === MessagesTypes.FILE && <DocMessage msg={msg} />}

          {/* message data */}
          {/* <View style={{width: '20%',  flexGrow: 1}}> */}
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', position: 'absolute', bottom: 5, right: 5 }}>
            {/* message status */}
            {isFromMe && (
              <View>
                {/* svg icon from assets as image */}
                {status === DELEVERED && <Image source={ReadCheckIcon} style={styles.messageDelevered} />}
                {/* check or msg status readed */}
                {status === READED && <Image source={ReadCheckIcon} style={styles.messageReaded} />}
                {/* check or msg status sent */}
                {status === SENT && <Image source={SentCheckIcon} style={styles.messageSent} />}
                {/* check for msg status null */}
                {msg.status === null && <MaterialIcon name='clock-time-nine-outline' color={'dodgerblue'} size={15} />}
              </View>
            )}
            {/* message time */}
            <Text style={{ fontSize: 10, color: 'gray', fontFamily: 'BalooBhaijaan2' }}>{messageTime}</Text>
          </View>
          {/* </View> */}
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default ChatMessageViewer;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginVertical: 5,
    maxWidth: '85%',
    paddingHorizontal: 5,
    paddingVertical: 2.5,
  },
  myMessage: {
    backgroundColor: '#eee',
    color: 'white',
    alignSelf: 'flex-start',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
  },
  theirMessage: {
    borderRadius: 10,
    borderBottomRightRadius: 0,
    backgroundColor: '#f6faffff',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'BalooBhaijaan2',
    marginRight: '20%',
  },
  // message status sent styles
  messageSent: {
    width: 20,
    height: 20,
    tintColor: 'gray',
  },
  // message delevered styles
  messageDelevered: {
    width: 20,
    height: 20,
    tintColor: 'gray',
  },
  messageReaded: {
    width: 20,
    height: 20,
    tintColor: 'dodgerblue',
  },
});
