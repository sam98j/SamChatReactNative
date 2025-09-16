// basice picker
import * as ImagePicker from 'expo-image-picker';
import * as FilePicker from 'expo-document-picker';

// use file picker
export const useFilePicker = () => {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) return { uri: result.assets[0].uri, name: result.assets[0].fileName || 'image.jpg' };
    return '';
  };
  // pick a video
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) return { uri: result.assets[0].uri, name: result.assets[0].fileName || 'video.mp4' };
    return '';
  };

  // pick a file
  const pickFile = async () => {
    const result = await FilePicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (!result.canceled) return { uri: result.assets[0].uri, name: result.assets[0].name };
    return '';
  };
  // retturn
  return { pickImage, pickVideo, pickFile };
};
