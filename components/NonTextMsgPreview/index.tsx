import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type NonTextMsgPreviewProps = {
  type: 'image' | 'video' | 'audio' | 'file';
  contentUri: string; // URI of the content (e.g., image, video, or file)
  fileName?: string; // Optional file name for files
};

const NonTextMsgPreview: React.FC<NonTextMsgPreviewProps> = ({ type, contentUri, fileName }) => {
  const renderPreview = () => {
    switch (type) {
    case 'image':
      return <Image source={{ uri: contentUri }} />;
    case 'video':
      return (
        <View style={styles.previewContainer}>
          <Icon name='videocam' size={30} color='dodgerblue' />
          <Text style={styles.previewText}>Video Preview</Text>
        </View>
      );
    case 'audio':
      return (
        <View style={styles.previewContainer}>
          <Icon name='musical-notes' size={30} color='dodgerblue' />
          <Text style={styles.previewText}>Audio Message</Text>
        </View>
      );
    case 'file':
      return (
        <View style={styles.previewContainer}>
          <Icon name='document' size={20} color='dodgerblue' />
          <Text style={styles.previewText}>{fileName || 'File Attachment'}</Text>
        </View>
      );
    default:
      return <Text style={styles.previewText}>Unsupported Message Type</Text>;
    }
  };

  return <View>{renderPreview()}</View>;
};

export default NonTextMsgPreview;

const styles = StyleSheet.create({
  previewContainer: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'center',
    gap: 10,
  },
  previewText: {
    fontSize: 14,
    color: '#555',
  },
});
