import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';
import AnonymousIcon from '../../assets/icon/AnonymousIcon';

export interface ChannelListTabItemProps {
  picture: string | null;
  name: string;
  unreadCount: number;
  type: 'SIGNED' | 'ANONYMOUS';
  testID?: string;
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
      fontSize: 14,
      color: props.type === 'SIGNED' ? COLORS.signed_primary : COLORS.anon_primary
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
      backgroundColor: COLORS.redalert,
      bottom: 4
    },
    unreadCount: {
      fontFamily: fonts.inter[500],
      fontSize: 10,
      color: COLORS.almostBlack
    }
  });

  const {name, picture, unreadCount, testID} = props;
  let unreadCountString = unreadCount.toString();
  if (unreadCount > 9) unreadCountString = '9+';

  return (
    <View style={styles.container} testID={testID}>
      {typeof picture === 'string' ? (
        <FastImage source={{uri: picture}} style={styles.picture} />
      ) : (
        <View style={styles.picture}>
          <AnonymousIcon size={20} fill={COLORS.anon_primary} />
        </View>
        // <FastImage source={picture} style={styles.picture} />
      )}
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
        as {name}
      </Text>
      {unreadCount > 0 && (
        <View testID={`${testID}-unread-count`} style={styles.unreadCountContainer}>
          <Text style={styles.unreadCount}>{unreadCountString}</Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(ChannelListTabItem);
