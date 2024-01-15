import * as React from 'react';
import PropsTypes from 'prop-types';
import {ActivityIndicator} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImageViewerScreen = ({route, navigation}) => {
  const {images, title, index} = route.params || {};
  navigation.setOptions({
    headerTitle: title
  });
  const loadingRender = () => <ActivityIndicator />;

  return <ImageViewer imageUrls={images} index={index} loadingRender={loadingRender} />;
};

ImageViewerScreen.propsTypes = {
  route: PropsTypes.any,
  navigation: PropsTypes.any
};
export default ImageViewerScreen;
