// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import ContextMenu from 'react-native-context-menu-view';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import useMessageHook from '../../../hooks/screen/useMessageHook';
import {ChatItemMyTextProps} from '../../../../types/component/AnonymousChat/BaseChatItem.types';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

const {width} = Dimensions.get('screen');
const styles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    marginTop: 4,
    marginBottom: 4,
    maxWidth: width,
    paddingRight: 60,
    paddingLeft: 10
  },
  wrapper: {
    flexDirection: 'row'
  },
  chatTitleContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  textContainer: {
    backgroundColor: colors.lightgrey,
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
    marginRight: 8
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
  mr8: {
    marginRight: 8
  }
});

const ChatItemTargetText = ({
  username = 'Anonymous User',
  time = '4h',
  isContinuous = false,
  message = '',
  avatar
}: ChatItemMyTextProps) => {
  const {onContextMenuPressed} = useMessageHook();

  const renderAvatar = React.useCallback(() => {
    if (isContinuous) return <View style={styles.avatar} />;
    return <View style={styles.mr8}>{avatar}</View>;
  }, []);

  return (
    <View style={styles.chatContainer}>
      <View style={styles.wrapper}>
        {renderAvatar()}

        <ContextMenu
          previewBackgroundColor="transparent"
          style={{flex: 1}}
          actions={[
            {title: 'Reply', systemIcon: 'arrow.turn.up.left'},
            {title: 'Copy Message', systemIcon: 'square.on.square'}
          ]}
          onPress={(e) => onContextMenuPressed(e, message)}>
          <View style={{borderRadius: 8}}>
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
        </ContextMenu>
      </View>
    </View>
  );
};

export default ChatItemTargetText;
