import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import i18n from '../../../i18n';
import { UIActivityIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuthStore } from '@/store/zuAuth';
import SamChatIcon from '@/assets/icon.png';
import startSignInFlow from '@/utils/auth';

export default function LoginScreen() {
  // get current user from zustand store
  const { currentUser, googleOAuth, loginUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const prefLang = i18n.locale;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFormSubmition = () => {
    // call loginUser from zustand store
    loginUser({ email, password });
    setIsLoading(true);
  };

  useEffect(() => {
    if (currentUser) router.replace('/(tabs)/chats');
  }, [currentUser]);

  // handle Google Sign In
  const handleGoogleSignIn = async () => {
    const token = await startSignInFlow();
    await googleOAuth(token!);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageHeaderText}>{i18n.t('login.app_name')}</Text>
        <Image source={SamChatIcon} style={styles.pageHeaderImage} />
      </View>

      {/* Sign in with Google */}
      <View style={styles.signInWithGoogleContainer}>
        <TouchableOpacity style={styles.signInWithGoogleBtn} onPress={handleGoogleSignIn}>
          <Text style={styles.signInWithGoogleText}>{i18n.t('login.sign_in_with_google')}</Text>
          <FontAwesome name='google' size={20} />
        </TouchableOpacity>
      </View>

      {/* Separator */}
      <View style={styles.seperatorContainer}>
        <Text>ــــ</Text>
        <Text style={styles.seperator}>{i18n.t('login.or_sign_in_with_email')}</Text>
        <Text>ــــ</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {/* Email Input */}
        <View>
          <View
            style={[styles.inputContainer, prefLang === 'ar' ? styles.inputContainerRowReverse : styles.inputContainerRow]}
          >
            <Icon name='mail-open-outline' size={20} color='gray' />
            <TextInput
              placeholder={i18n.t('login.email_placeholder')}
              keyboardType='email-address'
              style={[styles.textInput, prefLang === 'ar' ? styles.textInputRight : styles.textInputLeft]}
              onChangeText={setEmail}
              selectionColor={'dodgerblue'}
              value={email}
            />
          </View>
          <Text style={styles.inputHint}>{i18n.t('login.email_hint')}</Text>
        </View>

        {/* Password Input */}
        <View>
          <View
            style={[styles.inputContainer, prefLang === 'ar' ? styles.inputContainerRowReverse : styles.inputContainerRow]}
          >
            <Icon name='key-outline' size={20} color='gray' />
            <TextInput
              placeholder={i18n.t('login.password_placeholder')}
              secureTextEntry={true}
              style={[styles.textInput, prefLang === 'ar' ? styles.textInputRight : styles.textInputLeft]}
              selectionColor={'dodgerblue'}
              onChangeText={setPassword}
              value={password}
            />
          </View>
          <Text style={styles.inputHint}>{i18n.t('login.password_hint')}</Text>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[styles.signinBtn, isLoading && styles.signinBtnLoading]}
          onPress={handleFormSubmition}
          disabled={isLoading}
        >
          {!isLoading && <Text style={styles.signinBtnText}>{i18n.t('login.sign_in_button')}</Text>}
          {isLoading && <UIActivityIndicator size={20} color='#fff' />}
        </TouchableOpacity>

        {/* Links */}
        <Link href='/signup' style={styles.link}>
          <Text>{i18n.t('login.no_account')} </Text>
          <Text style={styles.linkHighlight}>{i18n.t('login.register_now')}</Text>
        </Link>
        <Link href='/' style={styles.link}>
          {i18n.t('login.forgot_password')}
        </Link>
      </View>
    </View>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 30,
    display: 'flex',
    gap: 30,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  pageHeader: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageHeaderText: {
    fontFamily: 'BalooBhaijaan2',
    fontSize: 20,
  },
  pageHeaderImage: {
    width: 40,
    height: 40,
  },
  signInWithGoogleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInWithGoogleBtn: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  signInWithGoogleText: {
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
    fontFamily: 'BalooBhaijaan2',
  },
  seperatorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  seperator: {
    textAlign: 'center',
    fontSize: 14,
    color: 'gray',
    fontFamily: 'BalooBhaijaan2',
  },
  formContainer: {
    display: 'flex',
    gap: 20,
  },
  inputContainer: {
    borderWidth: 1,
    backgroundColor: '#eee',
    borderColor: '#ccc',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  inputContainerRow: {
    flexDirection: 'row',
  },
  inputContainerRowReverse: {
    flexDirection: 'row-reverse',
  },
  textInput: {
    flexGrow: 1,
    fontFamily: 'BalooBhaijaan2',
  },
  textInputLeft: {
    textAlign: 'left',
  },
  textInputRight: {
    textAlign: 'right',
  },
  inputHint: {
    fontSize: 12,
    color: 'gray',
    fontFamily: 'BalooBhaijaan2',
    textAlign: 'right',
  },
  signinBtn: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  signinBtnLoading: {
    opacity: 0.8,
  },
  signinBtnText: {
    color: '#fff',
    fontFamily: 'BalooBhaijaan2',
  },
  link: {
    textAlign: 'center',
    color: '#000',
    fontFamily: 'BalooBhaijaan2',
  },
  linkHighlight: {
    color: 'dodgerblue',
  },
});
