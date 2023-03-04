import React from 'react';
import {Pressable, Text, View, StyleSheet, Dimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import Image from '../../../components/Image';
import useImageLayout from '../hooks/useImageLayout';

const {width} = Dimensions.get('window');

const ImageItem = ({image, index, length, onImageClick}) => {
  const {handleImageWidth} = useImageLayout();

  const onPress = () => onImageClick(index);

  if (index > 3) return null;
  return (
    <Pressable testID="press" style={handleImageWidth(image, index)} onPress={onPress}>
      {index === 3 && length - 4 > 0 ? (
        <View style={styles.backdropBg}>
          <Text style={styles.allImageFont}>{length - 4}+ </Text>
        </View>
      ) : null}
      <Image
        source={{uri: image}}
        style={styles.imageStyle}
        resizeMode={FastImage.resizeMode.contain}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    height: '100%',
    width
  },
  backdropBg: {
    position: 'absolute',
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    zIndex: 1,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  allImageFont: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold'
  }
});
export default React.memo(ImageItem);
