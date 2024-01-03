import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {StyleSheet, View} from 'react-native';

import Image from '../Image';
import MemoDomainProfilePicture from '../../assets/icon/DomainProfilePictureEmptyState';
import {COLORS} from '../../utils/theme';

const index = ({image, style}) => (
  <View style={[styles.wrapperImage, style]}>
    {image ? (
      <Image source={{uri: image}} style={styles.image} resizeMode={FastImage.resizeMode.cover} />
    ) : (
      <MemoDomainProfilePicture width="24" height="24" />
    )}
  </View>
);

const styles = StyleSheet.create({
  wrapperImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: COLORS.black50,
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 45
  }
});

export default index;
