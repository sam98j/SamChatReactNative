// basic imports
import React, { useEffect, useState, FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ChatMessage } from '@/interfaces/chats';
import { useAudioPlayer } from 'expo-audio';
import { secondsToDurationConverter } from '@/utils/time';

// component props
type Props = { msg: ChatMessage };

// intervalId
let intervalId: number;

const VoiceMsgPlayer: FC<Props> = ({ msg }) => {
  // api url
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // get voiceNoteDuration and content from msg
  const { voiceNoteDuration, content } = msg;

  // progress bar ref
  const progressRef = React.useRef<View>(null);

  // voice note url
  const voiceNoteUrl = content.startsWith('file') ? content : apiUrl + content;

  // expo audio imports
  const player = useAudioPlayer(voiceNoteUrl);

  // is audio playing state
  const [isPlaying, setIsPlaying] = useState(false);

  // handle audio play/pause
  const handlePress = () => {

    // if it's playing, pause it
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
      return;
    }

    // if it's not playing, play it
    player.seekTo(0);
    player.play();
    setIsPlaying(true);

  };

  // observe isPlaying
  useEffect(() => {

    // if it's not playing, clear interval and reset isPlaying
    if (!isPlaying) {
      clearInterval(intervalId);
      setIsPlaying(false);
      return;
    };

    // interval
    intervalId = setInterval(() => {

      // player current time
      const currentTime = player.currentStatus.currentTime;

      // calculate progress width
      const progressWidth = `${(currentTime / Number(voiceNoteDuration)) * 100}%`;

      // update progress bar width
      progressRef.current?.setNativeProps({ style: { width: progressWidth } });

      // check if currentTime is greater than or eqaul to voiceNoteDuration
      if (!(currentTime >= Number(voiceNoteDuration))) return;

      // reset all
      clearInterval(intervalId);
      setIsPlaying(false);
      progressRef.current?.setNativeProps({ style: { width: '0%' } });
    }, 1000);
  }, [isPlaying]);

  return (
    <View style={styles.container}>

      {/* play / pause button */}
      <TouchableOpacity style={styles.playButton}>
        <Icon name={isPlaying ? 'pause' : 'play'} size={30} color='gray' onPress={handlePress} />
      </TouchableOpacity>

      {/* progress bar */}
      <View style={[styles.progressContainer, { width: '65%' }]}>
        <View style={[styles.progress]} ref={progressRef}></View>
      </View>

      {/* voice note duration */}
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
    width: '80%',
    marginRight: '20%',
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
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: 'dodgerblue',
    width: '0%',
  },
});
