import * as React from 'react';
import {Text, View} from 'react-native';
import Video from 'react-native-video';
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
export default VideoViewerScreen;
