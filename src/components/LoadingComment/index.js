import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

import PropTypes from 'prop-types';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: 20
  },
  photoContainer: {
    width: 24,
    height: 24,
    backgroundColor: COLORS.gray110,
    borderRadius: 12
  },
  containerUsername: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  username: {
    fontFamily: fonts.inter[700],
    fontSize: 12,
    color: COLORS.gray410,
    lineHeight: 14,
    marginLeft: 16
  },
  usenameLoading: {
    width: '40%',
    marginRight: 10,
    marginLeft: 10
  },
  timeLoading: {
    width: '20%'
  },
  commentLoading: {
    width: '90%',
    marginLeft: 10,
    marginTop: 10
  },
  time: {
    fontFamily: fonts.inter[400],
    fontSize: 10,
    color: COLORS.gray410,
    lineHeight: 12
  },
  post: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    color: COLORS.white,
    marginLeft: 20
  }
});
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const LoadingComment = () => {
  const avatarRef = React.createRef();
  const firstLineRef = React.createRef();
  const secondLineRef = React.createRef();
  const thirdLineRef = React.createRef();

  React.useEffect(() => {
    const facebookAnimated = Animated.stagger(400, [
      avatarRef.current.getAnimated(),
      Animated.parallel([
        firstLineRef.current.getAnimated(),
        secondLineRef.current.getAnimated(),
        thirdLineRef.current.getAnimated()
      ])
    ]);
    Animated.loop(facebookAnimated).start();
  }, []);
  return (
    <View style={styles.container}>
      <ShimmerPlaceholder
        ref={avatarRef}
        stopAutoRun
        style={styles.photoContainer}></ShimmerPlaceholder>

      <View>
        <View style={styles.containerUsername}>
          <ShimmerPlaceholder
            ref={firstLineRef}
            stopAutoRun
            style={styles.usenameLoading}></ShimmerPlaceholder>
          <ShimmerPlaceholder
            ref={secondLineRef}
            stopAutoRun
            style={styles.timeLoading}></ShimmerPlaceholder>
        </View>
        <ShimmerPlaceholder
          ref={thirdLineRef}
          stopAutoRun
          style={styles.commentLoading}></ShimmerPlaceholder>
      </View>
    </View>
  );
};

LoadingComment.propTypes = {
  user: PropTypes.object,
  commentText: PropTypes.string,
  isLoading: PropTypes.bool
};

LoadingComment.defaultProps = {
  user: {},
  commentText: ''
};

export default LoadingComment;
