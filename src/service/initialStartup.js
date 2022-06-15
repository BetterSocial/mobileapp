import SplashScreenPackage from 'react-native-splash-screen';
import { getUserId } from '../utils/users';
import { verifyTokenGetstream } from './users';

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
  setTimeout(() => {
    SplashScreenPackage.hide();
  }, 700);
};
