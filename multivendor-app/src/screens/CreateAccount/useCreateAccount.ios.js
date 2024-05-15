

import { useEffect, useState, useContext } from 'react';
import { StatusBar, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import useEnvVars from '../../../environment'; 
import gql from 'graphql-tag';
import { login } from '../../apollo/mutations'; 
import ThemeContext from '../../ui/ThemeContext/ThemeContext'; 
import { theme } from '../../utils/themeColors'; 
import { useMutation } from '@apollo/client';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'; 
import analytics from '../../utils/analytics'; 
import AuthContext from '../../context/Auth'; 
import { useTranslation } from 'react-i18next';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'; 
WebBrowser.maybeCompleteAuthSession(); 


const LOGIN = gql`
  ${login}
`;

export const useCreateAccount = () => {
  const Analytics = analytics();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const [mutate] = useMutation(LOGIN, { onCompleted, onError });
  const [enableApple, setEnableApple] = useState(false);
  const [loginButton, loginButtonSetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setTokenAsync } = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);
  const [googleUser, setGoogleUser] = useState(null);
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] };

  const {
    IOS_CLIENT_ID_GOOGLE,
    ANDROID_CLIENT_ID_GOOGLE,
    EXPO_CLIENT_ID,
    TERMS_AND_CONDITIONS,
    PRIVACY_POLICY
  } = useEnvVars();


  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "650001300965-9ochl634tuvv6iguei6dl57jkmfto6r9.apps.googleusercontent.com", 
    androidClientId: "650001300965-ii3nafver2uiu4qat9gbde9rkmhmvj0j.apps.googleusercontent.com", 
    iosClientId: "650001300965-dkji7jutv8gc5m4n7cdg3nft87sauhn7.apps.googleusercontent.com", 
    scopes: ['profile', 'email', 'openid'],
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetchUserInfo(authentication.accessToken);
    } else if (response?.type === 'error') {
      console.error('Authentication error:', response.error);
      FlashMessage({ message: `Google sign-in failed: ${response.error.message || 'Unknown error'}` });
      setLoading(false);
      loginButtonSetter(null);
    } else if (response?.type === 'cancel') {
        FlashMessage({ message: 'Google sign-in cancelled.' });
        setLoading(false);
        loginButtonSetter(null);
    }
  }, [response]);

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const user = await response.json();

      const userData = {
        phone: '',
        email: user.email,
        password: '',
        name: user.name,
        picture: user.photo || '',
        type: 'google'
      };

 

      setGoogleUser(userData.name);
      await mutateLogin(userData);

    } catch (error) {
      console.error('❌ Google fetch user info error:', error);
      FlashMessage({ message: 'Failed to retrieve Google user info.' });
      setLoading(false);
      loginButtonSetter(null);
    }
  };

  const signIn = async () => {
    try {
      loginButtonSetter('Google');
      setLoading(true);

      if (!request) {
        console.error("Google authentication request is not ready.");
        FlashMessage({ message: 'Google sign-in is not ready. Please try again.' });
        setLoading(false);
        loginButtonSetter(null);
        return;
      }

      await promptAsync({
        useProxy: false, 
        windowFeatures: 'popup', 
      });
    } catch (e) {
      console.error('Error during sign-in prompt: ' + e.message, e);
      FlashMessage({ message: 'Google sign-in failed unexpectedly.' });
      setLoading(false);
      loginButtonSetter(null);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const navigateToPhone = () => {
    navigation.navigate('PhoneNumber', {
      name: googleUser,
      phone: ''
    });
  };

  const navigateToMain = () => {
    navigation.navigate({
      name: 'Main',
      merge: true
    });
  };

  async function mutateLogin(user) {
    try {
 
      let notificationToken = null;

      if (Device.isDevice) {
        try {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
      

          if (existingStatus === 'granted') {
            try {
              const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId
              });
              notificationToken = tokenData.data;
       
            } catch (tokenError) {
              console.warn('🔐 [Login Debug] ⚠️ Could not get push token (this is OK):', tokenError.message);
              notificationToken = null;
            }
          } else {
            console.log('🔐 [Login Debug] ℹ️ Notification permission not granted, skipping token');
          }
        } catch (permissionError) {
          console.warn('🔐 [Login Debug] ⚠️ Could not check notification permissions:', permissionError.message);
          notificationToken = null;
        }
      } else {
        console.log('🔐 [Login Debug] ℹ️ Not a physical device, skipping notification token');
      }

      mutate({
        variables: {
          ...user,
          notificationToken: notificationToken
        }
      });
    } catch (error) {
      console.error('🔐 [Login Debug] ❌ Error in mutateLogin:', error);
      setLoading(false);
      loginButtonSetter(null);
    }
  }

  useEffect(() => {
    checkIfSupportsAppleAuthentication();
  }, []);

  async function checkIfSupportsAppleAuthentication() {
    try {


      const isAvailable = await AppleAuthentication.isAvailableAsync();
 
      setEnableApple(isAvailable);
    } catch (error) {
      console.error('🍎 [Apple Debug] ❌ Error checking Apple Authentication:', error);
      setEnableApple(false);
    }
  }

  async function onCompleted(data) {

    if (data.login.isActive === false) {
      FlashMessage({ message: t('accountDeactivated') });
      setLoading(false);
      loginButtonSetter(null);
      return;
    }

    try {

      setTokenAsync(data.login.token);
      FlashMessage({ message: 'Successfully logged in' });

      if (data?.login?.phone === '') {
        navigateToPhone();
      } else {
        navigateToMain();
      }

    } catch (error) {
      console.error('❌ [Login Debug] Error in onCompleted:', error);
    } finally {
      setLoading(false);
      loginButtonSetter(null);
    }
  }

  function onError(error) {
    console.error('❌ [Login Debug] Login mutation error occurred');
    console.error('❌ [Login Debug] Error message:', error.message);
    console.error('❌ [Login Debug] Full error object:', error);
    console.error('❌ [Login Debug] GraphQL errors:', error.graphQLErrors);
    console.error('❌ [Login Debug] Network error:', error.networkError);

    FlashMessage({
      message: error.message || 'Login failed. Please try again.'
    });

    setLoading(false);
    loginButtonSetter(null);
  }

  useFocusEffect(() => {


    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    );
  });

  const openTerms = () => {
    Linking.openURL(TERMS_AND_CONDITIONS);
  };

  const openPrivacyPolicy = () => {
    Linking.openURL(PRIVACY_POLICY);
  };

  return {
    enableApple,
    loginButton,
    loginButtonSetter,
    loading,
    setLoading,
    themeContext,
    mutateLogin,
    currentTheme,
    navigateToLogin,
    navigateToRegister,
    openTerms,
    openPrivacyPolicy,
    navigateToMain,
    navigation,
    signIn, 
  };
};