import * as React from 'react';
import Svg, {Circle, ClipPath, Defs, G, LinearGradient, Path, Rect, Stop} from 'react-native-svg';

function BetterSocialLogoGram() {
  return (
    <Svg width="28" height="29" viewBox="0 0 28 29" fill="none">
      <Circle cx="14" cy="14.5" r="11.2" transform="rotate(-90 14 14.5)" fill="white" />
      <G clipPath="url(#clip0_25_79)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.64 8.53413L7.49252 17.9952C7.45031 18.0605 7.43221 18.1357 7.44073 18.2105C7.44925 18.2853 7.48397 18.3559 7.54005 18.4125C7.59614 18.4691 7.67081 18.5088 7.75368 18.5262C7.83654 18.5436 7.92348 18.5377 8.00241 18.5095L12.2257 16.9933C13.3608 16.5865 14.631 16.5865 15.7661 16.9933L19.9894 18.5081C20.0681 18.5361 20.1548 18.5418 20.2373 18.5244C20.3199 18.507 20.3943 18.4674 20.4503 18.4111C20.5063 18.3548 20.541 18.2845 20.5498 18.21C20.5586 18.1355 20.5409 18.0604 20.4993 17.9952L14.3502 8.53413C14.3143 8.47905 14.2626 8.4333 14.2002 8.40148C14.1379 8.36967 14.0672 8.35292 13.9951 8.35292C13.9231 8.35292 13.8524 8.36967 13.79 8.40148C13.7277 8.4333 13.676 8.47905 13.64 8.53413Z"
          fill="#2C6CC9"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M18.9316 15.5844C17.364 14.9763 12.6536 16.8232 12.2257 16.9947L12.1938 17.0067L8.00239 18.5081C7.92364 18.5361 7.837 18.5417 7.75444 18.5244C7.67188 18.507 7.59747 18.4674 7.5415 18.4111C7.48552 18.3548 7.45074 18.2845 7.44197 18.21C7.43319 18.1355 7.45085 18.0604 7.4925 17.9951L13.6415 8.53412C13.6775 8.47904 13.7292 8.43328 13.7915 8.40147C13.8539 8.36966 13.9246 8.35291 13.9966 8.35291C14.0687 8.35291 14.1394 8.36966 14.2017 8.40147C14.2641 8.43328 14.3158 8.47904 14.3517 8.53412L18.9316 15.5844Z"
          fill="url(#paint0_linear_25_79)"
        />
      </G>
      <Defs>
        <LinearGradient
          id="paint0_linear_25_79"
          x1="9.82051"
          y1="13.9057"
          x2="19.5109"
          y2="15.9712"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#4782D7" />
          <Stop offset="1" stopColor="#6197E5" />
        </LinearGradient>
        <ClipPath id="clip0_25_79">
          <Rect
            width="13.1133"
            height="11.5905"
            fill="white"
            transform="translate(7.43867 7.64925)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

const BetterSocialLogoGramIcon = React.memo(BetterSocialLogoGram);
export default BetterSocialLogoGramIcon;
