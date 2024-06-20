import * as React from 'react';
import {GestureResponderEvent, TouchableOpacity, TouchableOpacityProps} from 'react-native';

import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../libraries/analytics/analyticsEventTracking';

export type PressEventTrackingWrapperProps = TouchableOpacityProps & {
  name: BetterSocialEventTracking;
  trackValue?: object;
};

const PressEventTrackingWrapper = (props: PressEventTrackingWrapperProps) => {
  const {name, children, onPress, trackValue, ...otherProps} = props;

  const onEventTrackingPress = (e: GestureResponderEvent) => {
    AnalyticsEventTracking.eventTrack(name, trackValue);
    if (onPress) onPress(e);
  };

  return (
    <TouchableOpacity style={props?.style} onPress={onEventTrackingPress} {...otherProps}>
      {children}
    </TouchableOpacity>
  );
};

export default PressEventTrackingWrapper;
