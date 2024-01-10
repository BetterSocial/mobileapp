import * as React from 'react';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableNativeFeedback, View} from 'react-native';

import Image from '../../../components/Image';
import MemoIcAddCircle from '../../../assets/icons/ic_add_circle';
import dimen from '../../../utils/dimen';
import {CircleGradient} from '../../../components/Karma/CircleGradient';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import {normalize} from '../../../utils/fonts';

const ProfilePicture = ({
  onImageContainerClick,
  profilePicPath,
  disabledAddIcon = false,
  karmaScore = 0,
  size = 100,
  width = 6,
  withKarma = false
}) => {
  const renderAddIcon = () => {
    if (!profilePicPath || !disabledAddIcon) return <></>;

    return <MemoIcAddCircle width={48} height={48} style={styles.addCircle} />;
  };
  return (
    <View style={styles.wrapImageProfile}>
      <TouchableNativeFeedback onPress={onImageContainerClick}>
        {withKarma ? (
          <CircleGradient
            fill={karmaScore}
            size={normalize(size)}
            width={normalize(width)}
            testId="images">
            <View style={styles.profileImageContainer(size)}>
              <Image
                testId="images"
                style={styles.profileImage(size, width)}
                source={{
                  uri: profilePicPath ? `${profilePicPath}` : DEFAULT_PROFILE_PIC_PATH
                }}
                resizeMode={FastImage.resizeMode.stretch}
              />
              {renderAddIcon()}
            </View>
          </CircleGradient>
        ) : (
          <View style={styles.profileImageContainer(size)} testId="images">
            <Image
              testId="images"
              style={styles.profileImage(size, width)}
              source={{
                uri: profilePicPath ? `${profilePicPath}` : DEFAULT_PROFILE_PIC_PATH
              }}
              resizeMode={FastImage.resizeMode.stretch}
            />
            {renderAddIcon()}
          </View>
        )}
      </TouchableNativeFeedback>
    </View>
  );
};

let styles = StyleSheet.create({
  addCircle: {position: 'absolute', top: 25, left: 25},
  profileImage: (size, width) => ({
    width: dimen.normalizeDimen(size * 0.91),
    height: dimen.normalizeDimen(size * 0.91),
    borderRadius: 100,
    marginLeft: dimen.normalizeDimen(width / 2),
    marginTop: dimen.normalizeDimen(width / 2)
  }),
  profileImageContainer: (size) => ({
    width: size,
    borderRadius: 100
  }),
  wrapImageProfile: {
    flexDirection: 'column'
  }
});

ProfilePicture.propTypes = {
  onImageContainerClick: PropTypes.func,
  profilePicPath: PropTypes.string,
  disabledAddIcon: PropTypes.bool,
  karmaScore: PropTypes.number
};

export default ProfilePicture;
