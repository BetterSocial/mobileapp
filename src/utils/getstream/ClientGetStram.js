import * as React from 'react';
import {StreamChat} from 'stream-chat';
import jwtDecode from 'jwt-decode';

import {Context} from '../../context';
import {getAccessToken} from '../token';
import {STREAM_API_KEY} from '@env';
import {getMyProfile} from '../../service/profile';
import {createClient} from '../../context/actions/createClient';
import {setMessage} from '../firebase/setMessaging';
const defaultImage =
  'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png';

export const useClientGetstream = () => {
  const [client, dispatch] = React.useContext(Context).client;
  const create = async () => {
    if (!client.client) {
      const token = await getAccessToken();
      if (token) {
        const userId = await jwtDecode(token).user_id;
        let userData = await getMyProfile(userId);
        let user = {
          id: userId,
          name: userData?.data.username,
          image: userData?.data.profile_pic_path ?? defaultImage,
        };
        console.log('user connect ', user);
        const chatClient = await new StreamChat(STREAM_API_KEY);
        await chatClient.connectUser(user, token);
        setMessage(chatClient);
        createClient(chatClient, dispatch);
      }
    }
  };

  return create;
};
