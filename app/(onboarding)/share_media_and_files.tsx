import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import VectorImage from '../../assets/images/onboarding/share_media.png';
import i18n from '../../i18n.js';

const ShareMediaAndFiles = () => {
  return (
    <View>
      <Image source={VectorImage} style={styles.vectorImageContainer} />
      {/*text container  */}
      <View style={styles.discriptionTextContainer}>
        <Text style={[styles.fontFamily, styles.welcomeText]}>{i18n.t('onboarding.share_media_and_files.title')}</Text>
        <Text style={[styles.fontFamily, styles.discriptionText]}>
          {i18n.t('onboarding.share_media_and_files.description')}
        </Text>
      </View>
    </View>
  );
};

export default ShareMediaAndFiles;

const styles = StyleSheet.create({
  vectorImageContainer: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },

  fontFamily: {
    fontFamily: 'BalooBhaijaan2',
  },

  // description text container
  discriptionTextContainer: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
  },

  // welcome text
  welcomeText: {
    fontSize: 30,
    color: 'dodgerblue',
  },
  // description text
  discriptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
});
