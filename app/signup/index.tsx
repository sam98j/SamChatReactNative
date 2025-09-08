import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import i18n from '../../i18n';
import { UIActivityIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/store/zuAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignUpDto } from '@/interfaces/auth';
import SamChatLogo from '@/assets/icon.png';
import startSignInFlow from '@/utils/auth';

export default function LoginScreen() {
  const { currentUser } = useSelector((state: RootState) => state.authSlice);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<Blob | null>(null);
  const [profileImageUrl, setProfileImageUrL] = useState<string | null>(null);
  const prefLang = i18n.locale;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signupUser, googleOAuth } = useAuthStore();

  const pickImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return console.log('Sorry, we need camera roll permissions!');
    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const respose = await fetch(result.assets[0].uri);
      const blob = await respose.blob();
      console.log(blob, 'blob');
      setProfileImageUrL(result.assets[0].uri);
      setProfileImage(blob);
    }
  };
  const handleFormSubmition = () => {
    // sign up user dto object
    const user: SignUpDto = {
      email,
      password,
      name,
      usrname: username,
      avatar: profileImage,
    };
    signupUser(user);
    setIsLoading(true);
  };

  useEffect(() => {
    if (currentUser) {
      router.push('/chats');
    }
  }, [currentUser]);

  const handleGoogleSignIn = async () => {
    const token = await startSignInFlow();
    await googleOAuth(token!);
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageHeaderText}>{i18n.t('signup.app_name')}</Text>
          <Image source={SamChatLogo} style={styles.pageHeaderImage} />
        </View>

        {/* Sign in with Google */}
        <View style={styles.signInWithGoogleContainer}>
          <TouchableOpacity style={styles.signInWithGoogleBtn} onPress={handleGoogleSignIn}>
            <Text style={styles.signInWithGoogleText}>{i18n.t('signup.signup_with_google')}</Text>
            <FontAwesome name='google' size={20} />
          </TouchableOpacity>
        </View>

        {/* Separator */}
        <View style={styles.seperatorContainer}>
          <Text>ــــ</Text>
          <Text style={styles.seperator}>{i18n.t('signup.or_sign_up_with_email')}</Text>
          <Text>ــــ</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Full Name Input */}
          <View>
            <View
              style={[styles.inputContainer, prefLang === 'ar' ? styles.inputContainerRowReverse : styles.inputContainerRow]}
            >
              <Icon name='person-circle-outline' size={20} color='gray' />
              <TextInput
                placeholder={i18n.t('signup.full_name_placeholder')}
                keyboardType='default'
                style={[styles.textInput, prefLang === 'ar' ? styles.textInputRight : styles.textInputLeft]}
                onChangeText={setName}
                selectionColor={'dodgerblue'}
                value={name}
              />
            </View>
          </View>
          {/* Email Input */}
          <View>
            <View
              style={[styles.inputContainer, prefLang === 'ar' ? styles.inputContainerRowReverse : styles.inputContainerRow]}
            >
              <Icon name='mail-open-outline' size={20} color='gray' />
              <TextInput
                placeholder={i18n.t('signup.email_placeholder')}
                keyboardType='email-address'
                style={[styles.textInput, prefLang === 'ar' ? styles.textInputRight : styles.textInputLeft]}
                onChangeText={setEmail}
                selectionColor={'dodgerblue'}
                value={email}
              />
            </View>
            <Text style={styles.inputHint}>{i18n.t('signup.email_hint')}</Text>
          </View>

          {/* Password Input */}
          <View>
            <View
              style={[styles.inputContainer, prefLang === 'ar' ? styles.inputContainerRowReverse : styles.inputContainerRow]}
            >
              <Icon name='key-outline' size={20} color='gray' />
              <TextInput
                placeholder={i18n.t('signup.password_placeholder')}
                secureTextEntry={true}
                style={[styles.textInput, prefLang === 'ar' ? styles.textInputRight : styles.textInputLeft]}
                selectionColor={'dodgerblue'}
                onChangeText={setPassword}
                value={password}
              />
            </View>
            <Text style={styles.inputHint}>{i18n.t('signup.password_hint')}</Text>
          </View>

          {/* Confirm Password Input */}
          <View>
            <View
              style={[styles.inputContainer, prefLang === 'ar' ? styles.inputContainerRowReverse : styles.inputContainerRow]}
            >
              <Icon name='key-outline' size={20} color='gray' />
              <TextInput
                placeholder={i18n.t('signup.confirm_password_placeholder')}
                secureTextEntry={true}
                style={[styles.textInput, prefLang === 'ar' ? styles.textInputRight : styles.textInputLeft]}
                selectionColor={'dodgerblue'}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
              />
            </View>
          </View>

          {/* user name Input */}
          <View>
            <View
              style={[styles.inputContainer, prefLang === 'ar' ? styles.inputContainerRowReverse : styles.inputContainerRow]}
            >
              <Icon name='person-circle-outline' size={20} color='gray' />
              <TextInput
                placeholder={i18n.t('signup.username_placeholder')}
                keyboardType='default'
                style={[styles.textInput, prefLang === 'ar' ? styles.textInputRight : styles.textInputLeft]}
                onChangeText={setUsername}
                selectionColor={'dodgerblue'}
                value={username}
              />
            </View>
          </View>

          {/* Profile Picture Upload */}
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <TouchableOpacity onPress={pickImage}>
              {profileImage ? (
                <Image
                  source={{ uri: profileImageUrl! }}
                  style={{ width: 80, height: 80, borderRadius: 40, marginBottom: 5 }}
                />
              ) : (
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: '#eee',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 5,
                  }}
                >
                  <Icon name='camera-outline' size={32} color='gray' />
                </View>
              )}
            </TouchableOpacity>
            <Text style={{ fontFamily: 'BalooBhaijaan2', color: 'gray', fontSize: 12 }}>
              {i18n.t('signup.uplaod_profile_picture')}
            </Text>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signinBtn, isLoading && styles.signinBtnLoading]}
            onPress={handleFormSubmition}
            disabled={isLoading}
          >
            {!isLoading && <Text style={styles.signinBtnText}>{i18n.t('signup.signup_button')}</Text>}
            {isLoading && <UIActivityIndicator size={20} color='#fff' />}
          </TouchableOpacity>

          {/* Links */}
          <Link href='/' style={styles.link}>
            <Text>{i18n.t('login.no_account')} </Text>
            <Text style={styles.linkHighlight}>{i18n.t('login.register_now')}</Text>
          </Link>
          <Link href='/' style={styles.link}>
            {i18n.t('login.forgot_password')}
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// styles
const styles = StyleSheet.create({
  container: {
    // height: '100%',
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
    backgroundColor: '#f3f4f6',
    borderColor: '#eee',
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
