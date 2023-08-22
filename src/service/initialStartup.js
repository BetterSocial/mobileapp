/* eslint-disable no-useless-escape */
import React from 'react';
import {Linking} from 'react-native';
import {atom} from 'recoil';

import {getProfileByUsername} from './profile';
import {getUserId} from '../utils/users';
import {removeAccessToken, setAccessToken} from '../utils/token';
import {verifyTokenGetstream} from './users';

const BASE_DEEPLINK_URL_REGEX = 'link.bettersocial.org/u';

export const InitialStartupAtom = atom({
  key: 'InitialStartupAtom',
  default: {
    id: null
  },
  effects_UNSTABLE: [
    ({setSelf, onSet}) => {
      // If there's a persisted value - set it on load
      const loadPersisted = async () => {
        const savedValue = await getUserId();
        if (savedValue !== null && savedValue !== '') {
          const verify = await verifyTokenGetstream();
          if (verify !== null && verify !== '') {
            setSelf({id: savedValue});
          } else {
            setSelf({id: ''});
          }
        } else {
          setSelf({id: ''});
        }
      };

      loadPersisted();

      // Subscribe to state changes and persist them to localStorage
      onSet((user) => {
        if (user !== null && user !== undefined) {
          setAccessToken(user);
        } else {
          removeAccessToken();
        }
      });
    }
  ]
});

export const otherProfileAtom = atom({
  key: 'otherProfileAtom',
  default: null
});

const doGetProfileByUsername = async (username) => {
  try {
    const response = await getProfileByUsername(username);
    if (response.code === 200) {
      return response.data;
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const initialStartupTask =
  ({set}) =>
  async () => {
    try {
      const deepLinkUrl = await Linking.getInitialURL();

      if (deepLinkUrl !== null) {
        const match = deepLinkUrl.match(`(?<=${BASE_DEEPLINK_URL_REGEX}\/).+`);

        if (match.length > 0) {
          const username = match[0];
          const otherProfile = await doGetProfileByUsername(username);

          // Check if myself
          set(otherProfileAtom, otherProfile);
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-undef
      if (__DEV__) {
        console.error('getDeeplinkUrl error :', e);
      }
    }
    // }
  };

export const LoadingStartupContext = React.createContext({
  loadingUser: true
});
