import { AudioModule, RecordingPresets, useAudioPlayer, useAudioRecorder } from 'expo-audio';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import recieve_messages_sound from '@/assets/sounds/imessage_recieve.mp3';

// create a custom hook to play a sound
export function useChatSounds() {
  // expo recorder
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
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

  return { record, stopRecording };
}

export const usePlayChatSound = () => {
  // use the audio player hook from expo
  const audioPlayer = useAudioPlayer(recieve_messages_sound);

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
