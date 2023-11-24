import * as React from 'react';
import {StyleSheet, TouchableNativeFeedback, View} from 'react-native';

import FastImage from 'react-native-fast-image';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Image from '../../../components/Image';
import MemoIcAddCircle from '../../../assets/icons/ic_add_circle';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';

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
    <View
      style={[
        styles.wrapImageProfile,
        {
          flex: 1,
          backgroundColor: 'transparent',
          borderColor: 'white',
          borderRadius: 100,
          overflow: 'hidden',
          shadowColor: 'black',
          shadowRadius: 10,
          shadowOpacity: 1
        }
      ]}>
      <TouchableNativeFeedback onPress={onImageContainerClick}>
        <AnimatedCircularProgress
          size={110}
          width={6}
          fill={karmaScore}
          tintColor="#ACD91A"
          backgroundColor="#E8EBED"
          tintTransparency={true}
          rotation={360}>
          {() => (
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
          )}
        </AnimatedCircularProgress>
      </TouchableNativeFeedback>
    </View>
  );
};

let styles = StyleSheet.create({
  addCircle: {position: 'absolute', top: 25, left: 25},
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100
    // marginBottom: 12
  },
  profileImageContainer: {
    width: 100,
    borderRadius: 100
  },
  wrapImageProfile: {
    // marginTop: 14,
    flexDirection: 'column'
  }
});

export default ProfilePicture;
