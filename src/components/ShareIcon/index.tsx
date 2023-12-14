import * as React from 'react';
import {Platform, TouchableOpacity} from 'react-native';
import ShareIOSIcon from '../../assets/icons/images/share.svg';
import ShareAndroidIcon from '../../assets/icons/images/share-for-android.svg';
import {COLORS} from '../../utils/theme';

interface ShareButtonIconProps {
  onPress: () => void;
  fill?: string;
  width?: number;
  height?: number;
}

const ShareButtonIcon: React.FC<ShareButtonIconProps> = ({
  onPress,
  fill = COLORS.black,
  width = 20,
  height = 20
}) => {
  const IconComponent = Platform.select({
    ios: ShareIOSIcon,
    android: ShareAndroidIcon,
    default: ShareIOSIcon
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <IconComponent width={width} height={height} fill={fill} />
    </TouchableOpacity>
  );
};

export default ShareButtonIcon;
