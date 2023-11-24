import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {StyleSheet, Text, View} from 'react-native';

import dimen from '../../utils/dimen';
import {colors} from '../../utils/colors';
import {fonts, normalizeFontSize} from '../../utils/fonts';

export interface ChannelListTabItemProps {
  picture: string | null;
  name: string;
  type: 'SIGNED' | 'ANONYMOUS';
  testID?: string;
}

const ChannelListHeaderItem = (props: ChannelListTabItemProps) => {
  const {name, picture, type, testID} = props;

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: dimen.normalizeDimen(48),
      marginBottom: dimen.normalizeDimen(2),
      paddingLeft: dimen.normalizeDimen(30),
      paddingRight: dimen.normalizeDimen(30),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.white,
      borderBottomWidth: 2,
      borderBottomColor: type === 'SIGNED' ? colors.darkBlue : colors.anon_primary
    },
    name: {
      fontFamily: fonts.inter[500],
      fontSize: normalizeFontSize(14),
      color: type === 'SIGNED' ? colors.darkBlue : colors.anon_primary
    },
    picture: {
      width: dimen.normalizeDimen(20),
      height: dimen.normalizeDimen(20),
      marginRight: dimen.normalizeDimen(6),
      borderRadius: dimen.normalizeDimen(10)
    }
  });

  return (
    <View style={styles.container} testID={testID}>
      {typeof picture === 'string' ? (
        <FastImage source={{uri: picture}} style={styles.picture} />
      ) : (
        <FastImage source={picture} style={styles.picture} />
      )}
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>
        as {name}
      </Text>
    </View>
  );
};

export default React.memo(ChannelListHeaderItem);