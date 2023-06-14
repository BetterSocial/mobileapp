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
    let cutText = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < lines; i++) {
      cutText += nativeEvent.lines[i - 1]?.text;
    }
    console.log(cutText, 'remina');
    setCutText(cutText);
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

  console.log(layoutWidth, layoutTextWidth, textLength, props.text, 'rere');
  return (
    <View style={props.containerStyle} onLayout={handleLayoutWidth}>
      <Text onTextLayout={handleLayoutText}>{props.text}</Text>
      <Text>{newCutText} </Text>
    </View>
  );
};

export default ReadMore;
