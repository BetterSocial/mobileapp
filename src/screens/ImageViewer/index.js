import * as React from 'react';

import ImageViewer from 'react-native-image-zoom-viewer';

const ImageViewerScreen = ({route, navigation}) => {
  let {images, title} = route.params || {};
  navigation.setOptions({
    headerTitle: title,
  });

  return <ImageViewer imageUrls={images} />;
};
export default ImageViewerScreen;
