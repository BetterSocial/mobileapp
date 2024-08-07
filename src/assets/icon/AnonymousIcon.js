import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg';
import {COLORS} from '../../utils/theme';

const AnonymousIcon = (props) => (
  <Svg
    width={props.size || 32}
    height={props.size || 32}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    {...props}>
    <Rect width={32} height={32} rx={16} fill={props.fill || COLORS.signed_primary} />
    <G clipPath="url(#a)" fill="#fff">
      <Path d="M19.069 15.278a.542.542 0 0 1-.542-.541v-3.122a.888.888 0 0 0-.422-.764.886.886 0 0 0-.871-.05l-.2.096A1.111 1.111 0 0 1 15.46 9.89l-1.085-.027a.904.904 0 0 0-.902.902v3.973a.542.542 0 0 1-1.084 0v-3.973c0-1.095.89-1.986 1.986-1.986h1.056c.613 0 1.111.499 1.111 1.111l.224-.064a1.974 1.974 0 0 1 1.918.11c.58.366.928.993.928 1.68v3.122a.542.542 0 0 1-.542.541ZM13.414 23.944c-.102 0-.204-.008-.306-.024l-1.323-.211c-.906-.145-1.563-.896-1.563-1.786V20.46c0-.235.152-.444.376-.516a7.134 7.134 0 0 1 4.302 0c.225.072.377.28.377.516v1.673c0 .52-.23 1.015-.633 1.359-.345.293-.78.451-1.23.451Zm-.135-1.094a.82.82 0 0 0 .661-.181.695.695 0 0 0 .254-.535V20.87a6.067 6.067 0 0 0-2.889 0v1.053c0 .354.274.655.65.716l1.324.211Z" />
      <Path d="M10.764 21.416H9.32a.542.542 0 0 1 0-1.083h1.444a.542.542 0 0 1 0 1.083ZM18.585 23.944c-.45 0-.886-.158-1.23-.451a1.786 1.786 0 0 1-.633-1.359v-1.673c0-.235.152-.444.376-.516a7.134 7.134 0 0 1 4.302 0c.225.072.377.28.377.516v1.462c0 .89-.657 1.64-1.563 1.786l-1.323.21a1.895 1.895 0 0 1-.306.025Zm.22-.559h.008-.008Zm-1-2.515v1.264c0 .206.09.395.253.535a.82.82 0 0 0 .662.181l1.324-.21c.376-.06.65-.362.65-.716V20.87a6.058 6.058 0 0 0-2.889 0Z" />
      <Path d="M22.68 21.237h-1.264a.542.542 0 0 1 0-1.084h1.264a.542.542 0 0 1 0 1.084ZM17.264 21.416h-2.528a.542.542 0 0 1 0-1.083h2.528a.542.542 0 0 1 0 1.083ZM16 18.166c-4.307 0-8.667-.992-8.667-2.889 0-1.857 3.87-2.51 5.534-2.704a.542.542 0 0 1 .126 1.076c-3.235.378-4.577 1.247-4.577 1.628 0 .614 2.677 1.806 7.584 1.806s7.583-1.192 7.583-1.805c0-.382-1.342-1.251-4.577-1.63a.542.542 0 0 1 .126-1.075c1.664.194 5.534.847 5.534 2.704 0 1.897-4.36 2.89-8.666 2.89Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path
          fill={COLORS.almostBlack}
          transform="translate(7.333 7.333)"
          d="M0 0h17.333v17.333H0z"
        />
      </ClipPath>
    </Defs>
  </Svg>
);

export default AnonymousIcon;
