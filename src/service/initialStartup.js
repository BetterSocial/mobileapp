import { atom } from 'recoil';
import { getUserId } from '../utils/users';
import { verifyTokenGetstream } from './users';
import { setAccessToken, setRefreshToken, removeAccessToken } from '../utils/token';

export const doVerifyUser = async (callbackVerified, callbackSetId) => {
  try {
    const id = await getUserId();
    if (id !== null && id !== '') {
      const verify = await verifyTokenGetstream();
      if (verify !== null && verify !== '') {
        callbackVerified();
        callbackSetId(id);
      } else {
        callbackSetId('');
      }
    } else {
      callbackSetId('');
    }
  } catch (e) {
    console.log('doVerifyUser ', e);
    callbackSetId(null);
  }
};

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
        console.log('effects', savedValue);
        if (savedValue != null && savedValue !== '') {
          const verify = await verifyTokenGetstream();
          console.log('effects verify', verify);
          if (verify !== null && verify !== '') {
            setSelf({ id: verify, deeplinkProfile: false });
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
        if (user !== null && user !== undefined) {
          setAccessToken(res.data.token);
          setRefreshToken(res.data.refresh_token);
        } else {
          removeAccessToken();
        }
      });
    },
  ],
});
