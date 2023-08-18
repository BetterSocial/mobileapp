import * as React from 'react';

import {ImageBackground, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageItem from './ImageItem';

const ImageLayouter = ({images = [], onimageclick, mode, isFeed}) => {
  const imageOnClick = React.useCallback(onimageclick, []);

  if (images.length === 1 && isFeed) {
    return (
      <ImageBackground
        resizeMode="stretch"
        blurRadius={80}
        source={{uri: images[0]}}
        style={styles.flex}>
        <ImageItem
          onImageClick={onimageclick}
          images={images}
          image={images[0]}
          mode={FastImage.resizeMode.contain}
        />
      </ImageBackground>
    );
  }

  return (
    <>
      <View style={[styles.imageContainer]}>
        {images.length > 0 &&
          images.map((image, index) => (
            <React.Fragment key={index}>
              <ImageItem
                image={image}
                length={images.length}
                index={index}
                onImageClick={imageOnClick}
                images={images}
                mode={mode}
              />
            </React.Fragment>
          ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageItem: {
    height: '50%',
    width: '50%'
  },
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
  },
  flex: {
    flex: 1
  }
});

export default ImageLayouter;
