import * as React from 'react';
import {Image, StyleSheet} from 'react-native';

const ProfileMessage = ({image}) => {
  return (
    <Image
      source={{
        uri: image,
      }}
      style={styles.image}
    />
  );
};

export default ProfileMessage;

const styles = StyleSheet.create({
  image: {
    width: 24,
    height: 24,
    borderRadius: 24 / 2,
  },
});
