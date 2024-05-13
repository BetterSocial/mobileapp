/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line no-use-before-define
import * as React from 'react';

import BaseChannelItem from './BaseChannelItem';
import useChatUtilsHook from '../../hooks/core/chat/useChatUtilsHook';
import useFollowUserV2Hook from '../../hooks/core/users/useFollowUserV2Hook';
import useUserAuthHook from '../../hooks/core/auth/useUserAuthHook';
import {BaseChannelItemTypeProps} from '../../../types/component/AnonymousChat/BaseChannelItem.types';
import {ChannelList} from '../../../types/database/schema/ChannelList.types';
import {MessageChannelItemProps} from '../../../types/component/AnonymousChat/MessageChannelItem.types';
import {calculateTime} from '../../utils/time';

const MessageChannelItem: (props: MessageChannelItemProps) => React.ReactElement = ({
  item,
  onChannelPressed
}) => {
  const {signedProfileId} = useUserAuthHook();
  const {followStatus, getOtherProfileFollowStatus, followUserAction} =
    useFollowUserV2Hook('signed');
  const {handleTextSystem} = useChatUtilsHook('SIGNED');

  const determineChatType = (data: ChannelList) => {
    const isAnonymous = Boolean(data?.channelType === 'ANON_PM');
    if (!isAnonymous) return BaseChannelItemTypeProps.SIGNED_PM;
    return BaseChannelItemTypeProps.ANON_PM;
  };

  const checkIsMe = (data: ChannelList, type: BaseChannelItemTypeProps): boolean => {
    const rawJson = data?.rawJson;
    const lastMessage = rawJson?.firstMessage ?? rawJson?.message;
    const isSystemMessage = lastMessage?.isSystem || lastMessage?.type === 'system';

    if (type === BaseChannelItemTypeProps.SIGNED_PM) {
      if (isSystemMessage) return false;
      return lastMessage?.user?.id === signedProfileId;
    }
    return item?.user?.isMe ?? false;
  };

  const type = determineChatType(item);
  const isMe = checkIsMe(item, type);

  const dbAnonUserInfo = item?.anon_user_info_color_code
    ? {
        anon_user_info_color_code: item?.anon_user_info_color_code,
        anon_user_info_emoji_code: item?.anon_user_info_emoji_code,
        anno_user_info_color_name: item?.anon_user_info_color_name,
        anon_user_info_emoji_name: item?.anon_user_info_emoji_name
      }
    : null;

  const onFollowUser = () => {
    followUserAction(item);
  };

  React.useEffect(() => {
    if (!dbAnonUserInfo && item?.channelType === 'PM') {
      getOtherProfileFollowStatus(item?.user?.id);
    }
  }, []);

  return (
    <BaseChannelItem
      type={type}
      message={handleTextSystem(item)}
      name={item?.name}
      picture={item?.channelPicture}
      postMaker={item?.rawJson}
      time={calculateTime(item?.lastUpdatedAt, true)}
      onPress={onChannelPressed}
      unreadCount={item?.unreadCount}
      isMe={isMe}
      hasFollowButton={followStatus?.isFollowing === false || followStatus?.isFollowingFromAction}
      // hasFollowButton={true}
      showFollowingButton={followStatus?.isFollowingFromAction}
      handleFollow={onFollowUser}
      channelType={item?.channelType}
      dbAnonUserInfo={dbAnonUserInfo}
    />
  );
};

const isEqual = (prevProps, nextProps) => {
  return nextProps.item === prevProps.item;
};

export default React.memo(MessageChannelItem, isEqual);
