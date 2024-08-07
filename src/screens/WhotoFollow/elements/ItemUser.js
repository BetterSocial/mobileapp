import * as React from 'react';
import {Animated, Pressable, StyleSheet, View} from 'react-native';

import PropTypes from 'prop-types';
import IconAdd from '../../../assets/icon/IconAdd';
import IconCheck from '../../../assets/icon/IconCheck';
import UserInfo from './UserInfo';
import dimen from '../../../utils/dimen';
import {COLORS} from '../../../utils/theme';

const ItemUser = ({photo, username, bio, followed, onPress, userid, karmaScore}) => {
  const followIconFadeAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (followed.includes(userid)) {
      Animated.timing(followIconFadeAnimation, {
        toValue: 1,
        duration: 250
      }).start();
    } else {
      Animated.timing(followIconFadeAnimation, {
        toValue: 0,
        duration: 250
      }).start();
    }
  }, [followed, userid]);

  return (
    <View style={styles.containerCard}>
      <UserInfo photo={photo} bio={bio} username={username} karmaScore={karmaScore} />
      <View style={styles.containerButton}>
        <Pressable onPress={onPress} style={styles.followAction(24, 24)}>
          <Animated.View style={{position: 'absolute', opacity: 1}}>
            <IconAdd width={dimen.normalizeDimen(24)} height={dimen.normalizeDimen(24)} />
          </Animated.View>
          <Animated.View style={{position: 'absolute', opacity: followIconFadeAnimation}}>
            <IconCheck
              width={dimen.normalizeDimen(24)}
              height={dimen.normalizeDimen(24)}
              fill={COLORS.signed_primary}
            />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

// const MemoItemUser = React.memo(ItemUser, isPropsEqual);
ItemUser.propTypes = {
  photo: PropTypes.string,
  username: PropTypes.string,
  bio: PropTypes.string,
  followed: PropTypes.array,
  onPress: PropTypes.func,
  userid: PropTypes.string,
  karmaScore: PropTypes.number
};
export default ItemUser;
const styles = StyleSheet.create({
  containerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: dimen.normalizeDimen(64),
    paddingHorizontal: dimen.normalizeDimen(20),
    width: '100%',
    flex: 1
  },
  containerButton: {
    width: dimen.normalizeDimen(32),
    height: dimen.normalizeDimen(32),
    borderRadius: dimen.normalizeDimen(16),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: dimen.normalizeDimen(8)
  },
  followAction: (width, height) => ({
    height: dimen.normalizeDimen(height),
    width: dimen.normalizeDimen(width),
    justifyContent: 'center',
    alignItems: 'center'
  })
});
