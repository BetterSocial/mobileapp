import * as React from 'react';
import FastImage from 'react-native-fast-image';
import IconEP from 'react-native-vector-icons/Entypo';
import {StyleSheet, Text, View} from 'react-native';

import AnonymousIcon from '../../screens/ChannelListScreen/elements/components/AnonymousIcon';
import ChannelImage from '../ChatList/elements/ChannelImage';
import CustomPressable from '../CustomPressable';
import IcArrowBackWhite from '../../assets/arrow/Ic_arrow_back_white';
import dimen from '../../utils/dimen';
import {COLORS} from '../../utils/theme';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {SIGNED} from '../../hooks/core/constant';
import {fonts} from '../../utils/fonts';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: 50,
    alignItems: 'center'
  },
  bgsigned_primary: {
    backgroundColor: COLORS.signed_secondary
  },
  bgBondiBlue: {
    backgroundColor: COLORS.anon_secondary
  },
  backButton: {
    paddingLeft: 22,
    paddingRight: 20,
    height: 50,
    justifyContent: 'center'
  },
  avatar: {
    width: dimen.normalizeDimen(38),
    height: dimen.normalizeDimen(38),
    borderRadius: dimen.normalizeDimen(38),
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  text: {
    fontFamily: fonts.inter[600],
    color: COLORS.white2,
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
  },
  avatarImage: {
    height: dimen.normalizeDimen(40),
    width: dimen.normalizeDimen(40),
    borderRadius: dimen.normalizeDimen(20)
  }
});

const ChatDetailHeader = ({
  avatar = DEFAULT_PROFILE_PIC_PATH,
  user,
  onBackPress = () => console.log('onBackPress'),
  onThreeDotPress = () => console.log('onThreeDotPress'),
  onAvatarPress = () => console.log('onAvatarPress'),
  anon_user_info_emoji_code = null,
  anon_user_info_color_code = null,
  type,
  channel
}) => {
  const bgHeaderStyle = () => {
    if (type === SIGNED) return styles.bgsigned_primary;
    return styles.bgBondiBlue;
  };

  const renderAvatar = () => {
    if (anon_user_info_emoji_code) {
      return (
        <AnonymousIcon
          color={anon_user_info_color_code}
          emojiCode={anon_user_info_emoji_code}
          size={dimen.normalizeDimen(38)}
        />
      );
    }

    return (
      <ChannelImage>
        <ChannelImage.Big
          style={styles.avatarImage}
          type={channel?.channelType}
          image={avatar || DEFAULT_PROFILE_PIC_PATH}
        />
      </ChannelImage>
    );
  };

  return (
    <View style={[styles.container, bgHeaderStyle()]}>
      <CustomPressable style={styles.backButton} onPress={onBackPress}>
        <IcArrowBackWhite width={20} height={12} />
      </CustomPressable>
      <CustomPressable style={styles.textContainer} onPress={onAvatarPress}>
        {renderAvatar()}
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
          {user}
        </Text>
      </CustomPressable>
      <CustomPressable style={styles.threeDot} onPress={onThreeDotPress}>
        <IconEP name="dots-three-vertical" size={20} color={COLORS.white2} />
      </CustomPressable>
      <FastImage />
    </View>
  );
};

export default React.memo(ChatDetailHeader);
