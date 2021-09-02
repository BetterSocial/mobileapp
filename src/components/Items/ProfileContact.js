import * as React from 'react';
import {
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MemoIc_Checklist from '../../assets/icons/Ic_Checklist';

import {fonts} from '../../utils/fonts';

const ProfileContact = ({photo, fullname, onPress, select}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.profile}>
          <Image style={styles.image} source={{uri: photo}} />
          <Text style={styles.fullname}>{fullname}</Text>
        </View>
        {select && <MemoIc_Checklist />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ProfileContact;

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    height: 48,
    width: 48,
    borderRadius: 24,
    marginRight: 17,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  fullname: {
    fontSize: 14,
    fontFamily: fonts.inter[500],
    color: '#000',
    lineHeight: 16.94,
  },
});
