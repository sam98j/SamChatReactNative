import { GoogleSignin } from '@react-native-google-signin/google-signin';

const startSignInFlow = async () => {
  try {
    GoogleSignin.configure({
      webClientId: '899317260521-1j3t0v34151gn89o7erjpsc8ei89psrk.apps.googleusercontent.com',
    }); // move this to after your app starts
    GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // await GoogleSignin.();
    const signInResponse = await GoogleSignin.signIn();
    if (signInResponse.type === 'success') {
      const tokens = await GoogleSignin.getTokens();
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      // google auth method from zuAuth
      // fetch request
      //TODO: change this to api module
      const response = await fetch(`${apiUrl}/auth/signup_with_google`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${tokens.idToken}`,
        },
      });
      // use signInResponse.data
      const data = await response.json();
      return data;
    }
    // the else branches correspond to the user canceling the sign in
  } catch (error) {
    // handle error
    console.error(error);
  }
};

export default startSignInFlow;
