import AttchFileBottomSheet from '@/components/AttackFileMenu';
import ChatActions from '@/components/ChatActions';
import ChatMessageViewer from '@/components/ChatMessageViewer';
import CreateMessage from '@/components/CreateMessage';
import NoMessages from '@/components/NoMessages';
import SingleChatHeader from '@/components/SingleChatHeader';
import ForwardMsgMenu from '../forwordMsgReciversList';
import { useSingleChat } from '@/hooks/useSingleChat';
import React, { useCallback } from 'react';
import { ImageBackground, KeyboardAvoidingView, SectionList, StyleSheet, Text, View } from 'react-native';
import { UIActivityIndicator } from 'react-native-indicators';
import chatBackground from '../../../assets/images/chat_background.png';

const SingleChat = () => {
  const { chatMessages, sections, isFetchingChatMessages, isChatUsrDoingAction, messagesToBeForwared, loadMoreMessages } =
    useSingleChat();

  const onBackPress = useCallback(() => {}, []);

  // TODO: implement auto scroll to bottom when new message is added

  return (
    <View style={styles.container}>
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
          <SectionList
            sections={sections}
            onRefresh={loadMoreMessages}
            refreshing={isFetchingChatMessages}
            contentContainerStyle={styles.scrollContentContainer}
            keyExtractor={(item) => item._id}
            renderSectionHeader={({ section: { title } }) => <Text style={styles.messagesDate}>{title}</Text>}
            renderItem={({ item }) => <ChatMessageViewer msg={item} />}
            removeClippedSubviews={false}
            stickySectionHeadersEnabled={true}
          />

          {/* chat actions */}
          {isChatUsrDoingAction.type !== null && <ChatActions />}
        </View>
      </ImageBackground>

      {/* bottom sheet */}
      <AttchFileBottomSheet />

      {/* messages container */}
      <KeyboardAvoidingView style={styles.createMessageContainer}>
        <CreateMessage />
      </KeyboardAvoidingView>
    </View>
  );
};

export default SingleChat;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    position: 'relative',
    backgroundColor: '#fff',
  },
  messagesContainer: {
    flex: 1, 
    backgroundColor: 'transparent',
    marginBottom: 70, 
  },
  // create message container
  createMessageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  backgroundImage: {
    opacity: 0.1,
  },
  backgroundContainer: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
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
