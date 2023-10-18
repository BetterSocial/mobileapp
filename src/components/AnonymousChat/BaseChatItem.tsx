import * as React from 'react';
import {View} from 'react-native';

import AnonymousIcon from '../../screens/ChannelListScreen/elements/components/AnonymousIcon';
import ChatItemMyTextV2 from './child/ChatItemMyTextV2';
import ChatItemTargetText from './child/ChatItemTargetText';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import {
  BaseChatItemComponentProps,
  BaseChatItemTypeProps
} from '../../../types/component/AnonymousChat/BaseChatItem.types';
import {ChatStatus} from '../../../types/database/schema/ChannelList.types';
import {calculateTime} from '../../utils/time';
import BaseSystemChat from './BaseChatSystem';
import useChatUtilsHook from '../../hooks/core/chat/useChatUtilsHook';

const BaseChatItem = ({item, index}: BaseChatItemComponentProps) => {
  const {selectedChannel} = useChatScreenHook();
  const {selectedChannel: selectedChat} = useChatUtilsHook();
  const isAnonymous = selectedChat?.channelType !== 'PM';

  const {anon_user_info_emoji_name, anon_user_info_emoji_code, anon_user_info_color_code} =
    selectedChannel?.rawJson?.channel || {};
  const handleUserName = () => {
    if (isAnonymous) {
      return `Anonymous ${anon_user_info_emoji_name}`;
    }
    return selectedChat?.user?.username;
  };

  if (item?.isMe)
    return (
      <ChatItemMyTextV2
        AnonymousImage={
          <View style={{marginLeft: 8}}>
            <AnonymousIcon
              color={anon_user_info_color_code}
              emojiCode={anon_user_info_emoji_code}
              size={24}
            />
          </View>
        }
        avatar=""
        isContinuous={item?.isContinuous}
        message={item?.message}
        time={calculateTime(item?.updatedAt, true)}
        username={handleUserName()}
        type={BaseChatItemTypeProps.MY_ANON_CHAT}
        status={item?.status as ChatStatus}
      />
    );

  if (item?.type === 'system') {
    return <BaseSystemChat item={item} index={index} />;
  }

  return (
    <ChatItemTargetText
      avatar={item?.user?.profilePicture}
      isContinuous={item?.isContinuous}
      message={item?.message}
      time={calculateTime(item?.updatedAt, true)}
      username={item?.user?.username}
      type={BaseChatItemTypeProps.ANON_CHAT}
    />
  );
};

export default BaseChatItem;
