import React from 'react';
import {View, Text} from 'react-native';

/**
 * @typedef {Object} ReadmoreProps
 * @property {any} containerStyle
 * @property {string} text
 * @property {number} numberLine
 */

/**
 *
 *@param {ReadmoreProps} props
 */

const ReadMore = (props) => {
  const [layoutWidth, setLayoutWidth] = React.useState(0);
  const [layoutTextWidth, setLayoutTextWidth] = React.useState(0);
  const [textLength, setTextLength] = React.useState(0);
  const [newCutText, setCutText] = React.useState('');
  const cutPercentage = 0.95;
  const handleLayoutWidth = ({nativeEvent}) => {
    setLayoutWidth(nativeEvent.layout.width);
  };

  const handleLayoutText = ({nativeEvent}) => {
    console.log(nativeEvent, 'native');
    let lines = props.numberLine;
    if (!lines) {
      lines = 2;
    }
    let characterNumber = 0;
    let textWidth = 0;
    const parentWidth = layoutWidth * nativeEvent.lines.length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < nativeEvent.lines.length; i++) {
      console.log(nativeEvent.lines[i], 'lala');
      characterNumber += nativeEvent.lines[i].text.length;
      textWidth += nativeEvent.lines[i].width;
    }
    console.log(characterNumber, textWidth, props.text, parentWidth, 'lele');
    // if (nativeEvent.lines.length < lines) {
    //   setLayoutTextWidth(nativeEvent.lines[nativeEvent.lines.length - 1].width);
    //   setTextLength(nativeEvent.lines[nativeEvent.lines.length - 1].text.length);
    // } else {
    //   setLayoutTextWidth(nativeEvent.lines[lines - 1].width);
    //   setTextLength(nativeEvent.lines[lines - 1].text.length);
    // }
  };

  const handleReadMoreText = () => {
    if (layoutTextWidth / layoutWidth < cutPercentage) {
      return 'belum';
    }
    return 'sudah';
  };

  return (
    <View style={props.containerStyle} onLayout={handleLayoutWidth}>
      <Text onTextLayout={handleLayoutText}>{props.text}</Text>
    </View>
  );
};

export default ReadMore;
