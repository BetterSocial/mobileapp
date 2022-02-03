import { connect } from 'getstream';
import { STREAM_API_KEY, STREAM_APP_ID } from '@env';

const clientStream = (userToken) => {
  const client = connect(STREAM_API_KEY, userToken, STREAM_APP_ID);
  return client;
};

export default clientStream;
