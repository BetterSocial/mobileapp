import * as React from 'react';

import ImageViewer from 'react-native-image-zoom-viewer';

const ImageViewerScreen = ({route, navigation}) => {
  const {images, title, index} = route.params || {};
  navigation.setOptions({
    headerTitle: title
  });

  return <ImageViewer imageUrls={images} index={index} />;
};
export default ImageViewerScreen;
