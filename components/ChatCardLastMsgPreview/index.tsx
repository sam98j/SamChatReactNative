import { ChatMessage, MessagesTypes } from '@/interfaces/chats';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import i18n from '@/i18n';
import Icon from 'react-native-vector-icons/Ionicons';

type ChatCardLastMsgPreviewProps = {
  lastMsg: Omit<ChatMessage, 'fileSize'>;
};

const ChatCardLastMsgPreview: React.FC<ChatCardLastMsgPreviewProps> = ({ lastMsg }) => {
  // destruct last message
  const { content, type, date, status } = lastMsg;
  //   destruct messages types
  const { TEXT, VOICENOTE, PHOTO, VIDEO } = MessagesTypes;
  //   last message container
  return (
    <View style={styles.container}>
      {/* if it's text message */}
      {type === TEXT && <Text style={styles.text}>{content}</Text>}
      {/* if it's voice note message */}
      {type === VOICENOTE && (
        <View style={styles.voice_note_container}>
          <Image source={require('@/assets/icons/sound.png')} style={{ width: 25, height: 25, tintColor: 'dodgerblue' }} />
          <Text style={styles.voice_note_text}>{i18n.t('chatCard.voice-note-preview-text')}</Text>
        </View>
      )}
      {/* if it's image message */}
      {type === PHOTO && (
        <View style={styles.voice_note_container}>
          <Icon name='image-outline' size={18} color='dodgerblue' />
          <Text style={styles.voice_note_text}>{i18n.t('chatCard.image-preview-text')}</Text>
        </View>
      )}
      {/* if it's video message */}
      {/* if it's image message */}
      {type === VIDEO && (
        <View style={styles.voice_note_container}>
          <Icon name='videocam-outline' size={18} color='dodgerblue' />
          <Text style={styles.voice_note_text}>{i18n.t('chatCard.video-preview-text')}</Text>
        </View>
      )}
    </View>
  );
};

export default ChatCardLastMsgPreview;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  text: {
    fontFamily: 'BalooBhaijaan2',
    color: 'gray',
  },
  voice_note_container: {
    color: 'gray',
    fontFamily: 'BalooBhaijaan2',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  voice_note_text: {
    color: 'gray',
    fontFamily: 'BalooBhaijaan2',
  },
});
