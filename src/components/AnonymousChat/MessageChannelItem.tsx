// eslint-disable-next-line no-use-before-define
import * as React from 'react';

import BaseChannelItem from './BaseChannelItem';
import {BaseChannelItemTypeProps} from '../../../types/component/AnonymousChat/BaseChannelItem.types';
import {ChannelList} from '../../../types/database/schema/ChannelList.types';
import {MessageChannelItemProps} from '../../../types/component/AnonymousChat/MessageChannelItem.types';
import {calculateTime} from '../../utils/time';

const MessageChannelItem: (props: MessageChannelItemProps) => React.ReactElement = ({
  item,
  onChannelPressed,
  hasFollowButton = false,
  handleFollow
}) => {
  const determineChatType = (data: ChannelList) => {
    const isAnonymous = Boolean(data?.rawJson?.anon_user_info_emoji_code);
    if (!isAnonymous) return BaseChannelItemTypeProps.SIGNED_PM;
    return BaseChannelItemTypeProps.ANON_PM;
  };

  const type = determineChatType(item);

  return (
    <BaseChannelItem
      type={type}
      message={item?.description || ' '}
      name={item?.name}
      picture={item?.channelPicture}
      postMaker={item?.rawJson}
      time={calculateTime(item?.lastUpdatedAt, true)}
      onPress={onChannelPressed}
      unreadCount={item?.unreadCount}
      isMe={item?.user?.isMe}
      hasFollowButton={hasFollowButton}
      handleFollow={handleFollow}
    />
  );
};

export default MessageChannelItem;
