import * as React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MemoDomainProfilePicture from '../../assets/icon/DomainProfilePictureEmptyState';

const index = ({image, style}) => {
  return (
    <View style={[styles.wrapperImage, style]}>
      {image ? (
        <Image
          source={{uri: image}}
          style={[styles.image, StyleSheet.absoluteFillObject]}
        />
      ) : (
        <MemoDomainProfilePicture width="36" height="36" />
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
