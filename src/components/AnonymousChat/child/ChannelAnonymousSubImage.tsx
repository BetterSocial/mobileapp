import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {colors} from '../../../utils/colors';

const ChannelAnonymousSubImage = ({anonPostNotificationUserInfo = null}) => {
  const styles = StyleSheet.create({
    postNotificationImage: {
      width: 24,
      height: 24,
      borderRadius: 16,
      position: 'absolute',
      top: 30,
      right: 0,
      borderWidth: 2,
      borderColor: colors.white,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    anonPostNotificationEmoji: {
      fontSize: 10,
      alignSelf: 'center',
      textAlign: 'center'
    }
  });

  return (
    <View
      testID="channel-anonymous-sub-image"
      style={{
        ...styles.postNotificationImage,
        ...{backgroundColor: anonPostNotificationUserInfo?.anon_user_info_color_code}
      }}>
      <Text style={styles.anonPostNotificationEmoji} testID="channel-anonymous-sub-image-emoji">
        {anonPostNotificationUserInfo?.anon_user_info_emoji_code}
      </Text>
    </View>
  );
};

export default ChannelAnonymousSubImage;
