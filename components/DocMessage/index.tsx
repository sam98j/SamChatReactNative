import { ChatMessage } from '@/interfaces/chats';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FileMsgUploadIndicator from '../FileMsgUploadIndicator';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as IntentLauncher from 'expo-intent-launcher';

interface DocMessageProps {
  msg: ChatMessage;
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const DocMessage: React.FC<DocMessageProps> = ({ msg }) => {
  const { fileName, fileSize, content } = msg;
  //   file type
  const fileExtension = fileName?.split('.').pop()?.toUpperCase() || '';
  const fileType = fileExtension || 'FILE';

  //   file url
  const fileUrl = content.startsWith('file') ? content : `${apiUrl}/${content}`;

  //   handle press to open the file
  const handlePress = async () => {
    // terminate if no content
    if (!content) return;

    try {
      let localUri = fileUrl;

      // If it's a remote URL, download it first
      if (!fileUrl.startsWith('file://')) {
        const destinationPath = `${FileSystem.cacheDirectory}${fileName || 'downloaded_file'}`;
        const downloadResult = await FileSystem.downloadAsync(fileUrl, destinationPath);
        localUri = downloadResult.uri;
      }

      // open file on android
      if (Platform.OS === 'android') {
        const cUri = await FileSystem.getContentUriAsync(localUri);
        
        // Simple MIME type resolution
        const mimeMap: { [key: string]: string } = {
          'PDF': 'application/pdf',
          'EPUB': 'application/epub+zip',
          'JPG': 'image/jpeg',
          'JPEG': 'image/jpeg',
          'PNG': 'image/png',
          'TXT': 'text/plain',
        };

        // Get the MIME type based on the file extension
        const mimeType = mimeMap[fileExtension] || '*/*';

        // Open the file
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: cUri,
          flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
          type: mimeType,
        });
        // terminate
        return;
      } 
      
      // Other platforms (iOS) or fallback
      const isSharingAvailable = await Sharing.isAvailableAsync();

      // terminate if sharing is not available
      if (!isSharingAvailable) return Alert.alert('Error', 'Sharing is not available on this device');

      // share the file
      await Sharing.shareAsync(localUri, {
        mimeType: undefined,
        dialogTitle: fileName || 'Open file',
        UTI: undefined,
      });
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', 'Could not open the file');
    }
  };

  // render
  return (
    <View style={styles.container}>
      {/* file data container */}
      <TouchableOpacity onPress={handlePress} style={{ width: '100%' }}>
        {/* icon container */}
        <View style={styles.iconContainer}>
          <Ionicons name='document-text-outline' size={25} color='dodgerblue' />
          <Text style={[styles.title, styles.fontFamily]}>{fileName}</Text>
        </View>
        {/* file type and size container*/}
        <View style={styles.fileInfoContainer}>
          <Text style={[styles.description, styles.fontFamily]}>{fileType}</Text>
          <Text>-</Text>
          <Text style={[styles.description, styles.fontFamily]}>{fileSize}KB</Text>
        </View>
      </TouchableOpacity>
      {/* file uplaod indicator container */}
      <View style={styles.fileMsgUploadIndicatorContainer}>
        <FileMsgUploadIndicator _id={msg._id} isFile={true} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  //   icon container
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  // file info container
  fileInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 6,
    gap: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },
  fontFamily: { fontFamily: 'BalooBhaijaan2' },
  //   file msg upload indicator container
  fileMsgUploadIndicatorContainer: {
    width: '15%',
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
  },
});

export default DocMessage;
