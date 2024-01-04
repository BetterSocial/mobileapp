/* eslint-disable no-unexpected-multiline */
import * as React from 'react';
import {Dimensions, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/core';

import IconChatCheckMark from '../../../assets/icon/IconChatCheckMark';
import IconChatClockGrey from '../../../assets/icon/IconChatClockGrey';
import IconFile from '../../../assets/icon/IconFile';
import IconVideoPlay from '../../../assets/icon/IconVideoPlay';
import {ChatItemMyTextProps} from '../../../../types/component/AnonymousChat/BaseChatItem.types';
import {ChatStatus} from '../../../../types/database/schema/ChannelList.types';
import {SIGNED} from '../../../hooks/core/constant';
import {fonts} from '../../../utils/fonts';
import {formatBytes} from '../../../utils/string/StringUtils';
import dimen from '../../../utils/dimen';
import {COLORS} from '../../../utils/theme';

const {width} = Dimensions.get('screen');

const AVATAR_SIZE = 24;
const CONTAINER_LEFT_PADDING = 60;
const CONTAINER_RIGHT_PADDING = 10;
const AVATAR_LEFT_MARGIN = 8;
const BUBBLE_LEFT_PADDING = 8;
const BUBBLE_RIGHT_PADDING = 8;

const styles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
    maxWidth: width,
    paddingLeft: CONTAINER_LEFT_PADDING,
    paddingRight: CONTAINER_RIGHT_PADDING
  },
  chatTitleContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  containerSigned: {
    backgroundColor: COLORS.babyBlue
  },
  containerAnon: {
    backgroundColor: COLORS.halfBaked
  },
  textContainer: {
    paddingLeft: BUBBLE_LEFT_PADDING,
    paddingRight: BUBBLE_RIGHT_PADDING,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 8,
    borderTopEndRadius: 0,
    flex: 1
  },
  textContainerNewLine: {
    paddingBottom: 14
  },
  userText: {
    fontFamily: fonts.inter[600],
    fontSize: 12,
    lineHeight: 19.36
  },
  text: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    lineHeight: 19.36,
    marginBottom: 4
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 12,
    marginLeft: AVATAR_LEFT_MARGIN
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: COLORS.black,
    alignSelf: 'center'
  },
  timeText: {
    fontFamily: fonts.inter[200],
    fontSize: 10,
    lineHeight: 12.19,
    alignSelf: 'center'
  },
  icon: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 6,
    right: 8
  },
  iconNewLine: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 6,
    right: 8
  },
  ml8: {
    marginLeft: 8
  },
  attachmentContainer: {
    width: '100%',
    height: 268,
    borderRadius: 8,
    overflow: 'hidden',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  moreOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  moreText: {
    fontSize: dimen.normalizeDimen(16),
    fontFamily: fonts.inter[400],
    color: COLORS.white
  },
  attachmentFileContainer: {
    backgroundColor: COLORS.gray,
    justifyContent: 'center',
    minHeight: dimen.normalizeDimen(64),
    flexDirection: 'row',
    alignItems: 'center'
  },
  attachmentFileContent: {
    flex: 1,
    padding: dimen.normalizeDimen(6)
  },
  attachmentFileName: {
    fontSize: dimen.normalizeDimen(14),
    fontFamily: fonts.inter[600],
    color: COLORS.black
  },
  attachmentFileInfo: {
    fontSize: dimen.normalizeDimen(12),
    fontFamily: fonts.inter[400],
    color: COLORS.gray
  },
  attachmentFileIcon: {
    backgroundColor: COLORS.light_silver,
    width: dimen.normalizeDimen(64),
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const targetLastLineWidth =
  width -
  CONTAINER_LEFT_PADDING -
  CONTAINER_RIGHT_PADDING -
  AVATAR_SIZE -
  AVATAR_LEFT_MARGIN -
  BUBBLE_LEFT_PADDING -
  BUBBLE_RIGHT_PADDING;

const ChatItemMyTextV2 = ({
  username = 'Anonymous User',
  time = '4h',
  isContinuous = false,
  message = '',
  attachments = [],
  status = ChatStatus.PENDING,
  avatar,
  chatType
}: ChatItemMyTextProps) => {
  const navigation = useNavigation();
  const messageRef = React.useRef<Text>(null);

  const renderIcon = React.useCallback(() => {
    if (status === ChatStatus.PENDING)
      return (
        <View style={styles.icon}>
          <IconChatClockGrey width={12} height={12} />
        </View>
      );

    return (
      <View style={styles.icon}>
        <IconChatCheckMark />
      </View>
    );
  }, []);

  const renderAvatar = React.useCallback(() => {
    if (isContinuous) return <View style={styles.avatar} />;
    return <View style={styles.ml8}>{avatar}</View>;
  }, []);

  const handleTextContainerStyle = () => {
    if (chatType === SIGNED) {
      return [styles.containerSigned, styles.textContainer];
    }
    return [styles.containerAnon, styles.textContainer];
  };

  const onOpenMediaPreview = (medias, index, navigationLocal) => {
    if (medias.find((media) => media.type === 'video')) {
      navigationLocal.push('VideoViewer', {
        title: 'Video',
        url: medias[index].video_path
      });
    } else {
      navigationLocal.push('ImageViewer', {
        title: 'Photo',
        index,
        images: medias
          .filter((media) => media.type === 'image')
          .map((media) => ({url: media.asset_url}))
      });
    }
  };

  return (
    <View style={styles.chatContainer}>
      <View style={handleTextContainerStyle()}>
        {!isContinuous && (
          <View style={styles.chatTitleContainer}>
            <Text style={styles.userText}>{username}</Text>
            <View style={styles.dot} />
            <Text style={styles.timeText}>{time}</Text>
          </View>
        )}
        {attachments.length > 0 && (
          <View
            style={[
              styles.attachmentContainer,
              attachments?.find((item) => item.type === 'file') ? {height: 'auto'} : {}
            ]}>
            {attachments
              .filter((item, index) => index <= 3)
              .map((item, index) =>
                item.type === 'file' ? (
                  <TouchableOpacity
                    key={item.file_path}
                    style={{flex: 1}}
                    activeOpacity={1}
                    onPress={() => Linking.openURL(item.file_path)}>
                    <View style={styles.attachmentFileContainer}>
                      <View style={styles.attachmentFileContent}>
                        <Text style={styles.attachmentFileName}>{item.file_name}</Text>
                        <View>
                          <Text style={styles.attachmentFileInfo}>
                            {formatBytes(item.file_size)} •{' '}
                            {item.file_name
                              ?.split('.')
                              [item.file_name?.split('.')?.length - 1]?.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.attachmentFileIcon}>
                        <IconFile />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    key={item.thumb_url}
                    style={{
                      width: `${
                        (attachments.length >= 3 && index > 0) || attachments.length >= 4 ? 50 : 100
                      }%`,
                      height: `${attachments.length >= 3 ? 50 : 100 / attachments.length}%`,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    activeOpacity={1}
                    onPress={
                      attachments.length > 0 && item.type !== 'gif'
                        ? () => onOpenMediaPreview(attachments, index, navigation)
                        : null
                    }>
                    {item.type !== 'file' && (
                      <FastImage
                        style={styles.image}
                        source={{
                          uri: item.thumb_url
                        }}
                      />
                    )}
                    {attachments.length > 4 && index === 3 && (
                      <View style={styles.moreOverlay}>
                        <Text style={styles.moreText}>+{attachments.length - 4}</Text>
                      </View>
                    )}
                    {/* Video Play Icon */}
                    {item.video_path && (
                      <View style={styles.moreOverlay}>
                        <IconVideoPlay />
                      </View>
                    )}
                  </TouchableOpacity>
                )
              )}
          </View>
        )}
        <Text ref={messageRef} style={styles.text}>
          {`${message}`}
        </Text>

        {renderIcon()}
      </View>
      {renderAvatar()}
    </View>
  );
};

export default React.memo(ChatItemMyTextV2);
