import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

export interface ChannelListTabItemProps {
  picture: string | null;
  name: string;
  unreadCount: number;
}

const {width} = Dimensions.get('screen');

const ChannelListTabItem = (props: ChannelListTabItemProps) => {
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      maxWidth: width / 2 - 40,
      paddingLeft: 20,
      paddingRight: 20
    },
    name: {
      fontFamily: fonts.inter[500],
      fontSize: 14
    },
    picture: {
      width: 20,
      height: 20,
      marginEnd: 6,
      borderRadius: 10
    },
    unreadCountContainer: {
      width: 16,
      height: 16,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: colors.red,
      bottom: 4
    },
    unreadCount: {
      fontFamily: fonts.inter[500],
      fontSize: 10,
      color: colors.white
    }
  });

  const {name, picture, unreadCount} = props;
  return (
    <View style={styles.container}>
      {typeof picture === 'string' ? (
        <FastImage source={{uri: picture}} style={styles.picture} />
      ) : (
        <FastImage source={picture} style={styles.picture} />
      )}
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
        as {name}
      </Text>
      <View style={styles.unreadCountContainer}>
        <Text style={styles.unreadCount}>{unreadCount}</Text>
      </View>
    </View>
  );
};

export default ChannelListTabItem;
