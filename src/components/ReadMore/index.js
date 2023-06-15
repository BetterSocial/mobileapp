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
  const [curNumberLine, setNumberLine] = React.useState(0);
  const [charLength, setCharLength] = React.useState(0);
  const [isFinishSetLayout, setIsFinishSetLayout] = React.useState(false);
  const [lengthTextFirstLine, setLengthTextFirstLine] = React.useState(0);

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
    setIsFinishSetLayout(false);
  }, [props.text]);

  return (
    <View style={props.containerStyle}>
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
