/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// TODO: Garry, need icon props fill color
import ArrowLeftIcon from '../../../assets/icons/images/arrow-left.svg';
import SettingIcon from '../../../assets/icons/images/setting.svg';
import ShareIcon from '../../../assets/icons/Ic_share';
import {fonts} from '../../../utils/fonts';
import GlobalButton from '../../../components/Button/GlobalButton';
import {COLORS} from '../../../utils/theme';

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
        <SettingIcon width={20} height={20} fill={COLORS.black} />
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
            <ShareIcon width={handleIconSize()} height={handleIconSize()} color={COLORS.white2} />
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
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  textUsername: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
    color: COLORS.black,
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
