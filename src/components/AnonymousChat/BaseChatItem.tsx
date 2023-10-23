import * as React from 'react';
import {View} from 'react-native';

import FastImage from 'react-native-fast-image';
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

const BaseChatItem = ({item, index}: BaseChatItemComponentProps) => {
  useChatScreenHook();
  const {anon_user_info_emoji_code, anon_user_info_color_code} = item?.rawJson;

  const handleUserName = () => {
    if (item?.rawJson?.anon_user_info_emoji_name) {
      return `${item?.rawJson?.anon_user_info_emoji_name}`;
    }
    return item?.user?.username;
  };

  if (item?.isMe)
    return (
      <ChatItemMyTextV2
        AnonymousImage={
          <View style={{marginLeft: 8}}>
            {/* <AnonymousIcon
              color={channel?.anon_user_info_color_code}
              emojiCode={channel?.anon_user_info_emoji_code}
              size={24}
            /> */}
            <FastImage
              source={{uri: item?.user?.profilePicture}}
              style={{height: 24, width: 24, borderRadius: 12}}
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
      anonEmojiCode={anon_user_info_emoji_code}
      anonEmojiColor={anon_user_info_color_code}
      avatar={item?.user?.profilePicture}
      isContinuous={item?.isContinuous}
      message={item?.message}
      time={calculateTime(item?.updatedAt, true)}
      username={handleUserName()}
      type={BaseChatItemTypeProps.ANON_CHAT}
    />
  );
};

export default BaseChatItem;
