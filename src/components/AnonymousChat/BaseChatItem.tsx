import * as React from 'react';

import ChatItemMyText from './child/ChatItemMyText';
import ChatItemMyTextV2 from './child/ChatItemMyTextV2';
import ChatItemTargetText from './child/ChatItemTargetText';
import {
  BaseChatItemComponentProps,
  BaseChatItemTypeProps
} from '../../../types/component/AnonymousChat/BaseChatItem.types';
import {ChatStatus} from '../../../types/database/schema/ChannelList.types';
import {calculateTime} from '../../utils/time';

const BaseChatItem = ({item, index}: BaseChatItemComponentProps) => {
  if (item?.isMe)
    return (
      <ChatItemMyTextV2
        avatar={item?.user?.profilePicture}
        isContinuous={item?.isContinuous}
        message={item?.message}
        time={calculateTime(item?.updatedAt)}
        username={item?.user?.username}
        type={BaseChatItemTypeProps.MY_ANON_CHAT}
        status={item?.status as ChatStatus}
      />
    );

  return (
    <ChatItemTargetText
      avatar={item?.user?.profilePicture}
      isContinuous={item?.isContinuous}
      message={item?.message}
      time={calculateTime(item?.updatedAt)}
      username={item?.user?.username}
      type={BaseChatItemTypeProps.ANON_CHAT}
    />
  );
};

export default BaseChatItem;
