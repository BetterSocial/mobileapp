import * as React from 'react';
import {StyleSheet, TouchableNativeFeedback, View} from 'react-native';

import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import Image from '../../../components/Image';
import MemoIcAddCircle from '../../../assets/icons/ic_add_circle';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import {normalize} from '../../../utils/fonts';
import {CircleGradient} from '../../../components/Karma/CircleGradient';
import dimen from '../../../utils/dimen';

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
        <CircleGradient fill={karmaScore} size={normalize(100)} width={normalize(6)}>
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
    width: dimen.normalizeDimen(92),
    height: dimen.normalizeDimen(92),
    borderRadius: 100,
    marginLeft: dimen.normalizeDimen(2.5),
    marginTop: dimen.normalizeDimen(2.75)
  },
  profileImageContainer: {
    width: 100,
    borderRadius: 100
  },
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
