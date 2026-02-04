import AttchFileBottomSheet from '@/components/AttackFileMenu';
import ChatActions from '@/components/ChatActions';
import ChatMessageViewer from '@/components/ChatMessageViewer';
import CreateMessage from '@/components/CreateMessage';
import NoMessages from '@/components/NoMessages';
import SingleChatHeader from '@/components/SingleChatHeader';
import ForwardMsgMenu from '../forwordMsgReciversList';
import { useSingleChat } from '@/hooks/useSingleChat';
import React, { useCallback } from 'react';
import { FlatList, ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import chatBackground from '../../../assets/images/chat_background.png';
import ChatMessagesLoadOldMsgSpin from '@/components/ChatMessagesLoadOldMsgSpin';
import { StatusBar } from 'react-native';

const SingleChat = () => {
  const {
    chatMessages,
    flattenedMessages,
    isFetchingChatMessages,
    isChatUsrDoingAction,
    messagesToBeForwared,
    loadMoreMessages,
    isKeyboardOpen,
    inputHeight,
    createMessageContainerRef,
  } = useSingleChat();

  const onBackPress = useCallback(() => {}, []);

  // TODO: implement auto scroll to bottom when new message is added

  return (
    <KeyboardAvoidingView
      style={[styles.container, isKeyboardOpen && { paddingBottom: Platform.OS === 'ios' ? 0 : inputHeight }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* status bar */}
      <StatusBar barStyle={'dark-content'} />
      {/* forward messages menu */}
      {messagesToBeForwared && <ForwardMsgMenu />}

      {/* header */}
      <SingleChatHeader onBackPress={onBackPress} title='' />

      {/* messages container */}
      <ImageBackground
        source={chatBackground}
        resizeMode='repeat'
        imageStyle={styles.backgroundImage}
        style={styles.backgroundContainer}
      >
        <View style={styles.messagesContainer}>
          {chatMessages !== undefined && !chatMessages?.length && !isFetchingChatMessages && <NoMessages />}

          {/* loading messages */}
          {isFetchingChatMessages && !chatMessages?.length && (
            <View style={{ padding: 10 }}>
              <UIActivityIndicator size={20} color='gray' />
            </View>
          )}

          {/* messages list */}
          <FlatList
            data={flattenedMessages}
            inverted
            onEndReached={loadMoreMessages}
            onEndReachedThreshold={0.5} // Increased to trigger loading earlier
            ListFooterComponent={<ChatMessagesLoadOldMsgSpin isFetchingChatMessages={isFetchingChatMessages} />}
            contentContainerStyle={styles.scrollContentContainer}
            keyExtractor={(item) => item._id}
            initialNumToRender={20}
            windowSize={10}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            removeClippedSubviews={Platform.OS === 'android'}
            renderItem={({ item }) => {
              if ('type' in item && item.type === 'date') {
                return <Text style={styles.messagesDate}>{item.date}</Text>;
              }
              return <ChatMessageViewer msg={item as any} />;
            }}
          />

          {/* chat actions */}
          {isChatUsrDoingAction.type !== null && <ChatActions />}
        </View>
      </ImageBackground>

      {/* bottom sheet */}
      <AttchFileBottomSheet />

      {/* messages input container */}
      <View style={styles.createMessageContainer} ref={createMessageContainerRef}>
        <CreateMessage />
      </View>
    </KeyboardAvoidingView>
  );
};

export default SingleChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Removed containerKeyboardOpen since we're using dynamic height now
  messagesContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  // create message container
  createMessageContainer: {
    backgroundColor: '#fff',
  },
  backgroundImage: {
    opacity: 0.1,
  },
  backgroundContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  messagesDate: {
    textAlign: 'center',
    color: '#3b83f6ff',
    marginVertical: 10,
    backgroundColor: '#ebf8ffff',
    borderRadius: 10,
    padding: 3,
    alignSelf: 'center',
    fontFamily: 'BalooBhaijaan2',
    overflow: 'hidden', // Ensures borderRadius is applied if needed
  },
});
