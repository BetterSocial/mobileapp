import * as React from 'react';
import FastImage from 'react-native-fast-image';
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
import {ChatItemMyTextProps} from '../../../../types/component/AnonymousChat/BaseChatItem.types';
import {ChatStatus} from '../../../../types/database/schema/ChannelList.types';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

const {width} = Dimensions.get('screen');

const AVATAR_SIZE = 24;
const CONTAINER_LEFT_PADDING = 60;
const CONTAINER_RIGHT_PADDING = 10;
const AVATAR_LEFT_MARGIN = 8;
const BUBBLE_LEFT_PADDING = 8;
const BUBBLE_RIGHT_PADDING = 8;

const targetLastLineWidth =
  width -
  CONTAINER_LEFT_PADDING -
  CONTAINER_RIGHT_PADDING -
  AVATAR_SIZE -
  AVATAR_LEFT_MARGIN -
  BUBBLE_LEFT_PADDING -
  BUBBLE_RIGHT_PADDING;

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
  textContainer: {
    backgroundColor: colors.halfBaked,
    paddingLeft: BUBBLE_LEFT_PADDING,
    paddingRight: BUBBLE_RIGHT_PADDING,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 8,
    flex: 1
  },
  userText: {
    fontFamily: fonts.inter[600],
    fontSize: 12,
    lineHeight: 19.36
  },
  text: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    lineHeight: 19.36
  },
  textHidden: {
    position: 'absolute',
    opacity: 0,
    left: 0,
    right: 0
  },
  lastLineMargin: {
    flexGrow: 1,
    minWidth: 0
  },
  lastLineContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  lastLineContainerColumn: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column'
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
    backgroundColor: colors.black,
    alignSelf: 'center'
  },
  timeText: {
    fontFamily: fonts.inter[200],
    fontSize: 10,
    lineHeight: 12.19,
    alignSelf: 'center'
  },
  checkContainerOnLayoutColumn: {
    flexBasis: '100%',
    alignSelf: 'flex-end'
  },
  checkContainerOnLayout: {
    alignSelf: 'flex-end'
  },
  textStackContainer: {
    marginTop: 4,
    marginBottom: 4
  }
});

const ChatItemMyText = ({
  avatar = DEFAULT_PROFILE_PIC_PATH,
  username = 'Anonymous Clown',
  time = '4h',
  isContinuous = false,
  message = 'Ultrices neque op semper blahbla blahri mauris amet, penatibus. pi Amet, mollis quam venenatis di',
  status = ChatStatus.PENDING
}: ChatItemMyTextProps) => {
  const messageRef = React.useRef<Text>(null);
  const [textComponent, setTextComponent] = React.useState<Text[]>([]);

  const handleTextWidthLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    const {lines} = event.nativeEvent;
    const lineTextComponent = lines?.map((line, index) => {
      const isLastLine = index === lines?.length - 1;
      if (!isLastLine)
        return (
          <Text key={line?.text} style={styles.text}>
            {line?.text}
          </Text>
        );

      const lastLine = lines[lines.length - 1];
      const lastLineWidth = lastLine?.width;
      const lastLineStyle = [styles.text, styles.lastLineMargin];
      if (targetLastLineWidth - lastLineWidth < 24)
        return (
          <View key={line?.text} style={styles.lastLineContainerColumn}>
            <Text key={line?.text} style={lastLineStyle}>
              {line?.text}
            </Text>
            <View style={styles.checkContainerOnLayoutColumn}>
              {status === ChatStatus.PENDING ? (
                <IconChatClockGrey height={16} width={16} />
              ) : (
                <IconChatCheckMark />
              )}
            </View>
          </View>
        );

      return (
        <View key={line?.text} style={styles.lastLineContainer}>
          <Text key={line?.text} style={lastLineStyle}>
            {line?.text}
          </Text>
          <View style={styles.checkContainerOnLayout}>
            {status === ChatStatus.PENDING ? (
              <IconChatClockGrey height={16} width={16} />
            ) : (
              <IconChatCheckMark />
            )}
          </View>
        </View>
      );
    });

    setTextComponent(lineTextComponent);
  };

  return (
    <View style={styles.chatContainer}>
      <View style={styles.textContainer}>
        {!isContinuous && (
          <View style={styles.chatTitleContainer}>
            <Text style={styles.userText}>{username}</Text>
            <View style={styles.dot} />
            <Text style={styles.timeText}>{time}</Text>
          </View>
        )}
        <Text
          ref={messageRef}
          style={[styles.text, styles.textHidden]}
          onTextLayout={handleTextWidthLayout}>
          {message}
        </Text>
        <View style={styles.textStackContainer}>
          {textComponent?.map((component) => component)}
        </View>
      </View>
      {isContinuous ? (
        <View style={styles.avatar} />
      ) : (
        <FastImage
          style={styles.avatar}
          source={{
            uri: avatar
          }}
        />
      )}
    </View>
  );
};

export default React.memo(ChatItemMyText);
