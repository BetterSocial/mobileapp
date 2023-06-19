import * as React from 'react';

import ChatItemMyText from './child/ChatItemMyText';
import {BaseChatItemProps} from '../../../types/component/AnonymousChat/BaseChatItem.types';

const BaseChatItem = (props: BaseChatItemProps) => {
  return <ChatItemMyText {...props} />;
};

export default BaseChatItem;
