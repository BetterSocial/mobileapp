import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import {
  BaseChatItemProps,
  ChatItemMyTextProps
} from '../../../../types/component/AnonymousChat/BaseChatItem.types';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

const {width} = Dimensions.get('screen');

const ChatItemMyText = ({
  avatar = DEFAULT_PROFILE_PIC_PATH,
  username = 'Anonymous Clown',
  time = '4h',
  isContinuous = false,
  message = 'Ultrices neque op semper blahbla blahri mauris amet, penatibus. pi Amet, mollis quam venenatis di'
}: ChatItemMyTextProps) => {
  const styles = StyleSheet.create({
    chatContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 4,
      marginBottom: 4,
      maxWidth: width,
      paddingLeft: 60,
      paddingRight: 10
    },
    chatTitleContainer: {
      display: 'flex',
      flexDirection: 'row'
    },
    textContainer: {
      backgroundColor: colors.halfBaked,
      paddingLeft: 8,
      paddingRight: 8,
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
    avatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginLeft: 8
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
    }
  });

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
        <Text style={styles.text}>{message}</Text>
      </View>
      <FastImage
        style={styles.avatar}
        source={{
          uri: avatar
        }}
      />
    </View>
  );
};

export default ChatItemMyText;
