// basic imports
import React, { useEffect, useState, FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ChatMessage } from '@/interfaces/chats';
import { useAudioPlayer } from 'expo-audio';
import { secondsToDurationConverter } from '@/utils/time';

// component props
type Props = { msg: ChatMessage };

const VoiceMsgPlayer: FC<Props> = ({ msg }) => {
  // api url
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  // get voiceNoteDuration and content from msg
  const { voiceNoteDuration, content } = msg;

  // progress bar ref
  const progressRef = React.useRef<View>(null);
  // expo audio imports
  const player = useAudioPlayer(apiUrl + content);



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
    player.play();
    setIsPlaying(true);
  };

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

      // log isPlaying
      const progressWidth = `${(counter / Number(voiceNoteDuration)) * 100}%`;

      progressRef.current?.setNativeProps({ style: { width: progressWidth } });
      // check if counter is greater than or eqaul to voiceNoteDuration
      if (!(counter >= Number(voiceNoteDuration))) return;
      clearInterval(intervalId);
      setIsPlaying(false);
      progressRef.current?.setNativeProps({ style: { width: '0%' } });
      // update progress bar width
      // calculate progress width;
    }, 1000);
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      {/* play / pause button */}
      <TouchableOpacity style={styles.playButton}>
        {isPlaying && <Icon name='pause' size={30} color='gray' />}
        {/* if it's not playing */}
        {!isPlaying && <Icon name='play' size={30} color='gray' onPress={handlePress} />}
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
    backgroundColor: '#007bff',
    width: '0%',
  },
});
