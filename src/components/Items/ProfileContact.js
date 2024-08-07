import * as React from 'react';
import Mi from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import IconChecklist from '../../assets/icons/Ic_Checklist';
import dimen from '../../utils/dimen';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import {COLORS} from '../../utils/theme';
import {normalize, normalizeFontSize} from '../../utils/fonts';

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
  isYou
}) => {
  const {anonProfileId, signedProfileId} = useProfileHook();
  const handleYouText = () => {
    if (isYou) {
      return '(You)';
    }

    if (anonProfileId === item?.user_id || signedProfileId === item?.user_id) {
      return '(You)';
    }
    return '';
  };

  return (
    <Pressable
      onPress={onPress}
      android_ripple={{
        color: COLORS.gray110,
        borderless: false,
        borderRadius: 10
      }}
      disabled={disabled}
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
        {showArrow &&
          !(isYou || anonProfileId === item?.user_id || signedProfileId === item?.user_id) && (
            <>
              {userId !== item.user_id && (
                <View>
                  <Mi name="arrow-forward-ios" size={18} color={COLORS.white} />
                </View>
              )}
            </>
          )}
        {select && (
          <View testID="selected">
            <IconChecklist />
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
  },
  photo: PropTypes.string,
  fullname: PropTypes.string,
  onPress: PropTypes.func,
  select: PropTypes.bool,
  showArrow: PropTypes.bool,
  userId: PropTypes.string,
  ImageComponent: PropTypes.node,
  isYou: PropTypes.bool
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

    color: isMe ? COLORS.signed_primary : COLORS.white,
    lineHeight: normalizeFontSize(16.94),
    fontWeight: 'bold'
  }),
  pressable: {
    height: '100%'
  },
  arroIcon: {
    height: 14,
    width: 14
  }
});
