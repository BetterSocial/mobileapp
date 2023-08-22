import Config from 'react-native-config';
import {StreamChat} from 'stream-chat';

import TokenStorage, {ITokenEnum} from '../utils/storage/custom/tokenStorage';
import {getUserId} from '../utils/users';

const chatClient = new StreamChat(Config.STREAM_API_KEY);

export const connectUserGetstream = async () => {
  try {
    const token = await TokenStorage.get(ITokenEnum.token);
    const id = await getUserId();
    const user = {
      id
    };
    await chatClient.connectUser(user, token);
    return chatClient;
  } catch (e) {
    return null;
  }
};
