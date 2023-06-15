import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {colors} from '../../utils/colors';

const styles = StyleSheet.create({
  moreText: {
    color: colors.bondi_blue
  }
});

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
  const [curNumberLine, setNumberLine] = React.useState(0);
  const [charLength, setCharLength] = React.useState(0);
  const [widthPerChar, setWidthPerChar] = React.useState(0);
  const [isFinishSetLayout, setIsFinishSetLayout] = React.useState(false);
  const [amountTxtPerLine, setAmountTxtPerLine] = React.useState(0);
  const [lengthTextFirstLine, setLengthTextFirstLine] = React.useState(0);
  const widthScreen = Dimensions.get('screen').width;
  const handleLayoutWidth = ({nativeEvent}) => {
    setLayoutWidth(nativeEvent.layout.width);
  };

  const handleLayoutText = async ({nativeEvent}) => {
    console.log(nativeEvent, 'native');
    let lines = props.numberLine;
    if (!lines) {
      lines = 2;
    }
    let characterNumber = 0;
    let textWidth = 0;
    let lengthFirstLine = 0;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < nativeEvent.lines.length; i++) {
      characterNumber += nativeEvent.lines[i].text.length;
      textWidth += nativeEvent.lines[i].width;
      if (i === 0) {
        lengthFirstLine = nativeEvent.lines[i].text.length;
      }
    }
    await setLayoutTextWidth(textWidth);
    await setNumberLine(nativeEvent.lines.length);
    await setCharLength(characterNumber);
    await setLengthTextFirstLine(lengthFirstLine);
    setIsFinishSetLayout(true);
  };
  const handleReadMoreText = () => {
    if (props.numberLine < curNumberLine) {
      const substringText = props.numberLine * (lengthTextFirstLine - 5);
      const longText = substringText;

      return longText;
    }
    return charLength;
  };

  React.useEffect(() => {
    if (layoutTextWidth > 0 && charLength > 0) {
      setWidthPerChar(layoutTextWidth / charLength);
    }
  }, [layoutTextWidth, charLength]);

  React.useEffect(() => {
    if (layoutWidth > 0 && widthPerChar > 0) {
      setAmountTxtPerLine(Math.ceil(layoutWidth / widthPerChar));
    }
  }, [layoutWidth, widthPerChar]);

  React.useEffect(() => {
    setIsFinishSetLayout(false);
  }, [props.text]);

  return (
    <View style={props.containerStyle} onLayout={handleLayoutWidth}>
      {isFinishSetLayout ? (
        <Text>
          {props.text.substring(0, handleReadMoreText())}{' '}
          {props.numberLine < curNumberLine ? <Text style={styles.moreText}>More...</Text> : null}{' '}
        </Text>
      ) : null}
      {!isFinishSetLayout ? <Text onTextLayout={handleLayoutText}>{props.text} </Text> : null}
    </View>
  );
};

export default ReadMore;
