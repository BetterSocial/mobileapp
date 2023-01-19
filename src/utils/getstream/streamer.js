import config from 'react-native-config'
import { connect } from 'getstream';

const clientStream = (userToken) => {
  try {
    const client = connect(config.STREAM_API_KEY, userToken.id, config.STREAM_APP_ID);
    return client;
  } catch (e) {
    if (__DEV__) {
      console.log('error client stream connect: ', e);
    }
  }

};

export default clientStream;
