import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import FastImage from 'react-native-fast-image';
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
import dimen from '../../utils/dimen';
import BaseSystemChat from './BaseChatSystem';

const styles = StyleSheet.create({
  containerPicture: {
    height: dimen.normalizeDimen(24),
    width: dimen.normalizeDimen(24),
    borderRadius: dimen.normalizeDimen(12)
  }
});

const BaseChatItem = ({item, index, type}: BaseChatItemComponentProps) => {
  const {selectedChannel, handleUserName} = useChatScreenHook(type || 'ANONYMOUS');
  const {anon_user_info_emoji_code, anon_user_info_color_code} =
    selectedChannel?.rawJson?.channel || {};
  const renderAnonymousIcon = () => (
    <View style={{marginLeft: 8}}>
      <AnonymousIcon
        color={anon_user_info_color_code}
        emojiCode={anon_user_info_emoji_code}
        size={dimen.normalizeDimen(24)}
      />
    </View>
  );
  const handleImageUser = () => {
    if (item?.user?.username !== 'AnonymousUser') {
      return (
        <View>
          <FastImage style={styles.containerPicture} source={{uri: item?.user?.profilePicture}} />
        </View>
      );
    }
    return renderAnonymousIcon();
  };

  if (item?.isMe)
    return (
      <ChatItemMyTextV2
        key={index}
        AnonymousImage={handleImageUser()}
        avatar=""
        isContinuous={item?.isContinuous}
        message={item?.message}
        time={calculateTime(item?.updatedAt, true)}
        username={handleUserName(item)}
        type={BaseChatItemTypeProps.MY_ANON_CHAT}
        status={item?.status as ChatStatus}
      />
    );

  if (item?.type === 'system') {
    return <BaseSystemChat item={item} index={index} />;
  }

  return (
    <ChatItemTargetText
      key={index}
      AnonymousImage={handleImageUser()}
      isContinuous={item?.isContinuous}
      message={item?.message}
      time={calculateTime(item?.updatedAt, true)}
      username={handleUserName(item)}
      type={BaseChatItemTypeProps.ANON_CHAT}
    />
  );
};

export default BaseChatItem;
