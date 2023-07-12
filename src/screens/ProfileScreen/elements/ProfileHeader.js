/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import ArrowLeftIcon from '../../../assets/icons/images/arrow-left.svg';
import GlobalButton from '../../../components/Button/GlobalButton';
import SettingIcon from '../../../assets/icons/images/setting.svg';
import ShareButtonIcon from '../../../components/ShareIcon/index';
import ShareIcon from '../../../assets/icons/Ic_share';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

const ProfileHeader = ({
  onShareClicked = () => {},
  onSettingsClicked = () => {},
  username = '',
  hideSetting = false,
  showArrow = false
}) => {
  const navigation = useNavigation();
  const __renderSettings = () => {
    if (hideSetting) return null;

    return (
      <TouchableOpacity onPress={onSettingsClicked}>
        <SettingIcon width={20} height={20} fill={colors.black} />
      </TouchableOpacity>
    );
  };

  const __renderBackArrow = () => {
    if (!showArrow) return <></>;

    return (
      <View style={styles.wrapNameAndbackButton}>
        <GlobalButton buttonStyle={styles.noPl} onPress={() => navigation.goBack()}>
          <ArrowLeftIcon width={20} height={12} fill="#000" />
        </GlobalButton>
      </View>
    );
  };

  const handleIconSize = () => {
    if (Platform.OS === 'ios') {
      return 22;
    }
    return 20;
  };

  return (
    <View style={styles.header}>
      {__renderBackArrow()}
      <Text numberOfLines={1} style={styles.textUsername}>
        {username}
      </Text>
      <View style={styles.wrapHeaderButton}>
        <View style={hideSetting ? styles.btnShareWithoutSetting : styles.btnShare}>
          <TouchableOpacity onPress={onShareClicked}>
            <ShareIcon
              color="black"
              width={handleIconSize()}
              height={handleIconSize()}
              fill={colors.black}
            />
          </TouchableOpacity>
        </View>

        {__renderSettings()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnShare: {marginRight: 20},
  btnShareWithoutSetting: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20
  },
  textUsername: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
    color: colors.black,
    flex: 1
  },
  wrapHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  wrapNameAndbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  noPl: {
    paddingLeft: 0
  }
});

export default React.memo(ProfileHeader);
