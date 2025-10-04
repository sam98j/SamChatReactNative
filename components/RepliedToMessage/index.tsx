import React, { FC } from 'react';
import { MessagesTypes, ResponseToMessageData } from '@/interfaces/chats';
import { StyleSheet, Text, View } from 'react-native';

type MsgData = ResponseToMessageData;

const RepliedToMessage: FC<{ msgData: MsgData }> = ({ msgData }) => {
  // message types
  const { FILE, PHOTO, TEXT, VIDEO, VOICENOTE } = MessagesTypes;
  // message data
  const { content, fileName, sender, type } = msgData;
  return (
    <View style={styles.container}>
      <Text style={[styles.sender, styles.fontFamily]}>{sender.name}</Text>
      <Text style={[styles.content, styles.fontFamily]}>
        {type === TEXT && content}
        {type === PHOTO && 'Photo'}
        {type === VIDEO && 'Video'}
        {type === VOICENOTE && 'Voice Note'}
        {type === FILE && fileName}
      </Text>
    </View>
  );
};

export default RepliedToMessage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB', // Tailwind 'gray-50'
    padding: 4, // Tailwind 'p-1' (4px)
    borderRadius: 10,
  },
  sender: {
    color: '#60A5FA', // Tailwind 'blue-400'
    fontWeight: '600',
    marginBottom: 2,
    fontSize: 14,
  },
  content: {
    color: '#6B7280', // Tailwind 'gray-500'
    fontSize: 14,
  },

  // font family
  fontFamily: {
    fontFamily: 'BalooBhaijaan2',
  },
});
