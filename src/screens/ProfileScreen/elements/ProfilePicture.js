import * as React from 'react';
import {StyleSheet, TouchableNativeFeedback, View} from 'react-native';

import FastImage from 'react-native-fast-image';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Image from '../../../components/Image';
import MemoIcAddCircle from '../../../assets/icons/ic_add_circle';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import {normalize} from '../../../utils/fonts';
import {renderCircleColor} from '../../../components/Karma/utils';
import {CircleGradient} from '../../../components/Karma/CircleGradient';

/**
 * @typedef {Object} ProfilePicturePropsParam
 * @property {function} onImageContainerClick
 * @property {String} profilePicPath
 * @property {Boolean} disabledAddIcon
 */
/**
 *
 * @param {ProfilePicturePropsParam} props
 */

const ProfilePicture = ({
  onImageContainerClick,
  profilePicPath,
  disabledAddIcon = false,
  karmaScore = 0
}) => {
  const renderAddIcon = () => {
    if (!profilePicPath || !disabledAddIcon) return <></>;

    return <MemoIcAddCircle width={48} height={48} style={styles.addCircle} />;
  };
  return (
    <View style={styles.wrapImageProfile}>
      <TouchableNativeFeedback onPress={onImageContainerClick}>
        <CircleGradient fill={karmaScore} size={normalize(100)} width={normalize(3)}>
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={{
                uri: profilePicPath ? `${profilePicPath}` : DEFAULT_PROFILE_PIC_PATH
              }}
              resizeMode={FastImage.resizeMode.stretch}
            />
            {renderAddIcon()}
          </View>
        </CircleGradient>
      </TouchableNativeFeedback>
    </View>
  );
};

let styles = StyleSheet.create({
  addCircle: {position: 'absolute', top: 25, left: 25},
  profileImage: {
    width: 94,
    height: 94,
    borderRadius: 100,
    marginLeft: 3,
    marginTop: 3,
    marginBottom: 3
  },
  profileImageContainer: {
    width: 100,
    borderRadius: 100
    // zIndex: 1000
  },
  wrapImageProfile: {
    // marginTop: 14,
    flexDirection: 'column'
  }
});

export default ProfilePicture;
