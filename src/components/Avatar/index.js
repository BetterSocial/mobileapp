import * as React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image'

import MemoDomainProfilePicture from '../../assets/icon/DomainProfilePictureEmptyState';

const index = ({image, style}) => {
  return (
    <View style={[styles.wrapperImage, style]}>
      {image ? (
        <FastImage
          source={{uri: image, priority: FastImage.priority.normal}}
          style={[styles.image, StyleSheet.absoluteFillObject]}
          resizeMode={FastImage.resizeMode.contain}
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
