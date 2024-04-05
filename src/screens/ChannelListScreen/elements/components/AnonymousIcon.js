import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../../../utils/theme';
import dimen from '../../../../utils/dimen';

const AnonymousIcon = ({color, emojiCode, size, withBorder = false}) => {
  const styles = StyleSheet.create({
    postNotificationImage: {
      width: size,
      height: size,
      borderRadius: size / 2,
      right: 0,
      borderWidth: withBorder ? 2 : 0,
      borderColor: COLORS.almostBlack,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    },
    anonPostNotificationEmoji: {
      display: 'flex',
      fontSize: dimen.normalizeDimen(size / 2),
      width: size,
      alignSelf: 'center',
      textAlign: 'center',
      justifyContent: 'center',
      marginLeft: size * 0.04,
      alignItems: 'center'
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
