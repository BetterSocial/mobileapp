import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
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
 * @property {Function} onPress
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
  const [realNumberLine, setRealNumberLine] = React.useState(0);
  const [textShown, setTextShown] = React.useState('');
  const [layoutWidth, setLayoutWidth] = React.useState(0);
  const handleLayoutText = async ({nativeEvent}) => {
    let characterNumber = 0;
    let textWidth = 0;
    let lengthFirstLine = 0;
    let text = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < props.numberLine; i++) {
      characterNumber += nativeEvent.lines[i].text.length;
      textWidth += nativeEvent.lines[i].width;
      console.log(nativeEvent.lines[i], i, 'lines');

      if (i === 0) {
        lengthFirstLine = nativeEvent.lines[i]?.text.length;
      }
      if (i === props.numberLine - 1) {
        let newText = `${nativeEvent.lines[i]?.text}`.replace(/\n/g, '');
        if (nativeEvent.lines[i]?.width >= layoutWidth * 0.85) {
          newText = newText.substring(10);
        }
        text += newText;
      } else {
        text += nativeEvent.lines[i]?.text;
      }
    }
    setTextShown(text);
    setRealNumberLine(nativeEvent.lines.length);
    setNumberLine(props.numberLine);
    setCharLength(characterNumber);
    setLengthTextFirstLine(lengthFirstLine);
    setIsFinishSetLayout(true);
  };

  const handleLayoutWidth = ({nativeEvent}) => {
    setLayoutWidth(Math.floor(nativeEvent.layout.width));
  };
  // console.log({layoutWidth, numberLine: props.numberLine, textShown}, 'nusi');
  React.useEffect(() => {
    setIsFinishSetLayout(false);
  }, [layoutWidth, props.text]);
  return (
    <View onLayout={handleLayoutWidth} style={props.containerStyle}>
      {isFinishSetLayout ? (
        <TouchableOpacity onPress={props.onPress}>
          <Text>
            {textShown}
            {''}
            {props.numberLine < realNumberLine ? (
              <Text style={styles.moreText}>More...</Text>
            ) : null}{' '}
          </Text>
        </TouchableOpacity>
      ) : null}
      {!isFinishSetLayout ? <Text onTextLayout={handleLayoutText}>{props.text} </Text> : null}
    </View>
  );
};

export default ReadMore;
