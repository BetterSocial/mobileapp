import React from 'react';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

export default function CommunityIcon({color, ...rest}) {
  return (
    <Svg width="16" height="16" viewBox="0 0 20 18" fill="none" {...rest}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 8C8.34315 8 7 9.34315 7 11V13.4286V17C7 17.5523 6.55228 18 6 18C5.44772 18 5 17.5523 5 17V13.4286V11L5.00012 10.9645C4.83678 10.9879 4.6698 11 4.5 11C4.38994 11 4.28108 10.9949 4.17361 10.985C4.11723 10.9949 4.05921 11 4 11H3.57143C2.70355 11 2 11.7036 2 12.5714V15C2 15.5523 1.55228 16 1 16C0.447715 16 0 15.5523 0 15V12.5714C0 11.3004 0.663961 10.1845 1.66396 9.5515C1.24626 8.97507 1 8.26629 1 7.5C1 5.567 2.567 4 4.5 4C5.04254 4 5.55625 4.12344 6.01457 4.34378C6.00492 4.23047 6 4.11581 6 4C6 1.79086 7.79086 0 10 0C12.2091 0 14 1.79086 14 4C14 4.11581 13.9951 4.23047 13.9854 4.34378C14.4438 4.12345 14.9575 4 15.5 4C17.433 4 19 5.567 19 7.5C19 8.26629 18.7537 8.97507 18.336 9.5515C19.336 10.1845 20 11.3004 20 12.5714V15C20 15.5523 19.5523 16 19 16C18.4477 16 18 15.5523 18 15V12.5714C18 11.7036 17.2964 11 16.4286 11H16C15.9408 11 15.8828 10.9949 15.8264 10.985C15.7189 10.9949 15.6101 11 15.5 11C15.3302 11 15.1632 10.9879 14.9999 10.9645L15 11V13.4286V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V13.4286V11C13 9.34315 11.6569 8 10 8ZM10 6C8.89543 6 8 5.10457 8 4C8 2.89543 8.89543 2 10 2C11.1046 2 12 2.89543 12 4C12 5.10457 11.1046 6 10 6ZM4.5 6C3.67157 6 3 6.67157 3 7.5C3 8.32843 3.67157 9 4.5 9C5.32843 9 6 8.32843 6 7.5C6 6.67157 5.32843 6 4.5 6ZM15.5 6C14.6716 6 14 6.67157 14 7.5C14 8.32843 14.6716 9 15.5 9C16.3284 9 17 8.32843 17 7.5C17 6.67157 16.3284 6 15.5 6Z"
        fill={`${color ?? COLORS.balance_gray}`}
      />
    </Svg>
  );
}