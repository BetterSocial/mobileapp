import * as React from 'react';
import FastImage from 'react-native-fast-image';
import IconEP from 'react-native-vector-icons/Entypo';
import {StyleSheet, Text, View} from 'react-native';

import CustomPressable from '../CustomPressable';
import MemoIc_arrow_back_white from '../../assets/arrow/Ic_arrow_back_white';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const AnonymousChatHeader = ({
  avatar = DEFAULT_PROFILE_PIC_PATH,
  user,
  onBackPress = () => console.log('onBackPress'),
  onThreeDotPress = () => console.log('onThreeDotPress'),
  onAvatarPress = () => console.log('onAvatarPress')
}) => {
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: COLORS.signed_primary,
      height: 50,
      alignItems: 'center'
    },
    backButton: {
      paddingLeft: 22,
      paddingRight: 20,
      height: 50,
      justifyContent: 'center'
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center'
    },
    text: {
      fontFamily: fonts.inter[600],
      color: COLORS.almostBlack,
      fontSize: 14,
      lineHeight: 17,
      marginLeft: 10,
      flex: 1
    },
    threeDot: {
      paddingRight: 22,
      paddingLeft: 22,
      justifyContent: 'center',
      height: 50
    }
  });

  return (
    <View style={styles.container}>
      <CustomPressable testID="pressable-back" style={styles.backButton} onPress={onBackPress}>
        <MemoIc_arrow_back_white width={20} height={12} />
      </CustomPressable>
      <CustomPressable
        testID="pressable-avatar"
        style={styles.textContainer}
        onPress={onAvatarPress}>
        <FastImage
          testID="avatar"
          style={styles.avatar}
          source={{
            uri: avatar
          }}
        />
        <Text testID="username" numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
          {user}
        </Text>
      </CustomPressable>
      <CustomPressable testID="pressable-option" style={styles.threeDot} onPress={onThreeDotPress}>
        <IconEP name="dots-three-vertical" size={20} color={COLORS.almostBlack} />
      </CustomPressable>
      <FastImage />
    </View>
  );
};

export default AnonymousChatHeader;
