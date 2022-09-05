import * as React from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import IconAdd from '../../../assets/icon/IconAdd';
import IconCheck from '../../../assets/icon/IconCheck';

const ItemUser = ({photo, username, bio, followed, onPress, userid}) => {
  const followIconFadeAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (followed.includes(userid)) {
      Animated.timing(followIconFadeAnimation, {
        toValue: 1,
        duration: 250,
      }).start();
    } else {
      Animated.timing(followIconFadeAnimation, {
        toValue: 0,
        duration: 250,
      }).start();
    }
  }, [followed, userid]);

  return (
    <View style={styles.containerCard}>
      <View style={styles.cardLeft}>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: photo,
          }}
        />
        <View style={styles.containerTextCard}>
          <Text style={styles.textFullName}>{username}</Text>
          <Text style={styles.textUsername} numberOfLines={1}>{bio || ''}</Text>
        </View>
      </View>
      <View style={styles.containerButton}>
        <Pressable onPress={onPress} style={styles.followAction(32, 32)}>
          <Animated.View style={{position: 'absolute', opacity: 1}}>
            <IconAdd width={20} height={20} fill="#000000" />
          </Animated.View>
          <Animated.View
            style={{position: 'absolute', opacity: followIconFadeAnimation}}>
            <IconCheck width={32} height={32} fill="#23C5B6" />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

// const MemoItemUser = React.memo(ItemUser, isPropsEqual);
export default ItemUser;
const styles = StyleSheet.create({
  containerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 76,
    paddingHorizontal: 20,
    width: '100%',
    flex: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tinyLogo: {
    width: 48,
    height: 48,
    borderRadius: 48,
  },
  containerTextCard: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 8,
    flex: 1,
  },
  textFullName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
    lineHeight: 21,
    alignSelf: 'flex-start',
  },
  textUsername: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 21,
    alignSelf: 'flex-start',
    width: '100%',
    marginRight: 16,
  },
  containerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  followAction: (width, height) => ({
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  }),
});
