import { Button } from '@rneui/themed';
import { Slot, useRouter } from 'expo-router';
import { Text, View, StyleSheet, Image, StatusBar, BackHandler } from 'react-native';
import i18n from '../../i18n.js';
import { SafeAreaView } from 'react-native-safe-area-context';
import SamChatLogo from '../../assets/icon.png';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSystemStore } from '@/store/systemStore';
import { useEffect } from 'react';

export default function RootLayout() {
  // router
  const router = useRouter();
  // get lang from i18n
  const lang = i18n.locale; // replace with actual i18n language detection
  // zustand system
  const { onboarding } = useSystemStore();
  // handle back press
  useEffect(() => {
    const backAction = () => {
      // check if the current screen === -1
      if (onboarding.currentScreen === 0) return false;
      // Router push
      onboarding.setCurrentScreen(onboarding.currentScreen - 1);
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    // Clean up the event listener when the component unmounts
    return () => backHandler.remove();
  }, [onboarding.currentScreen]);

  // handle next btn press
  const pressNextBtn = () => {
    // check if the current screen is the last screen
    if (onboarding.currentScreen === onboarding.screensPaths.length - 1) return router.push('/welcome');
    // Router push
    router.push(onboarding.screensPaths[onboarding.currentScreen + 1]);
    onboarding.setCurrentScreen(onboarding.currentScreen + 1);
  };

  // return
  return (
    <View style={styles.container}>
      <View>
        <SafeAreaView edges={['top', 'left', 'right']}>
          <StatusBar backgroundColor={'transparent'} translucent={true} />
          {/* image container */}
          <View>
            <View style={styles.logoContainer}>
              <Image source={SamChatLogo} style={{ width: 60, height: 60, tintColor: 'white' }} />
            </View>
            <Slot />
          </View>
        </SafeAreaView>
      </View>

      {/* onboarding steps indicators */}
      <View style={[styles.stepsIndicators, lang === 'ar' && styles.dirRtl]}>
        {onboarding.screensPaths.map((path, index) => (
          <View
            key={index}
            style={[styles.stepIndicator, index === onboarding.currentScreen && styles.stepIndicatorActive]}
          />
        ))}
      </View>

      <View style={styles.buttonArea}>
        {/* login btn */}
        <Button style={styles.nextbtn} radius={'md'} onPress={() => pressNextBtn()}>
          <Text style={[styles.fontFamily, { color: 'white' }]}>التالي</Text>
          <View>
            <Icon
              name='arrow-forward-outline'
              size={20}
              color='white'
              style={{ lineHeight: 8, transform: [{ scaleX: -1 }] }}
            />
          </View>
        </Button>
        <Button radius={'md'} color={'white'} onPress={() => router.push('/welcome')}>
          <Text style={[styles.fontFamily, { color: 'black' }]}>تخطي</Text>
        </Button>
      </View>
    </View>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    backgroundColor: 'white',
    gap: 10,
  },
  // dir rtl
  dirRtl: {
    direction: 'rtl',
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
    height: 300 /* */,
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexGrow: 1,
  },

  // next button
  nextbtn: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    // height: 50,
  },
  // no account text
  noAccountText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
  },
  // steps indicators
  stepsIndicators: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 20,
  },
  // step indicator
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
  // step indicator active
  stepIndicatorActive: {
    backgroundColor: '#1e8fff78',
    width: 40,
  },
});
