import * as React from 'react';
import FastImage from 'react-native-fast-image';

export const imageConst = {
  priority: FastImage.priority,
  resizeMode: FastImage.resizeMode
}

export default function Image({ source, style, resizeMode = FastImage.resizeMode.contain}) {
  return <FastImage
    source={source}
    style={style}
    resizeMode={resizeMode}
  />
}
