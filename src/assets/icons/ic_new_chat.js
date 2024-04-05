import * as React from 'react';
import Svg, {Path, G, Defs, ClipPath} from 'react-native-svg';

function IcNewChat(props) {
  return (
    <Svg
      width={18}
      height={17}
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_20145_83001)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M.225 7.347V7.05C.225 3.432 3.143.5 6.743.5h4.74c3.6 0 6.52 2.932 6.52 6.55 0 3.6-2.891 6.522-6.468 6.55L8.59 16.065c-1.204 1.008-3.031.148-3.031-1.426v-1.104C2.543 13.103.225 10.497.225 7.347zm7.226 7.347l3.164-2.65a.992.992 0 01.636-.23h.233c2.618 0 4.74-2.133 4.74-4.764 0-2.631-2.122-4.764-4.74-4.764h-4.74c-2.62 0-4.742 2.133-4.742 4.764v.297c0 2.467 1.99 4.466 4.445 4.466a.89.89 0 01.889.893v1.934c0 .06.07.092.115.054zM9.113 4.056a.889.889 0 00-.889.888V6.57H6.6a.889.889 0 000 1.777h1.625v1.626a.889.889 0 101.778 0V8.347h1.626a.889.889 0 000-1.777h-1.626V4.944a.889.889 0 00-.889-.888z"
          fill={props.color || '#0391FB'}
        />
      </G>
      <Defs>
        <ClipPath id="clip0_20145_83001">
          <Path fill="#fff" transform="translate(.225 .5)" d="M0 0H17.776V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const MemoIcNewChat = React.memo(IcNewChat);
export default MemoIcNewChat;
