import * as React from 'react';
import FastImage from 'react-native-fast-image';
import IconEP from 'react-native-vector-icons/Entypo';
import {StyleSheet, Text, View} from 'react-native';

import CustomPressable from '../CustomPressable';
import IcArrowBackWhite from '../../assets/arrow/Ic_arrow_back_white';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {SIGNED, CHANNEL_GROUP} from '../../hooks/core/constant';
import ChannelImage from '../ChatList/elements/ChannelImage';

const styles = StyleSheet.create({
  container: (chatType?: string) => ({
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: chatType === SIGNED ? colors.darkBlue : colors.bondi_blue,
    height: 50,
    alignItems: 'center'
  }),
  backButton: {
    paddingLeft: 22,
    paddingRight: 20,
    height: 50,
    justifyContent: 'center'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
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
    color: colors.white,
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

const ChatDetailHeader = ({
  avatar = DEFAULT_PROFILE_PIC_PATH,
  user,
  onBackPress = () => console.log('onBackPress'),
  onThreeDotPress = () => console.log('onThreeDotPress'),
  onAvatarPress = () => console.log('onAvatarPress'),
  anon_user_info_emoji_code,
  anon_user_info_color_code,
  type,
  channel
}) => {
  console.log({channel}, 'channel man');

  const handleDefaultImage = () => {
    return (
      <ChannelImage>
        <ChannelImage.Big type={channel?.channelType} image={avatar} />
      </ChannelImage>
    );
  };

  return (
    <View style={styles.container(type)}>
      <CustomPressable style={styles.backButton} onPress={onBackPress}>
        <IcArrowBackWhite width={20} height={12} />
      </CustomPressable>
      <CustomPressable style={styles.textContainer} onPress={onAvatarPress}>
        {anon_user_info_emoji_code ? (
          <View style={[styles.avatar, {backgroundColor: anon_user_info_color_code}]}>
            <Text>{anon_user_info_emoji_code} </Text>
          </View>
        ) : (
          <>{handleDefaultImage()}</>
        )}
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>
          {user}
        </Text>
      </CustomPressable>
      <CustomPressable style={styles.threeDot} onPress={onThreeDotPress}>
        <IconEP name="dots-three-vertical" size={20} color={colors.white} />
      </CustomPressable>
      <FastImage />
    </View>
  );
};

export default ChatDetailHeader;
