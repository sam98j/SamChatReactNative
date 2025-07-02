import { AudioModule, RecordingPresets, useAudioPlayer, useAudioRecorder } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

// create a custom hook to play a sound
export function useChatSounds() {
  // expo recorder
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  // is recording
  const [isRecording, setIsRecording] = useState<boolean>(false);
  // recording uri
  // recording audio
  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };
  // stop recording
  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
    const recordingUri = audioRecorder.uri;
    const audioTime = audioRecorder.getStatus().durationMillis;
    // log recording uri
    return { recordingUri, audioTime };
  };
  // component did mount
  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }
    })();
  }, []);
  // playSentMessageSound
  const playSentMessageSound = () => {
    // play the audio file using Expo Audio
    // play the sound
  };

  return { playSentMessageSound, record, stopRecording };
  // return the audioplayer instance
}

export const usePlayChatSound = () => {
  const audioFilePath = require('@/assets/sounds/uggg_sent_message.mp3');
  // use the audio player hook from expo
  const audioPlayer = useAudioPlayer(audioFilePath);

  // play the sound
  const playReceivedMessageSound = () => {
    try {
      console.log('Playing received message sound');
      audioPlayer.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  return { playReceivedMessageSound };
};
