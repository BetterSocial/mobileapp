import {StreamChat} from 'stream-chat';
import jwtDecode from 'jwt-decode';

import {STREAM_API_KEY} from '@env';
import {SET_CLIENT} from '../Types';
import {getMyProfile} from '../../service/profile';
const defaultImage =
  'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png';

export const createClient = async (token, dispatch) => {
  const userId = await jwtDecode(token).user_id;
  let userData = await getMyProfile(userId);
  let user = {
    id: userId,
    name: userData?.data.username,
    image: userData?.data.profile_pic_path ?? defaultImage,
  };

  const chatClient = await new StreamChat(STREAM_API_KEY);
  await chatClient.connectUser(user, token);
  await dispatch({
    type: SET_CLIENT,
    payload: chatClient,
  });
};
