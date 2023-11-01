// eslint-disable-next-line no-use-before-define
import * as React from 'react';

import BaseChannelItem from './BaseChannelItem';
import {BaseChannelItemTypeProps} from '../../../types/component/AnonymousChat/BaseChannelItem.types';
import {ChannelList} from '../../../types/database/schema/ChannelList.types';
import {MessageChannelItemProps} from '../../../types/component/AnonymousChat/MessageChannelItem.types';
import {calculateTime} from '../../utils/time';
import {getChatName} from '../../utils/string/StringUtils';
import {Context} from '../../context';
import useChatUtilsHook from '../../hooks/core/chat/useChatUtilsHook';

const MessageChannelItem: (props: MessageChannelItemProps) => React.ReactElement = ({
  item,
  onChannelPressed,
  hasFollowButton = false,
  handleFollow
}) => {
  const determineChatType = (data: ChannelList) => {
    const isAnonymous = Boolean(data?.channelType === 'ANON_PM');
    if (!isAnonymous) return BaseChannelItemTypeProps.SIGNED_PM;
    return BaseChannelItemTypeProps.ANON_PM;
  };
  const {handleTextSystem} = useChatUtilsHook();

  const [profile] = React.useContext(Context).profile;
  const type = determineChatType(item);

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
      isMe={item?.user?.isMe}
      hasFollowButton={hasFollowButton}
      handleFollow={handleFollow}
    />
  );
};

export default MessageChannelItem;
