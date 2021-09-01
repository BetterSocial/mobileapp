import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Pressable,
  TouchableNativeFeedback,
} from 'react-native';

import CheckIcon from '../../../../assets/icons/check.svg';
import AddIcon from '../../../../assets/icons/add.svg';
import MemoIc_Checklist from '../../../assets/icons/Ic_Checklist';

const ItemUser = ({photo, username, bio, followed, onPress, userid}) => {
  let followIconFadeAnimation = React.useRef(new Animated.Value(0)).current;

  const onFollowButtonPressed = () => {
    Animated.timing(followIconFadeAnimation, {
      toValue: followed.includes(userid) ? 0 : 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    onPress();
  };

  React.useEffect(() => {
    if (followed.includes(userid)) {
      Animated.timing(followIconFadeAnimation, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(followIconFadeAnimation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [followed, userid]);

  return (
    <Pressable onPress={onPress}>
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
          </View>
        </View>
        <View style={styles.containerButton}>
          <Pressable style={styles.followAction(32, 32)}>
            {/* {followed.includes(userid) && (
              <MemoIc_Checklist width={32} height={32} />
            )} */}
            {/* <Animated.View style={{position: 'absolute', opacity: 1}}>
            <AddIcon width={20} height={20} fill="#000000" />
          </Animated.View>
          */}
            <Animated.View
              style={{position: 'absolute', opacity: followIconFadeAnimation}}>
              <MemoIc_Checklist width={32} height={32} />
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </Pressable>
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
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  textFullName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    color: '#000000',
    lineHeight: 21,
    alignSelf: 'flex-start',
  },
  containerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followAction: (width, height) => ({
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  }),
});
