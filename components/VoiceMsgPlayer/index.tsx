// basic imports
import React, { useEffect, useState, FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, DimensionValue } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useChatSounds } from '@/hooks/sounds';
import Icon from 'react-native-vector-icons/Ionicons';
import { ChatMessage } from '@/interfaces/chats';
import { useAudioPlayer } from 'expo-audio';
import { secondsToDurationConverter } from '@/utils/time';

// component props
type Props = {
  msg: ChatMessage;
};

const VoiceMsgPlayer: FC<Props> = ({ msg }) => {
  // api url
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { voiceNoteDuration, content } = msg;
  // progress bar ref
  const progressRef = React.useRef<View>(null);
  // expo audio imports
  const player = useAudioPlayer(apiUrl + content);
  // width
  const [progressWidth, setProgressWidth] = useState('0');

  console.log('VoiceMsgPlayer rendered');
  // get audio player status
  // expo audio player status
  // progress bar width
  // get current user from store
  // is audio playing state
  const [isPlaying, setIsPlaying] = useState(false);
  // voice note duration in seconds
  const [voiceNoteDurationMillis, setVoiceNoteDurationMillis] = useState(0);
  // handle audio play/pause
  const handlePress = () => {
    // if it's playing, pause it
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
      return;
    }
    // if it's not playing, play it
    player.play();
    setIsPlaying(true);
  };
  // play audio
  // intervalId
  let intervalId: number;
  // observe isPlaying
  useEffect(() => {
    if (!isPlaying) return;
    let counter = 0;
    // terminate if it's not playing
    // interval
    intervalId = setInterval(() => {
      counter++;
      // log counter
      console.log('Counter:', counter);
      // log isPlaying
      const progressWidth = `${(counter / Number(voiceNoteDuration)) * 100}%`;

      progressRef.current?.setNativeProps({ style: { width: progressWidth } });
      // check if counter is greater than or eqaul to voiceNoteDuration
      if (!Boolean(counter >= Number(voiceNoteDuration))) return;
      clearInterval(intervalId);
      setIsPlaying(false);
      progressRef.current?.setNativeProps({ style: { width: '0%' } });
      // update progress bar width
      // calculate progress width;
    }, 1000);
  }, [isPlaying]);
  // log content
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.playButton}>
        {isPlaying && <Icon name='pause' size={30} color='gray' />}
        {/* if it's not playing */}
        {!isPlaying && <Icon name='play' size={30} color='gray' onPress={handlePress} />}
      </TouchableOpacity>
      <View style={styles.progressContainer}>
        <View style={[styles.progress]} ref={progressRef}></View>
      </View>
      <View>
        <Text style={{ fontSize: 12, color: 'gray', fontFamily: 'BalooBhaijaan2' }}>
          {secondsToDurationConverter(Number(voiceNoteDuration))}
        </Text>
      </View>
    </View>
  );
};

export default VoiceMsgPlayer;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    fontFamily: 'BalooBhaijaan2',
    width: '100%',
  },
  playButton: {
    height: 45,
    width: 45,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22.5,
  },
  progressContainer: {
    flex: 1,
    height: 5,
    backgroundColor: '#ddd',
    width: 400,
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#007bff',
    width: '0%',
  },
});
