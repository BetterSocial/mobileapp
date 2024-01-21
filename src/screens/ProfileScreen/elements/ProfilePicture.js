import * as React from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';

import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import Image from '../../../components/Image';
import MemoIcAddCircle from '../../../assets/icons/ic_add_circle';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import {CircleGradient} from '../../../components/Karma/CircleGradient';
import dimen from '../../../utils/dimen';

const ProfilePicture = ({
  onImageContainerClick,
  profilePicPath,
  disabledAddIcon = false,
  karmaScore = 0,
  size = 100,
  width = 6,
  withKarma = false,
  isAnon = false,
  anonBackgroundColor,
  anonEmojiCode
}) => {
  const renderAddIcon = () => {
    if (!profilePicPath || !disabledAddIcon) return <></>;

    return <MemoIcAddCircle width={48} height={48} style={styles.addCircle} />;
  };
  return (
    <View>
      <TouchableNativeFeedback onPress={onImageContainerClick}>
        {withKarma ? (
          <CircleGradient
            fill={karmaScore}
            size={dimen.normalizeDimen(size)}
            width={dimen.normalizeDimen(width)}
            testId="images">
            {isAnon ? (
              <>
                <View style={[styles.anonStyle(size), {backgroundColor: anonBackgroundColor}]}>
                  <Text style={{fontSize: size / 1.5, textAlign: 'center', alignSelf: 'center'}}>
                    {anonEmojiCode}
                  </Text>
                </View>
              </>
            ) : (
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
            )}
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
  profileImage: (size) => ({
    width: dimen.normalizeDimen(size * 0.92),
    height: dimen.normalizeDimen(size * 0.92),
    borderRadius: 100,
    marginHorizontal: (dimen.normalizeDimen(size) - dimen.normalizeDimen(size * 0.925)) / 2,
    marginVertical: (dimen.normalizeDimen(size) - dimen.normalizeDimen(size * 0.925)) / 2
  }),
  anonStyle: (size) => ({
    width: dimen.normalizeDimen(size * 0.92),
    height: dimen.normalizeDimen(size * 0.92),
    borderRadius: 100,
    marginHorizontal: (dimen.normalizeDimen(size) - dimen.normalizeDimen(size * 0.925)) / 2,
    marginVertical: (dimen.normalizeDimen(size) - dimen.normalizeDimen(size * 0.925)) / 2,
    justifyContent: 'center',
    alignItems: 'center'
  }),
  profileImageContainer: (size) => ({
    width: size,
    borderRadius: 100,
    height: size
  })
});

ProfilePicture.propTypes = {
  onImageContainerClick: PropTypes.func,
  profilePicPath: PropTypes.string,
  disabledAddIcon: PropTypes.bool,
  karmaScore: PropTypes.number
};

export default ProfilePicture;
