import * as React from 'react';
import Svg, {Path, Rect} from 'react-native-svg';

function SendComment(props) {
  const {fillBackground = '#C4C4C4', fillIcon = '#E0E0E0'} = props;
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" {...props}>
      <Rect width={32} height={32} rx={16} fill={fillBackground} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.98093 13.2997C7.06028 12.9614 7.33318 12.7094 7.67333 12.6605L23.986 10.3149C24.3343 10.2648 24.6826 10.4377 24.8631 10.7502C25.0435 11.0627 25.019 11.4507 24.8015 11.7274L14.6138 24.6817C14.4014 24.9519 14.0467 25.0622 13.714 24.9618C13.3813 24.8613 13.1355 24.5696 13.0903 24.2217L12.2843 18.0125L7.31001 14.2099C7.0313 13.9968 6.90159 13.6381 6.98093 13.2997ZM14.008 18.0277L14.5211 21.9798L20.6406 14.1984L14.008 18.0277ZM19.7656 12.6828L13.133 16.5121L9.96695 14.0918L19.7656 12.6828Z"
        fill={fillIcon}
      />
    </Svg>
  );
}

const MemoSendComment = React.memo(SendComment);
export default MemoSendComment;
