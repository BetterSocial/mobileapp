import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const ChannelAnonymousImage = ({anonPostNotificationUserInfo = null, imageStyle = {}}) => {
  const styles = StyleSheet.create({
    postNotificationImage: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    anonPostNotificationEmoji: {
      fontSize: 30,
      alignSelf: 'center',
      textAlign: 'center'
    }
  });
  return (
    <View
      style={[
        imageStyle,
        styles.postNotificationImage,
        {
          backgroundColor: anonPostNotificationUserInfo?.anon_user_info_color_code
        }
      ]}>
      <Text style={styles.anonPostNotificationEmoji}>
        {anonPostNotificationUserInfo?.anon_user_info_emoji_code}
      </Text>
    </View>
  );
};

export default ChannelAnonymousImage;
