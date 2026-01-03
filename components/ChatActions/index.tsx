// boilerplate for react native component

import { ChatActionsTypes } from '@/interfaces/chats';
import { useChatsStore } from '@/store/chatsStore';
import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatActions = () => {
  // is current usr doing action
  const { isChatUsrDoingAction } = useChatsStore();
  // destructution rom isChatUsrDoingAction
  const { type } = isChatUsrDoingAction;
  // destructure chat action type
  const { TYPEING, RECORDING_VOICE } = ChatActionsTypes;
  // bounce animation for typing indicator bullets
  const BULLET_COUNT = 3;
  const DURATION = 250;
  const DELAY = 160;
  // create array of animated values
  const anims = useRef(Array.from({ length: BULLET_COUNT }, () => new Animated.Value(0))).current;

  // fading animation
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  // observe fade animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);
  // observe first bullet animation
  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -5,
            duration: DURATION,
            delay: i * DELAY,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: DURATION,
            useNativeDriver: true,
          }),
        ])
      )
    );
    animations.forEach((anim) => anim.start());
    return () => animations.forEach((anim) => anim.stop());
  }, [anims]);

  return (
    <View style={styles.container}>
      {/* typing indicator */}
      <View style={[styles.typingIndicator, type !== TYPEING && styles.hideElement]}>
        {anims.map((anim, i) => (
          <Animated.View key={i} style={[styles.bullet, { transform: [{ translateY: anim }] }]} />
        ))}
      </View>
      {/* voice recording type */}
      <View style={[styles.typingIndicator, type !== RECORDING_VOICE && styles.hideElement]}>
        {/* icon */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Icon name='mic' size={22} color='#ff4d4d' />
        </Animated.View>
      </View>
    </View>
  );
};

export default ChatActions;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    position: 'relative',
    marginVertical: 15,
  },
  messagesContainer: {
    padding: 8,
    width: 90,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  // typing indicator
  typingIndicator: {
    borderRadius: 8,
    padding: 10,
    width: 60,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomRightRadius: 0,
    backgroundColor: '#0d6efd26',
    alignSelf: 'flex-end',
  },
  // bullet
  bullet: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: 'gray',
    marginHorizontal: 2,
  },
  theirMessage: {
    borderRadius: 10,
    borderBottomRightRadius: 0,
    backgroundColor: '#0d6efd26',
    alignSelf: 'flex-end',
  },
  // hide element
  hideElement: {
    display: 'none',
  },
});
