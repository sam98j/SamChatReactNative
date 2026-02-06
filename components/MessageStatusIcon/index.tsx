import React from 'react';
import { Image, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MessageStatus } from '@/interfaces/chats';
import ReadCheckIcon from '@/assets/icons/check-read.png';
import SentCheckIcon from '@/assets/icons/check.png';

type MessageStatusIconProps = {
  status: MessageStatus | null;
};

const MessageStatusIcon: React.FC<MessageStatusIconProps> = ({ status }) => {
  const { DELEVERED, READED, SENT } = MessageStatus;

  return (
    <>
      {status === DELEVERED && <Image source={ReadCheckIcon} style={styles.messageDelevered} />}
      {status === READED && <Image source={ReadCheckIcon} style={styles.messageReaded} />}
      {status === SENT && <Image source={SentCheckIcon} style={styles.messageSent} />}
      {status === null && <MaterialIcon name='clock-time-nine-outline' color={'dodgerblue'} size={15} />}
    </>
  );
};

export default MessageStatusIcon;

const styles = StyleSheet.create({
  messageSent: {
    width: 20,
    height: 20,
    tintColor: 'gray',
  },
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
