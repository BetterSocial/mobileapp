import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function IcNewChat(props) {
  return (
    <Svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.666992 10.5542V3.01355C0.666992 1.62535 1.78628 0.5 3.16699 0.5H14.8337C16.2144 0.5 17.3337 1.62535 17.3337 3.01355V10.5542C17.3337 11.9424 16.2144 13.0677 14.8337 13.0677H11.2932L9.12221 14.9777C7.77516 16.1627 5.66699 15.2009 5.66699 13.4013V13.0677H3.16699C1.78628 13.0677 0.666992 11.9424 0.666992 10.5542ZM7.13464 12.273C6.85306 11.7484 6.30142 11.392 5.66699 11.392H3.16699C2.70675 11.392 2.33366 11.0169 2.33366 10.5542V3.01355C2.33366 2.55082 2.70675 2.1757 3.16699 2.1757H14.8337C15.2939 2.1757 15.667 2.55082 15.667 3.01355V10.5542C15.667 11.0169 15.2939 11.392 14.8337 11.392H11.2932C10.8895 11.392 10.4995 11.5394 10.1957 11.8066L8.0247 13.7166C7.75529 13.9536 7.33366 13.7612 7.33366 13.4013V13.0677C7.33366 13.0161 7.33134 12.9651 7.3268 12.9146C7.30693 12.6941 7.24455 12.4858 7.14796 12.2983L7.13464 12.273ZM9.00089 3.83334C8.54065 3.83334 8.16755 4.20643 8.16755 4.66667V6.19036H6.6433C6.18307 6.19036 5.80997 6.56345 5.80997 7.02369C5.80997 7.48393 6.18307 7.85702 6.6433 7.85702H8.16755V9.38071C8.16755 9.84095 8.54065 10.214 9.00089 10.214C9.46113 10.214 9.83422 9.84095 9.83422 9.38071V7.85702H11.3573C11.8176 7.85702 12.1907 7.48393 12.1907 7.02369C12.1907 6.56345 11.8176 6.19036 11.3573 6.19036H9.83422V4.66667C9.83422 4.20643 9.46113 3.83334 9.00089 3.83334Z"
        fill="#00ADB5"
      />
    </Svg>
  );
}

const MemoIcNewChat = React.memo(IcNewChat);
export default MemoIcNewChat;
