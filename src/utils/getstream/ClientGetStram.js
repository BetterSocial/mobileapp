import * as React from 'react';
import {StreamChat} from 'stream-chat';
import jwtDecode from 'jwt-decode';

import {Context} from '../../context';
import {getAccessToken} from '../token';
import {STREAM_API_KEY} from '@env';
import {getMyProfile} from '../../service/profile';
import {createClient} from '../../context/actions/createClient';
import {
  setUnReadMessage,
  setTotalUnReadMessage,
} from '../../context/actions/unReadMessageAction';
import {setMessage} from '../firebase/setMessaging';
const defaultImage =
  'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png';

export const useClientGetstream = () => {
  const [client, dispatch] = React.useContext(Context).client;
  const [unReadMessage, dispatchUnReadMessage] =
    React.useContext(Context).unReadMessage;
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
          invisible: true,
        };
        const chatClient = await new StreamChat(STREAM_API_KEY);
        let res = await chatClient.connectUser(user, token);
        let unRead = {
          total_unread_count: res.me.total_unread_count,
          unread_channels: res.me.unread_channels,
          unread_count: res.me.unread_count,
        };
        chatClient.on((event) => {
          // console.log('*********event***********');
          // console.log(event);
          if (event.total_unread_count !== undefined) {
            console.log(event.total_unread_count);
            dispatchUnReadMessage(
              setTotalUnReadMessage(event.total_unread_count),
            );
          }

          if (event.unread_channels !== undefined) {
            console.log(event.unread_channels);
          }
        });
        dispatchUnReadMessage(setUnReadMessage(unRead));
        setMessage(chatClient);
        createClient(chatClient, dispatch);
      }
    }
  };

  return create;
};
