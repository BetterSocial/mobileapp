/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ReactNative from 'react-native';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import 'react-native-gesture-handler/jestSetup';
import {NativeModules} from 'react-native';

NativeModules.RNCNetInfo = {
  getCurrentState: jest.fn(() => Promise.resolve()),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

jest.doMock('react-native-fs', () => {
  return {
    readFile: jest.fn(),
  };
});
jest.doMock('react-native', () => {
  return Object.setPrototypeOf(
    {
      Platform: {
        OS: 'android',
        select: () => {
          /* do nothing */
        },
      },
      NativeModules: {
        ...ReactNative.NativeModules,
        RNFBAppModule: {
          NATIVE_FIREBASE_APPS: [
            {
              appConfig: {
                name: '[DEFAULT]',
              },
              options: {},
            },
            {
              appConfig: {
                name: 'secondaryFromNative',
              },
              options: {},
            },
          ],
          addListener: jest.fn(),
          eventsAddListener: jest.fn(),
          eventsNotifyReady: jest.fn(),
        },
        RNFBAuthModule: {
          APP_LANGUAGE: {
            '[DEFAULT]': 'en-US',
          },
          APP_USER: {
            '[DEFAULT]': 'jestUser',
          },
          addAuthStateListener: jest.fn(),
          addIdTokenListener: jest.fn(),
          useEmulator: jest.fn(),
        },
        RNFBCrashlyticsModule: {},
        RNFBDatabaseModule: {
          on: jest.fn(),
          useEmulator: jest.fn(),
        },
        RNFBFirestoreModule: {
          settings: jest.fn(),
        },
        RNFBPerfModule: {},
        RNFBStorageModule: {
          useEmulator: jest.fn(),
        },
      },
      StyleSheet: {
        create: jest.fn((e) => e),
      },
    },
    ReactNative,
  );
});
jest.doMock('@react-native-firebase/remote-config', () => {
  return function () {
    return {
      setConfigSettings: (config: object) => {},
      setDefaults: (defaultSettings: object) => {},
      fetchAndActivate: async (): Promise<boolean> => {
        return true;
      },
      getValue: (key: string): any => {
        return {
          asNumber: () => {
            return 100;
          },
          asBoolean: () => {
            return true;
          },
        };
      },
    };
  };
});
jest.mock('@react-native-firebase/crashlytics', () => () => ({
  recordError: jest.fn(),
  logEvent: jest.fn(),
  setUserProperties: jest.fn(),
  setUserId: jest.fn(),
  setCurrentScreen: jest.fn(),
  logScreenView: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};

  return Reanimated;
});

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

jest.mock('@react-navigation/core', () => ({
  useNavigation: () => jest.fn(),
  useNavigationParam: jest.fn(
    jest.requireActual('@react-navigation/core').useNavigationParam,
  ),
}));

jest.doMock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({setOptions: jest.fn()}),
    createNavigatorFactory: jest.fn(),
  };
});
// jest.mock('react-native-swiper-flatlist', () => jest.fn());
jest.mock('react', () => {
  const originReact = jest.requireActual('react');
  const mUseRef = jest.fn();
  return {
    ...originReact,
    useRef: mUseRef,
  };
});

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome5', () => 'Icon');
jest.mock('react-native-vector-icons/Entypo', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/Fontisto', () => 'Icon');
jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-vector-icons/Octicons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');
