// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import ContextMenu from 'react-native-context-menu-view';
import {
  Dimensions,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TextLayoutEventData,
  View
} from 'react-native';

import IconChatCheckMark from '../../../assets/icon/IconChatCheckMark';
import IconChatClockGrey from '../../../assets/icon/IconChatClockGrey';
import useMessageHook from '../../../hooks/screen/useMessageHook';
import {ChatItemMyTextProps} from '../../../../types/component/AnonymousChat/BaseChatItem.types';
import {ChatStatus} from '../../../../types/database/schema/ChannelList.types';
import {SIGNED} from '../../../hooks/core/constant';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

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
    marginTop: 4,
    marginBottom: 4,
    maxWidth: width,
    paddingLeft: CONTAINER_LEFT_PADDING,
    paddingRight: CONTAINER_RIGHT_PADDING
  },
  wrapper: {
    flexDirection: 'row'
  },
  chatTitleContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  containerSigned: {
    backgroundColor: colors.darkBlue
  },
  containerAnon: {
    backgroundColor: colors.anon_primary
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
    lineHeight: 19.36,
    color: colors.white
  },
  text: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    lineHeight: 19.36,
    marginBottom: 4,
    color: colors.white
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
    backgroundColor: colors.white,
    alignSelf: 'center'
  },
  timeText: {
    fontFamily: fonts.inter[200],
    fontSize: 10,
    lineHeight: 12.19,
    alignSelf: 'center',
    color: colors.white
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
  const {onContextMenuPressed} = useMessageHook();
  const messageRef = React.useRef<Text>(null);
  const [isNewLine, setIsNewLine] = React.useState(true);

  const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    const {lines} = event.nativeEvent;
    const lastLine = lines[lines.length - 1];
    const lastLineWidth = lastLine?.width;
    const isCalculatedNewLine = targetLastLineWidth - lastLineWidth < 24;
    setIsNewLine(isCalculatedNewLine);
  };

  const renderIcon = React.useCallback(() => {
    if (status === ChatStatus.PENDING)
      return (
        <View style={styles.icon}>
          <IconChatClockGrey color={colors.silver} width={12} height={12} />
        </View>
      );

    return (
      <View style={styles.icon}>
        <IconChatCheckMark color={colors.silver} />
      </View>
    );
  }, []);

  const renderAvatar = React.useCallback(() => {
    if (isContinuous) return <View style={styles.avatar} />;
    return <View style={styles.ml8}>{avatar}</View>;
  }, []);

  const textContainerStyle = [
    chatType === SIGNED ? styles.containerSigned : styles.containerAnon,
    styles.textContainer,
    isNewLine && styles.textContainerNewLine
  ];

  return (
    <View style={styles.chatContainer}>
      <View style={styles.wrapper}>
        <ContextMenu
          previewBackgroundColor="transparent"
          style={{flex: 1}}
          actions={[
            {title: 'Reply', systemIcon: 'arrow.turn.up.left'},
            {title: 'Copy Message', systemIcon: 'square.on.square'},
            {title: 'Delete Message', systemIcon: 'trash', destructive: true}
          ]}
          onPress={(e) => onContextMenuPressed(e, message)}>
          <View style={{borderRadius: 8}}>
            <View style={textContainerStyle}>
              {!isContinuous && (
                <View style={styles.chatTitleContainer}>
                  <Text style={styles.userText}>{username}</Text>
                  <View style={styles.dot} />
                  <Text style={styles.timeText}>{time}</Text>
                </View>
              )}

              <Text ref={messageRef} style={styles.text} onTextLayout={onTextLayout}>
                {`${message}`}
              </Text>

              {renderIcon()}
            </View>
          </View>
        </ContextMenu>

        {renderAvatar()}
      </View>
    </View>
  );
};

export default React.memo(ChatItemMyTextV2);
