import * as React from 'react';
import PropsTypes from 'prop-types';
import VideoPlayer from 'react-native-video-controls';

const VideoViewerScreen = ({route, navigation}) => {
  const {url, title} = route.params || {};
  navigation.setOptions({
    headerTitle: title
  });

  return (
    <VideoPlayer
      source={{
        uri: url
      }}
      controls={true}
      disableFullscreen
      disableBack
      disableVolume
    />
  );
};

VideoViewerScreen.propsTypes = {
  route: PropsTypes.any,
  navigation: PropsTypes.any
};
export default VideoViewerScreen;
