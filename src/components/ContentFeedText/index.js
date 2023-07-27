import React, {useEffect, useRef, useState} from 'react';
import {View, Text} from 'react-native';

const ContentFeedText = ({containerHeight, initialFontSize, text}) => {
  const [fontSize, setFontSize] = useState(initialFontSize);
  const textRef = useRef(null);

  const measureTextHeight = () => {
    if (textRef.current) {
      textRef.current.measure((x, y, width, height, pageX, pageY) => {
        console.log({x, y, height, width, pageX, pageY, text, containerHeight}, 'lukio');
        // Compare the measured text height with the container height
        if (height < containerHeight) {
          // If the measured height is less, increase font size and re-measure
          //   setFontSize((prevFontSize) => prevFontSize + 1);
        } else if (height >= containerHeight) {
          // If the measured height is equal or greater, decrease font size and re-measure
          //   setFontSize((prevFontSize) => prevFontSize - 1);
        }
      });
    }
  };

  useEffect(() => {
    measureTextHeight();
  }, [containerHeight]);

  return (
    <View style={{height: containerHeight, justifyContent: 'center'}}>
      <Text ref={textRef} style={{fontSize, lineHeight: fontSize * 1.5}}>
        {text}
      </Text>
    </View>
  );
};

export default ContentFeedText;
