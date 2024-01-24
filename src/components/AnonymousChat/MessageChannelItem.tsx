/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line no-use-before-define
import * as React from 'react';

import BaseChannelItem from './BaseChannelItem';
import useChatUtilsHook from '../../hooks/core/chat/useChatUtilsHook';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import {BaseChannelItemTypeProps} from '../../../types/component/AnonymousChat/BaseChannelItem.types';
import {ChannelList} from '../../../types/database/schema/ChannelList.types';
import {Context} from '../../context';
import {MessageChannelItemProps} from '../../../types/component/AnonymousChat/MessageChannelItem.types';
import {calculateTime} from '../../utils/time';
import {getChatName} from '../../utils/string/StringUtils';

const MessageChannelItem: (props: MessageChannelItemProps) => React.ReactElement = ({
  item,
  onChannelPressed,
  hasFollowButton = false,
  handleFollow
}) => {
  const {signedProfileId} = useProfileHook();

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

  const {handleTextSystem} = useChatUtilsHook();
  const [profile] = (React.useContext(Context) as unknown as any).profile;
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

  return (
    <BaseChannelItem
      type={type}
      message={handleTextSystem(item)}
      name={getChatName(item?.name, profile?.myProfile?.username)}
      picture={item?.channelPicture}
      postMaker={item?.rawJson}
      time={calculateTime(item?.lastUpdatedAt, true)}
      onPress={onChannelPressed}
      unreadCount={item?.unreadCount}
      isMe={isMe}
      hasFollowButton={hasFollowButton}
      handleFollow={handleFollow}
      channelType={item?.channelType}
      dbAnonUserInfo={dbAnonUserInfo}
    />
  );
};

const isEqual = (prevProps, nextProps) => {
  return nextProps.item === prevProps.item;
};

export default React.memo(MessageChannelItem, isEqual);
