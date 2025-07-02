import { ChatMessage, MessagesTypes } from '@/interfaces/chats';
import { RootState } from '@/store';
import { MessagesGroubedByDate } from '@/utils/chats';
import React, { FC } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import ChatMessageViewer from '../ChatMessageViewer';
import { View } from 'react-native';

// component props
type Props = { messages: MessagesGroubedByDate };

const ChatMessagesLoader: FC<Props> = ({ messages }) => {
  // log messeages
  console.log('messages', !messages ? 'no messages' : messages);
  // get opened chat name
  const groupName = useSelector((state: RootState) => state.chatsSlice.openedChat?.name)!;
  return (
    <>
      {messages.dates?.map((date, i) => {
        return (
          <>
            {/* messages data */}
            <Text style={styles.messagesDate} key={Math.random()}>
              {date}
            </Text>
            {messages.messages[i].map((msg: ChatMessage) => {
              // destruct
              const { sender, actionMsgType, status } = msg;
              // log msg state
              // check for chat action message
              if (msg.type === MessagesTypes.ACTION) {
                // return <ChatActionMsg data={{ sender, actionMsgType, groupName }} key={msg._id} />;
              }
              // if it's a regular chat message
              return <ChatMessageViewer msg={msg} key={msg._id} />;
            })}
          </>
        );
      })}
    </>
  );
};

export default ChatMessagesLoader;

// style sheet
const styles = StyleSheet.create({
  messagesDate: {
    textAlign: 'center', // Align text to the center
    color: '#3b82f6', // Equivalent to 'blue.500'
    marginTop: 30, // Add top margin
    backgroundColor: '#ebf8ff', // Equivalent to 'blue.50'
    borderRadius: 10, // Rounded corners (equivalent to 'xl')
    padding: 3, // Padding inside the text
    alignSelf: 'center', // Center the text horizontally
    fontFamily: 'BalooBhaijaan2',
  },
});
