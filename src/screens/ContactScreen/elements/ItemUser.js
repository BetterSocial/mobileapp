import * as React from 'react';
import PropTypes from 'prop-types';
import {Animated, Image, Pressable, StyleSheet, Text, View} from 'react-native';

import IconChecklist from '../../../assets/icons/Ic_Checklist';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import {COLORS} from '../../../utils/theme';

const ItemUser = ({photo, username, followed, onPress, userid, isAnon}) => {
  const [isSelect, setIsSelect] = React.useState(false);
  const followIconFadeAnimation = React.useRef(new Animated.Value(0)).current;
  const anonColorCondition = isAnon ? COLORS.anon_primary_15 : COLORS.signed_primary_15;

  React.useEffect(() => {
    if (followed.includes(userid)) {
      setIsSelect(true);
      Animated.timing(followIconFadeAnimation, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true
      }).start();
    } else {
      setIsSelect(false);
      Animated.timing(followIconFadeAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followed, userid]);

  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          styles.containerCard,
          {
            backgroundColor: isSelect ? anonColorCondition : COLORS.almostBlack
          }
        ]}>
        <View style={styles.cardLeft}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: photo || DEFAULT_PROFILE_PIC_PATH
            }}
          />
          <View style={styles.containerTextCard}>
            <Text style={styles.textFullName}>{username}</Text>
          </View>
        </View>
        <View style={styles.containerButton}>
          <Pressable style={styles.followAction(32, 32)}>
            <Animated.View style={{position: 'absolute', top: 4, opacity: followIconFadeAnimation}}>
              <IconChecklist
                width={32}
                height={32}
                color={isAnon ? COLORS.anon_primary : COLORS.signed_primary}
              />
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};

ItemUser.propTypes = {
  photo: PropTypes.string,
  username: PropTypes.string,
  followed: PropTypes.any,
  onPress: PropTypes.func,
  userid: PropTypes.string,
  isAnon: PropTypes.bool
};
export default ItemUser;
const styles = StyleSheet.create({
  containerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tinyLogo: {
    width: 48,
    height: 48,
    borderRadius: 48
  },
  containerTextCard: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 17
  },
  textFullName: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 17,
    alignSelf: 'flex-start'
  },
  containerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  followAction: (width, height) => ({
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center'
  })
});
