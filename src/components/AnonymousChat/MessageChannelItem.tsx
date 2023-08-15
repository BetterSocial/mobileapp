import * as React from 'react';

import BaseChannelItem from './BaseChannelItem';
import {BaseChannelItemTypeProps} from '../../../types/component/AnonymousChat/BaseChannelItem.types';
import {MessageChannelItemProps} from '../../../types/component/AnonymousChat/MessageChannelItem.types';
import {calculateTime} from '../../utils/time';

const MessageChannelItem: (props: MessageChannelItemProps) => React.ReactElement = ({
  item,
  onChannelPressed
}) => {
  return (
    <BaseChannelItem
      type={BaseChannelItemTypeProps.ANON_PM}
      message={item?.description || ' '}
      name={item?.name}
      picture={item?.channelPicture}
      time={calculateTime(item?.lastUpdatedAt, true)}
      onPress={onChannelPressed}
      unreadCount={item?.unreadCount}
      isMe={item?.user?.isMe}
    />
  );
};

export default MessageChannelItem;
