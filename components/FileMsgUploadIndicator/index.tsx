import React, { FC, useEffect, useRef, useState } from 'react';
import { useChatsStore } from '@/store/zuChats';
import { StyleSheet, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/Feather';

interface Props {
  _id: string;
}

const FileMsgUploadIndicator: FC<Props> = ({ _id }) => {
  // file msg upload indicator ref
  const fileMsgUploadProgressRef = useRef<HTMLDivElement>(null);
  // redux store
  const { fileMessageUploadIndicator, chatMessages } = useChatsStore();
  // last chat message
  const lastChatMessage = chatMessages![chatMessages!.length! - 1];
  // is photo upload progress visible
  const [isUploadProgressVisable, setIsUploadProgressVisable] = useState(
    () => _id === lastChatMessage._id && lastChatMessage.status === null
  );

  // last message obsserver
  useEffect(() => {
    // terminate if no last message
    if (!lastChatMessage) return;
    setIsUploadProgressVisable(_id === lastChatMessage._id && lastChatMessage.status === null);
  }, [lastChatMessage]);

  // fileMessageUploadProgress observer
  useEffect(() => {
    // terminate if it's not avilable
    if (!fileMessageUploadIndicator) return;
    // photoMessageUploadProgressElement
    const photoMessageUploadProgressElement = fileMsgUploadProgressRef.current;
    // set the width of the element
    photoMessageUploadProgressElement?.style.setProperty('width', `${fileMessageUploadIndicator}%`);
  }, [fileMessageUploadIndicator]);

  return (
    <BlurView
      intensity={100}
      tint='dark'
      style={[styles.container, !isUploadProgressVisable && styles.hideFileMsgUploadIndicator]}
    >
      <AnimatedCircularProgress
        size={50}
        width={2}
        fill={fileMessageUploadIndicator!}
        tintColor='white'
        children={() => <Icon name='upload-cloud' size={25} color='white' />}
        onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor='#3d5875'
      />
      <Text style={{ color: 'white', fontSize: 12, fontFamily: 'BalooBhaijaan2' }}>{fileMessageUploadIndicator}%</Text>
    </BlurView>
  );
};

export default FileMsgUploadIndicator;

// styles sheet
const styles = StyleSheet.create({
  // container
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    paddingHorizontal: 10,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },
  //   hide file msg upload indicator
  hideFileMsgUploadIndicator: {
    display: 'none',
  },
});
