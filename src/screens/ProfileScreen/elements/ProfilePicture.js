import * as React from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';

import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import Image from '../../../components/Image';
import MemoIcAddCircle from '../../../assets/icons/ic_add_circle';
import {DEFAULT_PROFILE_PIC_PATH} from '../../../utils/constants';
import {CircleGradient} from '../../../components/Karma/CircleGradient';
import dimen from '../../../utils/dimen';
import {COLORS} from '../../../utils/theme';

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
    <TouchableNativeFeedback onPress={onImageContainerClick}>
      <View>
        {withKarma ? (
          <CircleGradient
            fill={karmaScore}
            size={dimen.normalizeDimen(size)}
            width={dimen.normalizeDimen(width)}
            testId="images">
            {isAnon ? (
              <>
                <View style={[styles.anonStyle(size), {backgroundColor: anonBackgroundColor}]}>
                  <Text style={{fontSize: size / 2, textAlign: 'center', alignSelf: 'center'}}>
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
                    uri: profilePicPath ? `${profilePicPath}` : DEFAULT_PROFILE_PIC_PATH,
                    cache: 'web'
                  }}
                  resizeMode={FastImage.resizeMode.cover}
                  loadingIndicatorSource={
                    <Image
                      style={{
                        width: 24,
                        height: 24,
                        backgroundColor: COLORS.white,
                        borderRadius: 12
                      }}
                    />
                  }
                />
                {renderAddIcon()}
              </View>
            )}
          </CircleGradient>
        ) : (
          <>
            {isAnon ? (
              <>
                <View style={[styles.anonStyle(size), {backgroundColor: anonBackgroundColor}]}>
                  <Text style={{fontSize: size / 2, textAlign: 'center', alignSelf: 'center'}}>
                    {anonEmojiCode}
                  </Text>
                </View>
              </>
            ) : (
              <View style={styles.profileImageContainer(size)} testId="images">
                <Image
                  testId="images"
                  style={styles.profileImage(size, width)}
                  source={{
                    uri: profilePicPath ? `${profilePicPath}` : DEFAULT_PROFILE_PIC_PATH,
                    cache: 'web'
                  }}
                  resizeMode={FastImage.resizeMode.stretch}
                />
                {renderAddIcon()}
              </View>
            )}
          </>
        )}
      </View>
    </TouchableNativeFeedback>
  );
};

let styles = StyleSheet.create({
  addCircle: {position: 'absolute', top: 25, left: 25},
  profileImage: (size) => {
    const scale = size <= 25 ? 0.8 : 0.92;
    const marginScale = size <= 25 ? 0.805 : 0.925;
    return {
      width: dimen.normalizeDimen(size * scale),
      height: dimen.normalizeDimen(size * scale),
      borderRadius: 100,
      marginHorizontal: (dimen.normalizeDimen(size) - dimen.normalizeDimen(size * marginScale)) / 2,
      marginVertical: (dimen.normalizeDimen(size) - dimen.normalizeDimen(size * marginScale)) / 2
    };
  },
  anonStyle: (size) => {
    const scale = size <= 25 ? 0.8 : 0.92;
    const marginScale = size <= 25 ? 0.805 : 0.925;
    return {
      width: dimen.normalizeDimen(size * scale),
      height: dimen.normalizeDimen(size * scale),
      borderRadius: 100,
      marginHorizontal: (dimen.normalizeDimen(size) - dimen.normalizeDimen(size * marginScale)) / 2,
      marginVertical: (dimen.normalizeDimen(size) - dimen.normalizeDimen(size * marginScale)) / 2,
      justifyContent: 'center',
      alignItems: 'center'
    };
  },
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
