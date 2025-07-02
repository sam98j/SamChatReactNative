import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import i18n from '@/i18n';

const NoChatsVector: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/no-chats.png')} style={styles.image} resizeMode='contain' />
      <Text style={styles.text}>{i18n.t('chatsListScreen.no-chats')}</Text>
    </View>
  );
};

export default NoChatsVector;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 16,
  },
  text: {
    fontSize: 24,
    color: '#888',
    textAlign: 'center',
    fontFamily: 'BalooBhaijaan2',
  },
});
