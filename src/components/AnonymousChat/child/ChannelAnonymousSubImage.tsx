import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import dimen from '../../../utils/dimen';
import {colors} from '../../../utils/colors';

const ChannelAnonymousSubImage = ({anonPostNotificationUserInfo = null}) => {
  const styles = StyleSheet.create({
    postNotificationImage: {
      width: dimen.normalizeDimen(24),
      height: dimen.normalizeDimen(24),
      borderRadius: dimen.normalizeDimen(12),
      position: 'absolute',
      top: dimen.normalizeDimen(30 + 12),
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
