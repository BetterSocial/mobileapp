import React from 'react';
import {View} from 'react-native';
import {Circle, Defs, LinearGradient, Path, Stop, Svg} from 'react-native-svg';

export interface GradientCircularProgressProps {
  progress: number;
  size: number;
  startColor: string;
  endColor: string;
  middleColor: string;
  id?: string;
  strokeWidth?: number;
  emptyColor?: string;
  withSnail?: boolean;
  children?: React.ReactNode;
}

const GradientCircularProgress = ({
  size,
  progress,
  strokeWidth = 6,
  emptyColor,
  startColor,
  endColor,
  middleColor,
  withSnail = false,
  children
}: GradientCircularProgressProps) => {
  const DIAMETER = 50;
  const WIDTH = DIAMETER + strokeWidth;
  const firstHalfProg = progress > DIAMETER ? 1 : progress / DIAMETER;
  const secondHalfProg = progress <= DIAMETER ? 0 : (progress - DIAMETER) / DIAMETER;
  const halfCircumference = (Math.PI * 2 * (DIAMETER / 2)) / 2;

  return (
    <View style={{width: size, height: size, position: 'relative'}}>
      <Svg viewBox={`0 0 ${WIDTH} ${WIDTH}`}>
        <Defs>
          <LinearGradient id="firstHalfGradient" x1="50%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={startColor} />
            <Stop offset="90%" stopColor={middleColor} />
          </LinearGradient>

          <LinearGradient id="secondHalfGradient" x1="0%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor={endColor} />
            <Stop offset="90%" stopColor={middleColor} />
          </LinearGradient>
        </Defs>

        <Path
          fill="none"
          stroke={emptyColor}
          d={`
              M ${strokeWidth / 2} ${WIDTH / 2}
              a ${DIAMETER / 2} ${DIAMETER / 2} 0 1 1 ${DIAMETER} 0
              a ${DIAMETER / 2} ${DIAMETER / 2} 0 1 1 -${DIAMETER} 0
            `}
          strokeWidth={strokeWidth}
        />

        {progress > 0 && (
          <Path
            fill="none"
            stroke="url(#firstHalfGradient)"
            strokeDasharray={`${firstHalfProg * halfCircumference},${halfCircumference}`}
            strokeLinecap="square"
            d={`
                M ${WIDTH / 2} ${strokeWidth / 2}
                a ${DIAMETER / 2} ${DIAMETER / 2} 0 1 1 0 ${DIAMETER}
              `}
            strokeWidth={strokeWidth}
          />
        )}

        {progress >= 50 && (
          <Path
            fill="none"
            stroke="url(#secondHalfGradient)"
            strokeDasharray={`${secondHalfProg * halfCircumference},${halfCircumference}`}
            strokeLinecap="square"
            d={`
              M ${WIDTH / 2} ${WIDTH - strokeWidth / 2}
              a ${DIAMETER / 2} ${DIAMETER / 2} 0 0 1 0 -${DIAMETER}
            `}
            strokeWidth={strokeWidth}
          />
        )}

        {withSnail && (
          <Circle
            cx={WIDTH / 2}
            cy={strokeWidth / 2}
            r={strokeWidth / 4}
            fill="white"
            transform={`rotate(${360 * (progress / 100)}, ${WIDTH / 2}, ${WIDTH / 2})`}
          />
        )}
      </Svg>

      {children}
    </View>
  );
};

export {GradientCircularProgress};
