import {StreamChat} from 'stream-chat';
import Config from 'react-native-config';
import {getAccessToken} from '../utils/token';
import {getUserId} from '../utils/users';

const chatClient = new StreamChat(Config.STREAM_API_KEY);

export const connectUserGetstream = async () => {
    try {
    const token = await getAccessToken();
    const id = await getUserId();
    const user = {
      id,
    };
    await chatClient.connectUser(user, token);
    return chatClient
    } catch (e) {
    return null
    }
}