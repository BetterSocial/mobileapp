import * as React from 'react';
import {ActivityIndicator} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImageViewerScreen = ({route, navigation}) => {
  const {images, title, index} = route.params || {};
  navigation.setOptions({
    headerTitle: title
  });

  return (
    <ImageViewer imageUrls={images} index={index} loadingRender={() => <ActivityIndicator />} />
  );
};
export default ImageViewerScreen;
