// basic imports
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import i18n from '@/i18n';
import no_messages_vector from '@/assets/images/no-messages-vector.png';

const NoMessages = () => {
  return (
    <View style={styles.container}>
      <Image source={no_messages_vector} style={{ width: 250, height: 250, opacity: 0.6 }} />
      <Text style={styles.noMessagesText}>{i18n.t('openedChat.no-messages-yet')}</Text>
    </View>
  );
};

export default NoMessages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // no messages text styles
  noMessagesText: {
    fontSize: 24,
    color: 'gray',
    fontFamily: 'BalooBhaijaan2',
  },
});
