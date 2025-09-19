// basic imports
import React, { FC } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ChatMessage, MessageStatus, MessagesTypes } from '@/interfaces/chats';
import VoiceMsgPlayer from '../VoiceMsgPlayer';
import ImageMsgViewer from '../ImageMsgViewer';
import { useAuthStore } from '@/store/zuAuth';
import VideoScreen from '../VideoMsgViewer';
import ReadCheckIcon from '@/assets/icons/check-read.png';
import SentCheckIcon from '@/assets/icons/check.png';
import DocMessage from '../DocMessage';
import { getTime, TimeUnits } from '@/utils/time';

const ChatMessageViewer: FC<{ msg: ChatMessage }> = ({ msg }) => {
  const { sender, content, _id, status, type, date } = msg;

  // message time
  const messageTime = getTime(date, TimeUnits.time);
  // get current logged in user
  const loggedInUser = useAuthStore().currentUser;
  // deconstruct messages status
  const { DELEVERED, READED, SENT } = MessageStatus;

  // i want to check if the message is from me or not
  const isFromMe = loggedInUser?._id === sender._id;
  return (
    <View style={[styles.container, isFromMe ? styles.myMessage : styles.theirMessage]} key={_id}>
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
      <View style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
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
        <Text style={{ fontSize: 10, color: 'gray', fontFamily: 'BalooBhaijaan2' }}>{messageTime}</Text>
      </View>
    </View>
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
    backgroundColor: '#0d6efd26',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'BalooBhaijaan2',
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
