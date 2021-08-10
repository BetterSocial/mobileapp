import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';

function PollWinnerBadge(props) {
  return (
    <Svg width="20" height="21" viewBox="0 0 20 21" fill="none" {...props}>
      <Circle cx="10" cy="10.3335" r="9" stroke="white" stroke-width="2" />
      <Path
        filRule="evenodd"
        clipRule="evenodd"
        d="M7.15832 9.48111C7.34137 9.59323 7.56369 9.62154 7.76899 9.55888C7.9743 9.49622 8.14292 9.34859 8.23216 9.15336L9.52152 6.33285C9.57194 6.22257 9.73818 6.0835 10 6.0835C10.2618 6.0835 10.4281 6.22257 10.4785 6.33285L11.7678 9.15336C11.8571 9.34859 12.0257 9.49622 12.231 9.55888C12.4363 9.62154 12.6586 9.59323 12.8417 9.48111L14.6749 8.35827C14.8633 8.24287 15.1313 8.24164 15.3216 8.35618L15.7083 7.7136L15.3216 8.35619C15.497 8.46174 15.5138 8.59589 15.4915 8.67398L14.2415 13.049C14.21 13.1592 14.0492 13.3335 13.75 13.3335H6.25004C5.95078 13.3335 5.79001 13.1592 5.75852 13.049L4.50854 8.67398C4.48623 8.59589 4.50305 8.46173 4.67842 8.35619L4.29166 7.7136L4.67842 8.35618C4.86873 8.24164 5.13673 8.24287 5.32514 8.35827L7.15832 9.48111Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="white"
      />
    </Svg>
  );
}

const MemoPollWinnerBadge = React.memo(PollWinnerBadge);
export default MemoPollWinnerBadge;
