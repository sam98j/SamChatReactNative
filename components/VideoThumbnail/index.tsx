import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Text } from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';

type VideoThumbnailProps = {
  videoUri: string;
  style?: object;
};

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ videoUri, style }) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const generateThumbnail = async () => {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, { time: 1000 });
        if (isMounted) {
          setThumbnail(uri);
        }
      } catch (e) {

        setThumbnail(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    generateThumbnail();
    return () => {
      isMounted = false;
    };
  }, [videoUri]);

  if (loading) {
    return (
      <View style={[styles.thumbnail, style, styles.center]}>
        <ActivityIndicator size='small' color='#888' />
      </View>
    );
  }

  if (!thumbnail) {
    return (
      <View style={[styles.thumbnail, style, styles.center]}>
        <Text>Thumbnail not found</Text>
      </View>
    );
  }

  return <Image source={{ uri: thumbnail }} style={[styles.thumbnail, style]} resizeMode='cover' />;
};

export default VideoThumbnail;

const styles = StyleSheet.create({
  thumbnail: {
    width: 200,
    height: 300,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
