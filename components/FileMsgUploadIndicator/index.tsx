import React, { FC, useEffect, useRef, useState } from 'react';
import { useChatsStore } from '@/store/zuChats';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/Feather';

interface Props {
  _id: string;
  isFile?: boolean;
}

const FileMsgUploadIndicator: FC<Props> = ({ _id, isFile }) => {
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
    <View
      style={[
        styles.container,
        !isUploadProgressVisable && styles.hideFileMsgUploadIndicator,
        {
          backgroundColor: isFile ? '#f2f2f2' : '#00000081',
        },
      ]}
    >
      <AnimatedCircularProgress
        size={40}
        width={2}
        fill={fileMessageUploadIndicator!}
        tintColor='dodgerblue'
        children={() => <Icon name='upload-cloud' size={20} color={`${isFile ? 'dodgerblue' : 'white'}`} />}
        backgroundColor='#ddd'
      />
      {!isFile && (
        <Text style={{ fontSize: 12, fontFamily: 'BalooBhaijaan2', color: 'white' }}>
          {Math.round(fileMessageUploadIndicator!)}%
        </Text>
      )}
    </View>
  );
};

export default FileMsgUploadIndicator;

// styles sheet
const styles = StyleSheet.create({
  // container
  container: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    height: '100%',
    zIndex: 100,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //   hide file msg upload indicator
  hideFileMsgUploadIndicator: {
    display: 'none',
  },
});
