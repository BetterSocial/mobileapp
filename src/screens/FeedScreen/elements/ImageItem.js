import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import useImageLayout from '../hooks/useImageLayout';

const ImageItem = ({image, index, onImageClick, images, mode}) => {
  const {handleImageWidth} = useImageLayout();
  const onPress = () => onImageClick(index);
  if (index > 3) return null;
  return (
    <>
      {index > 3 ? null : (
        <Pressable testID="press" style={handleImageWidth(images, index)} onPress={onPress}>
          {index === 3 && images.length > 4 ? (
            <View style={styles.backdropBg}>
              <Text style={styles.allImageFont}>{images.length - 4}+ </Text>
            </View>
          ) : null}
          <React.Fragment>
            <FastImage
              source={{uri: image}}
              style={styles.imageStyle}
              resizeMode={mode || FastImage.resizeMode.cover}
            />
          </React.Fragment>
        </Pressable>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    height: '100%',
    width: '100%'
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
