import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

// Import translations
import welcomeScreenAr from './locales/ar/welcome.json';
import welcomeScreenEn from './locales/en/welcome.json';
// login screen
import loginScreenAr from './locales/ar/login.json';
import loginScreenEn from './locales/en/login.json';
// signup screen
import signupScreenAr from './locales/ar/signup.json';
import signupScreenEn from './locales/en/signup.json';
// import tranlations files for tabsLayout
import tabsLayoutAr from './locales/ar/tabsLayout.json';
import tabsLayoutEn from './locales/en/tabsLayout.json';
// import tranlations files for chatHeader
import chatHeaderAr from './locales/ar/chatHeader.json';
import chatHeaderEn from './locales/en/chatHeader.json';
// import tranlations files for openedChat
import openedChatAr from './locales/ar/openedChat.json';
import openedChatEn from './locales/en/openedChat.json';
// import tranlations files for chatsListScreen
import chatsListScreenAr from './locales/ar/chatsListScreen.json';
import chatsListScreenEn from './locales/en/chatsListScreen.json';
// import tranlations files for chatCard
import chatCardAr from './locales/ar/chatCard.json';
import chatCardEn from './locales/en/chatCard.json';

// Set translations
const translations = {
  en: {
    welcome: welcomeScreenEn,
    login: loginScreenEn,
    tabsLayout: tabsLayoutEn,
    chatHeader: chatHeaderEn,
    openedChat: openedChatEn,
    chatsListScreen: chatsListScreenEn,
    chatCard: chatCardEn,
    signup: signupScreenEn,
  },
  ar: {
    welcome: welcomeScreenAr,
    login: loginScreenAr,
    tabsLayout: tabsLayoutAr,
    chatHeader: chatHeaderAr,
    openedChat: openedChatAr,
    chatsListScreen: chatsListScreenAr,
    chatCard: chatCardAr,
    signup: signupScreenAr,
  },
};

const i18n = new I18n(translations);
// Set the locale based on the device's locale
i18n.locale = 'ar';

// Enable fallback to English if the locale is not available
i18n.fallbacks = true;

export default i18n;
