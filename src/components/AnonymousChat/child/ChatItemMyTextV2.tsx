import * as React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import IconChatCheckMark from '../../../assets/icon/IconChatCheckMark';
import IconChatClockGrey from '../../../assets/icon/IconChatClockGrey';
import {ChatItemMyTextProps} from '../../../../types/component/AnonymousChat/BaseChatItem.types';
import {ChatStatus} from '../../../../types/database/schema/ChannelList.types';
import {SIGNED} from '../../../hooks/core/constant';
import {fonts} from '../../../utils/fonts';
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
    backgroundColor: COLORS.signed_primary
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
  status = ChatStatus.PENDING,
  avatar,
  chatType
}: ChatItemMyTextProps) => {
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
