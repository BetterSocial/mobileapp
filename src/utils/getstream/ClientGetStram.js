import * as React from 'react';
import config from 'react-native-config';
import jwtDecode from 'jwt-decode';
import {StreamChat} from 'stream-chat';

import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH} from '../constants';
import {createClient} from '../../context/actions/createClient';
import {getAccessToken} from '../token';
import {getMyProfile} from '../../service/profile';
import {setMessage} from '../firebase/setMessaging';
import {setTotalUnReadMessage, setUnReadMessage} from '../../context/actions/unReadMessageAction';

const defaultImage = DEFAULT_PROFILE_PIC_PATH;
export const useClientGetstream = () => {
  const [client, dispatch] = React.useContext(Context).client;
  const [, dispatchUnReadMessage] = React.useContext(Context).unReadMessage;
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
          /**
           * @type {import('stream-chat').OwnUserResponse}
           */
          const user = {
            id: userId,
            name: userData?.data.username,
            image: userData?.data.profile_pic_path ?? defaultImage,
            invisible: true
          };
          const chatClient = StreamChat.getInstance(config.STREAM_API_KEY);
          const res = await chatClient.connectUser(user, token.id);
          const unRead = {
            total_unread_count: res.me.total_unread_count,
            unread_channels: res.me.unread_channels,
            unread_count: res.me.unread_count
          };
          chatClient.on((event) => {
            if (event.total_unread_count !== undefined) {
              dispatchUnReadMessage(setTotalUnReadMessage(event.total_unread_count));
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
      if (__DEV__) {
        console.log('error create stream chat', e);
      }
    }
  };

  return create;
};

export const useUpdateClientGetstreamHook = () => {
  const [, dispatch] = React.useContext(Context).client;

  const updateUserClient = async (image) => {
    const chatClient = StreamChat.getInstance(config.STREAM_API_KEY);
    const token = await getAccessToken();
    const userId = await jwtDecode(token.id).user_id;

    chatClient.partialUpdateUser({
      id: userId,
      set: {
        image
      }
    });

    createClient(chatClient, dispatch);
  };

  return updateUserClient;
};
