import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export type AnonPostNotificationUserInfo = {
  anon_user_info_color_code: string;
  anon_user_info_emoji_code: string;
};

export type ChannelAnonymousImageProps = {
  anonPostNotificationUserInfo?: any;
  imageStyle?: any;
};

const ChannelAnonymousImage = ({
  anonPostNotificationUserInfo = null,
  imageStyle = {}
}: ChannelAnonymousImageProps) => {
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
      testID="anonPostNotificationImage"
      style={{
        ...imageStyle,
        ...styles.postNotificationImage,
        ...{
          backgroundColor: anonPostNotificationUserInfo?.anon_user_info_color_code
        }
      }}>
      <Text style={styles.anonPostNotificationEmoji} testID="anonPostNotificationEmoji">
        {anonPostNotificationUserInfo?.anon_user_info_emoji_code}
      </Text>
    </View>
  );
};

export default ChannelAnonymousImage;
