import React from 'react';
import {Image} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import {fonts} from '../../../utils/fonts';

const ItemUser = ({photo, fullname}) => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{uri: photo}} />
      <Text style={styles.fullname}>{fullname}</Text>
    </View>
  );
};

export default ItemUser;

const styles = StyleSheet.create({
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
