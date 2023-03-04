import * as React from 'react';

import {FlatList, StyleSheet, View} from 'react-native';
import ImageItem from './ImageItem';

const ImageLayouter = ({images = [], onimageclick}) => {
  const imageSize = () => {
    if (images?.length) {
      return images.length;
    }

    return 0;
  };

  const imageLength = React.useMemo(imageSize, [images]);

  const imageOnClick = React.useCallback(onimageclick, []);

  const renderItem = ({item, index}) => (
    <ImageItem image={item} index={index} onImageClick={imageOnClick} length={imageLength} />
  );

  const keyExtractor = (item, index) => `${item}-${index}`;

  return (
    <>
      <View style={styles.imageContainer}>
        <FlatList data={images} renderItem={renderItem} keyExtractor={keyExtractor} />
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
