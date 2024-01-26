import * as React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import {ChatItemMyTextProps} from '../../../../types/component/AnonymousChat/BaseChatItem.types';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const {width} = Dimensions.get('screen');
const styles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
    maxWidth: width,
    paddingRight: 60,
    paddingLeft: 10
  },
  chatTitleContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  textContainer: {
    backgroundColor: COLORS.lightgrey,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 8,
    borderRadius: 8,
    borderTopStartRadius: 0,
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
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 4
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
  mr8: {
    marginRight: 4
  }
});

const ChatItemTargetText = ({
  username = 'Anonymous User',
  time = '4h',
  isContinuous = false,
  message = '',
  avatar
}: ChatItemMyTextProps) => {
  const renderAvatar = React.useCallback(() => {
    if (isContinuous) return <View style={styles.avatar} />;
    return <View style={styles.mr8}>{avatar}</View>;
  }, []);

  return (
    <View style={styles.chatContainer}>
      {renderAvatar()}
      <View style={styles.textContainer}>
        {!isContinuous && (
          <View testID="chat-item-user-info" style={styles.chatTitleContainer}>
            <Text style={styles.userText}>{username}</Text>
            <View style={styles.dot} />
            <Text style={styles.timeText}>{time}</Text>
          </View>
        )}
        <Text testID="chat-item-message" style={styles.text}>
          {message}
        </Text>
      </View>
    </View>
  );
};

export default ChatItemTargetText;
