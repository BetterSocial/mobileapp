import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../../utils/theme';
import useReadmore from './hooks/useReadmore';

const styles = StyleSheet.create({
  moreText: {
    color: COLORS.bondi_blue
  }
});

/**
 * @typedef {Object} ReadmoreProps
 * @property {any} containerStyle
 * @property {string} text
 * @property {number} numberLine
 * @property {Function} onPress
 * @property {import('react-native').StyleProp} textStyle
 */

/**
 *
 *@param {ReadmoreProps} props
 */

const ReadMore = (props) => {
  const {
    isFinishSetLayout,
    realNumberLine,
    textShown,
    layoutWidth,
    setIsFinishSetLayout,
    handleLayoutText,
    handleLayoutWidth,
    limitNumberLine
  } = useReadmore({
    numberLine: props.numberLine
  });

  React.useEffect(() => {
    setIsFinishSetLayout(false);
  }, [layoutWidth, props.text]);
  return (
    <View onLayout={handleLayoutWidth} style={props.containerStyle}>
      {isFinishSetLayout ? (
        <TouchableOpacity testID="finishLayout" onPress={props.onPress}>
          <Text style={[{color: COLORS.gray400}, props.textStyle]}>
            {textShown}
            {''}
            {limitNumberLine < realNumberLine ? (
              <Text testID="moreText" style={styles.moreText}>
                More...
              </Text>
            ) : null}{' '}
          </Text>
        </TouchableOpacity>
      ) : null}
      {!isFinishSetLayout ? (
        <TouchableOpacity testID="finishLayout" onPress={props.onPress}>
          <Text
            style={[{color: COLORS.gray400}, props.textStyle]}
            testID="notFinishLayout"
            onTextLayout={handleLayoutText}>
            {props.text}{' '}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ReadMore;
