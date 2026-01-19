import { useChatsStore } from '@/store/chatsStore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import i18n from '@/i18n';
import { MessagesTypes } from '@/interfaces/chats';
import { Image } from 'expo-image';
import VideoThumbnail from '../VideoThumbnail';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming, WithTimingConfig } from 'react-native-reanimated';

const ResponseToMsgPopUp = () => {
  // api url
  const apiHost = process.env.EXPO_PUBLIC_API_URL;

  // response to message from zustand zuChats
  const { responseToMessage, setResponseToMessage } = useChatsStore();

  // local state to keep message during animation
  const [localResponseMsg, setLocalResponseMsg] = useState(responseToMessage);

  // height animation
  const height = useSharedValue(0);

  // observe response to message
  useEffect(() => {
    // timing config
    const timingConfig: WithTimingConfig = { duration: 150, easing: Easing.inOut(Easing.quad) };

    // show response to message
    if (responseToMessage) {
      setLocalResponseMsg(responseToMessage);
      height.value = withTiming(-50, timingConfig);

      // termenate
      return;
    }

    // reset height
    height.value = withTiming(0, timingConfig, finished => finished && runOnJS(setLocalResponseMsg)(null));
  }, [responseToMessage]);

  // animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: height.value }],
    };
  });

  //   response to message type
  const { PHOTO, VIDEO, VOICENOTE, FILE, TEXT } = MessagesTypes;

  //   image  url
  const imageUrl = localResponseMsg?.content.startsWith('http')
    ? localResponseMsg?.content
    : `${apiHost}/${localResponseMsg?.content}`;

  //   pref local from i18n
  const prefLocal = i18n.locale;

  //   if no local message return null (nothing to animate)
  if (!localResponseMsg) return null;

  return (
    <Animated.View
      style={[
        styles.responseToMsgPopUp,
        animatedStyle,
        prefLocal === 'ar' && styles.rtlDir
      ]}
    >
      {/* close icon */}
      <TouchableOpacity style={{ backgroundColor: '#ddd', borderRadius: 50 }} onPress={() => setResponseToMessage(null)}>
        <Icon name='close' size={20} color='gray' />
      </TouchableOpacity>

      {/* response to message sender name */}
      <View style={styles.msgDetailsContainer}>
        {/* msg sender name */}
        <View style={styles.msgSenderNameContainer}>
          <Text style={styles.fontFamily}>{i18n.t('openedChat.response-to-msg-popup.replying-to')}</Text>
          <Text style={[styles.fontFamily, styles.msgSenderName]}>{localResponseMsg.sender.name}</Text>
        </View>

        {/* msg type */}
        <Text style={[styles.fontFamily, styles.msgType]}>
          {localResponseMsg.type === PHOTO && i18n.t('openedChat.response-to-msg-popup.photo-msg-type')}
          {localResponseMsg.type === VIDEO && i18n.t('openedChat.response-to-msg-popup.video-msg-type')}
          {localResponseMsg.type === TEXT && localResponseMsg.content}
          {localResponseMsg.type === VOICENOTE && i18n.t('openedChat.response-to-msg-popup.audio-msg-type')}
          {localResponseMsg.type === FILE && i18n.t('openedChat.response-to-msg-popup.file-msg-type')}
        </Text>
      </View>

      {/* photo msg preview */}
      {localResponseMsg && localResponseMsg.type === PHOTO && (
        <View style={styles.photoMsgPreviewContainer}>
          <Image source={{ uri: imageUrl }} style={styles.photoMsgPreview} />
        </View>
      )}

      {/* video msg preview */}
      {localResponseMsg && localResponseMsg.type === VIDEO && (
        <View style={styles.photoMsgPreviewContainer}>
          <VideoThumbnail videoUri={imageUrl} style={styles.photoMsgPreview} />
        </View>
      )}

      {/* file msg preview */}
      {localResponseMsg && localResponseMsg.type === FILE && (
        <View style={styles.photoMsgPreviewContainer}>
          <Icon name='document-text-outline' size={30} color='dodgerblue' />
        </View>
      )}
    </Animated.View>
  );
};

export default ResponseToMsgPopUp;

// styles sheet
const styles = StyleSheet.create({
  responseToMsgPopUp: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#eee',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 50,
    borderTopColor: '#ddd',
    padding: 10,
    borderTopWidth: 0.5,
  },

  //   msg sender name styles
  msgSenderNameContainer: { flexDirection: 'row', gap: 5 },
  msgSenderName: { color: 'dodgerblue' },
  msgType: { color: 'gray', fontSize: 16 },
  msgDetailsContainer: { paddingVertical: 4, flex: 1 },
  fontFamily: { fontFamily: 'BalooBhaijaan2' },

  //   photo msg preview container
  photoMsgPreviewContainer: {
    top: 0,
    position: 'absolute',
    width: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    padding: 2,
    marginVertical: 5,
    left: 10,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },

  //   photo msg preview styles
  photoMsgPreview: { width: '100%', height: '100%', borderRadius: 10 },

  // rtl dir
  rtlDir: {
    direction: 'rtl'
  }
});

