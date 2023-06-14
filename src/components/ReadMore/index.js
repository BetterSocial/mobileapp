import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
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
  const [isFinishSetLayout, setIsFinishSetLayout] = React.useState(false);
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
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < nativeEvent.lines.length; i++) {
      console.log(nativeEvent.lines[i], 'lala');
      characterNumber += nativeEvent.lines[i].text.length;
      textWidth += nativeEvent.lines[i].width;
    }
    await setLayoutTextWidth(textWidth);
    await setNumberLine(nativeEvent.lines.length);
    await setCharLength(characterNumber);
    setIsFinishSetLayout(true);
  };
  const handleReadMoreText = () => {
    if (props.numberLine < curNumberLine) {
      const widhthPerCharacter = layoutTextWidth / charLength;
      const amountTextPerLine = Math.ceil(layoutWidth / (widhthPerCharacter + 2));
      const substringText = props.numberLine * amountTextPerLine;
      const longText = substringText;

      return longText;
    }
    return charLength;
  };
  console.log(curNumberLine, 'simak');
  return (
    <View style={props.containerStyle} onLayout={handleLayoutWidth}>
      <Text>
        {props.text.substring(0, handleReadMoreText())}{' '}
        {props.numberLine < curNumberLine && isFinishSetLayout ? (
          <Text style={styles.moreText}>More...</Text>
        ) : null}{' '}
      </Text>
      {!isFinishSetLayout ? <Text onTextLayout={handleLayoutText}>{props.text} </Text> : null}
    </View>
  );
};

export default React.memo(ReadMore, (prevProps, nextProps) => {
  return prevProps === nextProps;
});
