import * as React from 'react';
import { StreamChat } from 'stream-chat';
import jwtDecode from 'jwt-decode';
import config from 'react-native-config';
import { Context } from '../../context';
import { getAccessToken } from '../token';
import { getMyProfile } from '../../service/profile';
import { createClient} from '../../context/actions/createClient';
import {
  setUnReadMessage,
  setTotalUnReadMessage,
} from '../../context/actions/unReadMessageAction';
import { setMessage } from '../firebase/setMessaging';

const defaultImage = 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png';
export const useClientGetstream = () => {
  const [client, dispatch] = React.useContext(Context).client;
  const [unReadMessage, dispatchUnReadMessage] = React.useContext(Context).unReadMessage;
  const create = async (tokenResult) => {
    try {
      if (!client.client) {
        let token = await getAccessToken();
        if (tokenResult) {
          token = tokenResult;
        }

        if (token) {
          const userId = await jwtDecode(token.id).user_id;
          const userData = await getMyProfile(userId);
          const user = {
            id: userId,
            name: userData?.data.username,
            image: userData?.data.profile_pic_path ?? defaultImage,
            invisible: true,
          };
          const chatClient = StreamChat.getInstance(config.STREAM_API_KEY);
          const res = await chatClient.connectUser(user, token.id);
          const unRead = {
            total_unread_count: res.me.total_unread_count,
            unread_channels: res.me.unread_channels,
            unread_count: res.me.unread_count,
          };
          chatClient.on((event) => {
            if (event.total_unread_count !== undefined) {
              dispatchUnReadMessage(
                setTotalUnReadMessage(event.total_unread_count),
              );
            }

            if (event.unread_channels !== undefined) {
              // console.log(event.unread_channels);
            }
          });
          dispatchUnReadMessage(setUnReadMessage(unRead));
          setMessage(chatClient);
          createClient(chatClient, dispatch);
        }
      }
    } catch (e) {
      console.log('error create stream chat', e)
    }
  };

  return create;
};
