import React from 'react';
import {View} from 'react-native';
import {renderCircleColor} from './utils';
import {GradientCircularProgress} from './GradientCircularProgress';

export const CircleGradient = (props: {
  size: number;
  width: number;
  fill: number;
  children: React.ReactNode;
  testId?: string;
}) => {
  const color = renderCircleColor(props.fill);

  return (
    <View
      testID={props.testId || 'circleGradient'}
      style={{
        width: props.size,
        height: props.size,
        justifyContent: 'center',
        alignItems: 'baseline',
        borderRadius: 9999,
        position: 'relative'
      }}>
      <GradientCircularProgress
        emptyColor="#E8EBED"
        size={props.size}
        progress={props.fill}
        startColor={color[2]}
        middleColor={color[1]}
        endColor={color[0]}
        strokeWidth={props.width}>
        <View
          style={{
            position: 'absolute'
          }}>
          {props.children}
        </View>
      </GradientCircularProgress>
    </View>
  );
};
