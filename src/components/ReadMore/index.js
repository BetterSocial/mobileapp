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
  const [isFinishSetLayout, setIsFinishSetLayout] = React.useState(false);
  const [realNumberLine, setRealNumberLine] = React.useState(0);
  const [textShown, setTextShown] = React.useState('');
  const [layoutWidth, setLayoutWidth] = React.useState(0);
  const handleLayoutText = async ({nativeEvent}) => {
    let text = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < props.numberLine; i++) {
      if (i === props.numberLine - 1) {
        const availableText = nativeEvent.lines[i]?.text;
        if (!availableText) return;
        let newText = `${availableText}`.replace(/\n/g, '');
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
    setIsFinishSetLayout(true);
  };

  const handleLayoutWidth = ({nativeEvent}) => {
    setLayoutWidth(Math.floor(nativeEvent.layout.width));
  };
  React.useEffect(() => {
    setIsFinishSetLayout(false);
  }, [layoutWidth, props.text]);
  return (
    <View onLayout={handleLayoutWidth} style={props.containerStyle}>
      {isFinishSetLayout ? (
        <TouchableOpacity onPress={props.onPress}>
          <Text>
            {textShown}{' '}
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
