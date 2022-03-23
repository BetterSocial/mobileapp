import config from 'react-native-config'
import { STREAM_API_KEY, STREAM_APP_ID } from '@env';
import { connect } from 'getstream';
const clientStream = (userToken) => {
  const client = connect(config.STREAM_API_KEY, userToken, config.STREAM_APP_ID);
  return client;
};

export default clientStream;
