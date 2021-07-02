import * as React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const index = ({image, style}) => {
  return (
    <View style={[styles.wrapperImage, style]}>
      <Image
        source={{
          uri: image
            ? image
            : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
        }}
        style={[styles.image, StyleSheet.absoluteFillObject]}
      />
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
