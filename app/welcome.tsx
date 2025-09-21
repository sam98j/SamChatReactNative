import '../global.css';
import { Button } from '@rneui/themed';
import { Link, useRouter } from 'expo-router';
import { Text, View, StyleSheet, Image, StatusBar } from 'react-native';
import i18n from '../i18n.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import SamChatLogo from '../assets/icon.png';
import VectorImage from '../assets/images/onboarding/onboarding-image.png';

export default function WelcomeScreen() {
  // router
  const router = useRouter();
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1ecefa', '#4fccd5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <SafeAreaView edges={['top', 'left', 'right']}>
          <StatusBar barStyle='light-content' backgroundColor={'transparent'} translucent={true} />
          {/* image container */}
          <View>
            <View style={styles.logoContainer}>
              <Image source={SamChatLogo} style={{ width: 60, height: 60, tintColor: 'white' }} />
            </View>
            <Image source={VectorImage} style={styles.vectorImageContainer} />
          </View>
        </SafeAreaView>
      </LinearGradient>
      {/*text container  */}
      <View style={styles.discriptionTextContainer}>
        <Text style={[styles.fontFamily, styles.welcomeText]}>{i18n.t('welcome.welcome')}</Text>
        <Text style={[styles.fontFamily, styles.discriptionText]}>{i18n.t('welcome.description')}</Text>
      </View>
      <View style={styles.buttonArea}>
        {/* login btn */}
        <Button radius={'md'} onPress={() => router.navigate('/login')}>
          <Text style={[styles.fontFamily, { color: 'white' }]}>{i18n.t('welcome.login')}</Text>
        </Button>
        {/* no account */}
        <Text style={[styles.fontFamily, styles.noAccountText]}>
          {/* no account */}
          {i18n.t('welcome.no_account')}
          {/* link */}
          <Link href={'/signup'} style={{ color: 'dodgerblue' }}>
            {i18n.t('welcome.create_account')}
          </Link>
        </Text>
      </View>
    </View>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    gap: 10,
    backgroundColor: 'white',
  },
  fontFamily: {
    fontFamily: 'BalooBhaijaan2',
  },
  // logo container
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // vector image container
  vectorImageContainer: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
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
  buttonArea: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  // no account text
  noAccountText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
  },
});
