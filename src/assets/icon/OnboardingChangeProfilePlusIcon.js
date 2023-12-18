import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

function OnboardingChangeProfilePlusIcon(props) {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <Rect width="14" height="14" rx="7" fill={props.color || COLORS.holyTosca} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.49764 3.71462C7.49764 3.45802 7.28962 3.25 7.03302 3.25C6.77642 3.25 6.5684 3.45802 6.5684 3.71462L6.5684 6.50236L3.71462 6.50236C3.45802 6.50236 3.25 6.71038 3.25 6.96698C3.25 7.22358 3.45802 7.4316 3.71462 7.4316H6.5684L6.5684 10.2854C6.5684 10.542 6.77642 10.75 7.03302 10.75C7.28962 10.75 7.49764 10.542 7.49764 10.2854L7.49764 7.4316H10.2854C10.542 7.4316 10.75 7.22358 10.75 6.96698C10.75 6.71038 10.542 6.50236 10.2854 6.50236L7.49764 6.50236L7.49764 3.71462Z"
        fill={COLORS.white}
      />
    </Svg>
  );
}

const MemoOnboardingChangeProfilePlusIcon = React.memo(OnboardingChangeProfilePlusIcon);
export default MemoOnboardingChangeProfilePlusIcon;
