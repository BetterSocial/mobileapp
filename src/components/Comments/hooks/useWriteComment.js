import {getOfficialAnonUsername} from '../../../utils/string/StringUtils';

const useWriteComment = () => {
  const handleUserName = (item) => {
    if (item?.anon_user_info_emoji_name) {
      return getOfficialAnonUsername(item);
    }
    return item.actor?.data?.username;
  };

  const handleUsernameReplyComment = (item) => {
    if (item.data?.anon_user_info_emoji_name) {
      return getOfficialAnonUsername(item?.data);
    }
    return `${item.user?.data?.username}`;
  };

  return {
    handleUserName,
    handleUsernameReplyComment
  };
};

export default useWriteComment;
