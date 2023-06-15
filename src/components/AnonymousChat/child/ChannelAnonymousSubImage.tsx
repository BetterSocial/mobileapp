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
    }
  });

  return (
    <View
      style={[
        styles.postNotificationImage,
        {backgroundColor: anonPostNotificationUserInfo?.anon_user_info_color_code}
      ]}>
      <Text>{anonPostNotificationUserInfo?.anon_user_info_emoji_code}</Text>
    </View>
  );
};

export default ChannelAnonymousSubImage;
