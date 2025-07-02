import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

export default {
  expo: {
    name: 'SamChat',
    slug: 'todo-list',
    version: pkg.version,
    orientation: 'portrait',
    icon: './assets/images/appIcons/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.sam-98j.samchat',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/appIcons/adaptive-icon/foreground.png',
        backgroundImage: './assets/images/appIcons/adaptive-icon/background.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.sam_98j.samchat',
    },
    build: {
      development: {
        developmentClient: true,
        distribution: 'internal',
        android: {
          buildType: 'apk',
        },
      },
      preview: {
        distribution: 'internal',
        android: {
          buildType: 'apk',
        },
      },
      production: {
        android: {
          buildType: 'apk',
        },
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/icon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/appIcons/splash.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'expo-font',
      'expo-web-browser',
      'expo-secure-store',
      'expo-localization',
      'expo-audio',
      'expo-video',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '0769d144-dfaf-4e9e-b4ed-a843a23aacce',
      },
    },
  },
};
