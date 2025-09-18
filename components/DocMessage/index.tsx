import { ChatMessage } from '@/interfaces/chats';
import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FileMsgUploadIndicator from '../FileMsgUploadIndicator';

interface DocMessageProps {
  msg: ChatMessage;
}

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const DocMessage: React.FC<DocMessageProps> = ({ msg }) => {
  const { fileName, fileSize, content } = msg;
  //   file type
  const fileType = fileName?.split('.').pop()?.toUpperCase() || 'FILE';
  // TODO: file dosen't opon with expo url
  //   file url
  const fileUrl = content.startsWith('file') ? content : `${apiUrl}/${content}`;
  //   handle press to open the file
  const handlePress = () => {
    // terminate if no content
    if (!content) return;
    // open the file link
    Linking.openURL(fileUrl);
    console.log('Opening file:', fileUrl);
  };
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
