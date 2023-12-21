import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {StyleSheet} from 'react-native';

import AnonymousIcon from '../../screens/ChannelListScreen/elements/components/AnonymousIcon';
import BaseSystemChat from './BaseChatSystem';
import ChatItemMyTextV2 from './child/ChatItemMyTextV2';
import ChatItemTargetText from './child/ChatItemTargetText';
import dimen from '../../utils/dimen';
import useChatScreenHook from '../../hooks/screen/useChatScreenHook';
import {ANONYMOUS, ANONYMOUS_USER} from '../../hooks/core/constant';
import {BaseChatItemComponentProps} from '../../../types/component/AnonymousChat/BaseChatItem.types';
import {ChatStatus} from '../../../types/database/schema/ChannelList.types';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';

const styles = StyleSheet.create({
  containerPicture: {
    height: dimen.normalizeDimen(24),
    width: dimen.normalizeDimen(24),
    borderRadius: dimen.normalizeDimen(12)
  }
});

const BaseChatItem = ({item, index, type}: BaseChatItemComponentProps) => {
  const {selectedChannel, handleUserName} = useChatScreenHook(type || ANONYMOUS);

  const renderAnonymousAvatar = (anonColor: string, anonEmoji: string) => (
    <AnonymousIcon color={anonColor} emojiCode={anonEmoji} size={dimen.normalizeDimen(24)} />
  );

  const renderSignedAvatar = () => (
    <FastImage
      style={styles.containerPicture}
      source={{uri: item?.user?.profilePicture ?? DEFAULT_PROFILE_PIC_PATH}}
    />
  );

  const handleAvatar = () => {
    const selectedJson = selectedChannel?.rawJson;
    const itemJson = item?.rawJson;

    if (type === ANONYMOUS) {
      if (!item?.isMe && item?.user?.username !== ANONYMOUS_USER) return renderSignedAvatar();

      return renderAnonymousAvatar(
        selectedJson?.channel?.anon_user_info_color_code,
        selectedJson?.channel?.anon_user_info_emoji_code
      );
    }

    if (itemJson?.anon_user_info_emoji_code) {
      return renderAnonymousAvatar(
        itemJson?.anon_user_info_color_code,
        itemJson?.anon_user_info_emoji_code
      );
    }

    if (itemJson?.user?.name === ANONYMOUS_USER) {
      return renderAnonymousAvatar(
        selectedJson?.anon_user_info_color_code ?? selectedJson?.channel?.anon_user_info_color_code,
        selectedJson?.anon_user_info_emoji_code ?? selectedJson?.channel?.anon_user_info_emoji_code
      );
    }

    return renderSignedAvatar();
  };

  if (item?.type === 'system' || item?.rawJson?.isSystem || item?.rawJson?.message?.isSystem) {
    return <BaseSystemChat item={item} index={index} />;
  }

  if (item?.isMe) {
    return (
      <ChatItemMyTextV2
        key={index}
        avatar={handleAvatar()}
        isContinuous={item?.isContinuous}
        message={item?.message}
        attachments={item?.attachmentJson}
        time={item?.updatedAt}
        username={handleUserName(item)}
        status={item?.status as ChatStatus}
        chatType={type ?? ANONYMOUS}
        messageType={item?.type}
        data={item?.rawJson}
      />
    );
  }

  return (
    <ChatItemTargetText
      key={index}
      avatar={handleAvatar()}
      isContinuous={item?.isContinuous ?? false}
      message={item?.message}
      time={item?.updatedAt}
      username={handleUserName(item)}
      chatType={type ?? ANONYMOUS}
      messageType={item?.type ?? 'regular'}
      data={item?.rawJson}
    />
  );
};

const isEqual = (prevProps, nextProps) => {
  return nextProps.item === prevProps.item;
};

export default React.memo(BaseChatItem, isEqual);
