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
    // terminate if it's cancled
    if (result.canceled) return '';
    // selected file
    const { uri, fileName, fileSize, mimeType } = result.assets[0];
    // return
    return { uri, fileName, mimeType, fileSize };
  };
  // pick a video
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // terminate if it's cancled
    if (result.canceled) return '';
    // selected file
    const { uri, fileName, fileSize, mimeType } = result.assets[0];
    // return
    return { uri, fileName, mimeType, fileSize };
  };

  // pick a file
  const pickFile = async () => {
    const result = await FilePicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
      multiple: false,
    });
    // terminate if it's cancled
    if (result.canceled) return '';
    // selected file
    const { uri, name, mimeType, size } = result.assets[0];
    // return
    return { uri, name, mimeType, size };
  };
  // retturn
  return { pickImage, pickVideo, pickFile };
};
