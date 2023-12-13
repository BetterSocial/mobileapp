import React from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle} from 'react-native-svg';
import {renderCircleColor} from './utils';

export const CircleGradient = (props: {
  size: number;
  width: number;
  fill: number;
  children: React.ReactNode;
  testId?: string;
}) => {
  const r = props.size / 2 - props.width;
  const circleCircumference = 2 * Math.PI * r;

  const [circleStrokeDashoffset, setCircleStrokeDashoffset] = React.useState(
    circleCircumference * (props.fill / 100)
  );

  React.useEffect(() => {
    setCircleStrokeDashoffset(circleCircumference * (props.fill / 100));
  }, [props.fill]);

  return (
    <View
      testID={props.testId}
      style={{
        width: props.size,
        height: props.size,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 9999
      }}>
      <LinearGradient
        colors={renderCircleColor(props.fill)}
        start={{x: 0.0, y: 1.0}}
        end={{x: 1.0, y: 1.0}}
        style={{
          width: props.size,
          height: props.size,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 9999
        }}>
        {props.children}
      </LinearGradient>
      <Svg
        height={props.size}
        width={props.size}
        style={{position: 'absolute', transform: [{rotateZ: '-90deg'}]}}>
        <Circle
          cx={props.size / 2}
          cy={props.size / 2}
          r={r + 1}
          stroke="#E8EBED"
          strokeWidth={props.width + 1}
          strokeDasharray={`${props.fill === 100 ? 0.5 : circleCircumference}`}
          strokeDashoffset={`${circleStrokeDashoffset * -1}`}
          fill="none"
        />
      </Svg>
    </View>
  );
};