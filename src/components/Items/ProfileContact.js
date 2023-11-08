import * as React from 'react';
import Mi from 'react-native-vector-icons/MaterialIcons';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import MemoIc_Checklist from '../../assets/icons/Ic_Checklist';
import {COLORS} from '../../utils/theme';
import {fonts, normalize, normalizeFontSize} from '../../utils/fonts';
import {colors} from '../../utils/colors';
import dimen from '../../utils/dimen';
import {ANONYMOUS_USER} from '../../hooks/core/constant';
import {isContainUrl} from '../../utils/Utils';

const ProfileContact = ({
  photo,
  fullname,
  onPress,
  select,
  showArrow,
  userId,
  item,
  ImageComponent = null,
  disabled = false,
  from
}) => {
  const handleYouText = () => {
    if (!from && (!isContainUrl(item?.user?.image) || item?.user?.name === ANONYMOUS_USER)) {
      return '(You)';
    }
    return '';
  };

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: COLORS.gray1,
        borderless: false,
        borderRadius: 10
      }}
      disabled={!showArrow || disabled}
      style={styles.pressable}>
      <View style={styles.container}>
        <View style={styles.profile}>
          {ImageComponent || (
            <Image
              testID="image"
              style={styles.image}
              source={{uri: photo !== '' ? photo : undefined}}
            />
          )}
          <Text testID="name" style={styles.fullname(userId === item?.user_id)}>
            {fullname} {handleYouText()}
          </Text>
        </View>
        {showArrow && (
          <>
            {userId !== item.user_id && (
              <View>
                <Mi name="arrow-forward-ios" size={18} />
              </View>
            )}
          </>
        )}
        {select && (
          <View testID="selected">
            <MemoIc_Checklist />
          </View>
        )}
      </View>
    </Pressable>
  );
};

ProfileContact.propTypes = {
  disabled: PropTypes.bool,
  item: {
    user_id: PropTypes.string
  }
};

export default React.memo(ProfileContact);

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  image: {
    height: normalize(48),
    width: normalize(48),
    borderRadius: normalize(24),
    marginRight: 17
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: dimen.normalizeDimen(12),
    paddingHorizontal: dimen.normalizeDimen(15)
  },
  fullname: (isMe) => ({
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[500],
    color: isMe ? colors.darkBlue : 'black',
    lineHeight: normalizeFontSize(16.94)
  }),
  pressable: {
    height: '100%'
  },
  arroIcon: {
    height: 14,
    width: 14
  }
});
