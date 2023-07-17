import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../utils/colors';
import useReadmore from './hooks/useReadmore';

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
          <Text>
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
        <Text testID="notFinishLayout" onTextLayout={handleLayoutText}>
          {props.text}{' '}
        </Text>
      ) : null}
    </View>
  );
};

export default React.memo(ReadMore, (prevProps, nextProps) => {
  return prevProps === nextProps;
});
