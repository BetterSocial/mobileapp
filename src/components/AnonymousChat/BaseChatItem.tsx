import * as React from 'react';

import ChatItemMyText from './child/ChatItemMyText';
import ChatItemTargetText from './child/ChatItemTargetText';
import {
  BaseChatItemComponentProps,
  BaseChatItemTypeProps
} from '../../../types/component/AnonymousChat/BaseChatItem.types';
import {calculateTime} from '../../utils/time';

const BaseChatItem = ({item, index}: BaseChatItemComponentProps) => {
  if (item?.isMe)
    return (
      <ChatItemMyText
        avatar={item?.user?.profilePicture}
        isContinuous={item?.isContinuous}
        message={item?.message}
        time={calculateTime(item?.updatedAt)}
        username={item?.user?.username}
        type={BaseChatItemTypeProps.MY_ANON_CHAT}
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
