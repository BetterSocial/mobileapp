import { atom } from 'recoil';
import { Linking } from 'react-native';
import { getUserId } from '../utils/users';
import { verifyTokenGetstream } from './users';
import { setAccessToken, setRefreshToken, removeAccessToken } from '../utils/token';
import { getProfileByUsername } from './profile';

const BASE_DEEPLINK_URL_REGEX = 'link.bettersocial.org';

export const InitialStartupAtom = atom({
  key: 'InitialStartupAtom',
  default: {
    id: null,
    deeplinkProfile: false,
  },
  effects: [
    ({ setSelf, onSet }) => {
      // If there's a persisted value - set it on load
      const loadPersisted = async () => {
        const savedValue = await getUserId();

        if (savedValue != null && savedValue !== '') {
          const verify = await verifyTokenGetstream();
          if (verify !== null && verify !== '') {
            setSelf({ id: savedValue, deeplinkProfile: false });
          } else {
            setSelf({ id: '', deeplinkProfile: false });
          }
        } else {
          setSelf({ id: '', deeplinkProfile: false });
        }
      };

      loadPersisted();

      // Subscribe to state changes and persist them to localStorage
      onSet((user) => {
        console.log(user, 'user');
        if (user !== null && user !== undefined) {
          setAccessToken(user);
          setRefreshToken(user);
        } else {
          removeAccessToken();
        }
      });
    },
  ],
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

export const initialStartupTask = ({ snapshot, set }) => async () => {
  const userId = snapshot.getLoadable(InitialStartupAtom).getValue();
  try {
    const deepLinkUrl = await Linking.getInitialURL();

    if (deepLinkUrl !== null) {
      const match = deepLinkUrl.match(`(?<=${BASE_DEEPLINK_URL_REGEX}\/).+`);

      if (match.length > 0) {
        const username = match[0];
        const otherProfile = await doGetProfileByUsername(username);

        // Check if myself
        set(InitialStartupAtom, { id: userId, deeplinkProfile: userId === otherProfile.user_id });
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-undef
    if (__DEV__) {
      console.error('getDeeplinkUrl error :', e);
    }
  }
};
