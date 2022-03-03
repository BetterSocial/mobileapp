import { connect } from 'getstream';
import { STREAM_API_KEY, STREAM_APP_ID } from '@env';
import config from 'react-native-config'
console.log(config.STREAM_API_KEY, 'sultan')
const clientStream = (userToken) => {
  const client = connect(config.STREAM_API_KEY, userToken, config.STREAM_APP_ID);
  return client;
};

export default clientStream;
