import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import Image from '../../components/Image';

import MemoDomainProfilePicture from '../../assets/icon/DomainProfilePictureEmptyState';
import FastImage from 'react-native-fast-image';

const index = ({image, style}) => {
  return (
    <View style={[styles.wrapperImage, style]}>
      {image ? (
        <Image
          source={{uri: image}}
          style={StyleSheet.flatten([styles.image, StyleSheet.absoluteFillObject])}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : (
        <MemoDomainProfilePicture width="24" height="24" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 45,
  },
});

export default index;
