// old messages loading spinner react functional component
import React from 'react';
import { View } from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';

// component props is whatch isFetchingChatMessages
interface Props {
  isFetchingChatMessages: boolean;
}

const ChatMessagesLoadOldMsgSpin: React.FC<Props> = ({ isFetchingChatMessages }) => {
  return (
    <View style={{ paddingVertical: 20 }}>
      {isFetchingChatMessages ? <UIActivityIndicator size={20} color='gray' /> : null}
    </View>
  );
};

export default ChatMessagesLoadOldMsgSpin;
