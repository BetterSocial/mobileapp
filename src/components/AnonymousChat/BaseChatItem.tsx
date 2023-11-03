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
import {ANONYMOUS, ANONYMOUS_USER} from '../../hooks/core/constant';

const styles = StyleSheet.create({
  containerPicture: {
    height: dimen.normalizeDimen(24),
    width: dimen.normalizeDimen(24),
    borderRadius: dimen.normalizeDimen(12)
  },
  ml8: {
    marginLeft: 8
  }
});

const BaseChatItem = ({item, index, type}: BaseChatItemComponentProps) => {
  const {selectedChannel, handleUserName} = useChatScreenHook(type || ANONYMOUS);
  const {anon_user_info_emoji_code, anon_user_info_color_code} =
    selectedChannel?.rawJson?.channel || {};
  const renderAnonymousIcon = (anonColor: string, anonEmoji: string) => (
    <View style={{marginLeft: 8}}>
      <AnonymousIcon color={anonColor} emojiCode={anonEmoji} size={dimen.normalizeDimen(24)} />
    </View>
  );

  const renderDefaultIcon = () => (
    <View style={styles.ml8}>
      <FastImage style={styles.containerPicture} source={{uri: item?.user?.profilePicture}} />
    </View>
  );

  const handleImageUser = () => {
    if (type === ANONYMOUS) {
      if (item?.user?.username !== ANONYMOUS_USER) {
        return renderDefaultIcon();
      }
      return renderAnonymousIcon(anon_user_info_color_code, anon_user_info_emoji_code);
    }

    if (item?.rawJson?.anon_user_info_emoji_code) {
      return renderAnonymousIcon(anon_user_info_color_code, anon_user_info_emoji_code);
    }
    if (item?.rawJson?.user?.name === ANONYMOUS_USER) {
      return renderAnonymousIcon(
        selectedChannel?.rawJson?.anon_user_info_color_code,
        selectedChannel?.rawJson?.anon_user_info_emoji_code
      );
    }
    return renderDefaultIcon();
  };

  if (item?.type === 'system' || item?.rawJson?.isSystem || item?.rawJson?.message?.isSystem) {
    return <BaseSystemChat item={item} index={index} />;
  }
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
        chatType={type}
      />
    );

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

const isEqual = (prevProps, nextProps) => {
  return nextProps.item === prevProps.item;
};

export default React.memo(BaseChatItem, isEqual);
