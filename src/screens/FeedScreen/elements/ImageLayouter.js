import * as React from 'react';

import {StyleSheet, View} from 'react-native';
import ImageItem from './ImageItem';

const ImageLayouter = ({images = [], onimageclick, mode}) => {
  const imageOnClick = React.useCallback(onimageclick, []);
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
  }
});

export default ImageLayouter;
