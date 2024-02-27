import anonymousApi from './anonymousConfig';
import {AnonUser, AnonUserResponse} from '../../types/service/AnonProfile.type';

export const generateAnonProfileOtherProfile = async (userId): Promise<AnonUser> => {
  try {
    const result = await anonymousApi.post<AnonUserResponse>(`/chat/users/${userId}`);
    console.log({result: result.data});
    return Promise.resolve<AnonUser>(result?.data.data);
  } catch (error) {
    console.error({error});
    return Promise.reject(error?.response?.data);
  }
};
