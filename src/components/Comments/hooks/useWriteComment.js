const useWriteComment = () => {
  const handleUserName = (item) => {
    if (item?.anon_user_info_emoji_name) {
      return `${item.anon_user_info_color_name} ${item.anon_user_info_emoji_name}`;
    }
    return item.actor?.data?.username;
  };

  const handleUsernameReplyComment = (item) => {
    if (item.data?.anon_user_info_emoji_name) {
      return `${item.data?.anon_user_info_color_name} ${item.data?.anon_user_info_emoji_name}`;
    }
    return `${item.user?.data?.username}`;
  };

  return {
    handleUserName,
    handleUsernameReplyComment
  };
};

export default useWriteComment;
