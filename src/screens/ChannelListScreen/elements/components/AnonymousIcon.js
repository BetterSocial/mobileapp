import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../../../utils/theme';

const AnonymousIcon = ({color, emojiCode, size, withBorder = false}) => {
  const styles = StyleSheet.create({
    postNotificationImage: {
      width: size,
      height: size,
      borderRadius: size / 2,
      right: 0,
      borderWidth: withBorder ? 2 : 0,
      borderColor: COLORS.white,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    anonPostNotificationEmoji: {
      fontSize: size * 0.75,
      alignSelf: 'center',
      textAlign: 'center'
    }
  });

  return (
    <View style={styles.containerAvatar}>
      <View style={[styles.postNotificationImage, {backgroundColor: color}]}>
        <Text style={styles.anonPostNotificationEmoji}>{emojiCode}</Text>
      </View>
    </View>
  );
};

export default AnonymousIcon;
