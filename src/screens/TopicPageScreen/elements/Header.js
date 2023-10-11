import * as React from 'react';
import {StyleSheet, Image, View, Animated} from 'react-native';
import PropTypes from 'prop-types';

import TopicDefaultIcon from '../../../assets/topic.png';
import dimen from '../../../utils/dimen';
import {normalize} from '../../../utils/fonts';
import ButtonFollow from './ButtonFollow';
import ButtonFollowing from './ButtonFollowing';
import TopicDomainHeader from './TopicDomainHeader';

const Header = (props) => {
  const {onPress, topicDetail, isFollow, opacityHeaderAnimation, getHeaderLayout} = props;
  const onHeaderLayout = (event) => {
    const {height} = event.nativeEvent.layout;
    if (getHeaderLayout) {
      getHeaderLayout(height);
    }
  };

  return (
    <Animated.View onLayout={onHeaderLayout} style={styles.Header(opacityHeaderAnimation)}>
      <Image
        source={topicDetail?.icon_path ? {uri: topicDetail?.icon_path} : TopicDefaultIcon}
        style={styles.image}
      />
      <View style={styles.domain}>
        <TopicDomainHeader {...props} />
      </View>
      <View style={styles.containerAction}>
        {isFollow ? (
          <ButtonFollowing handleSetUnFollow={onPress} />
        ) : (
          <ButtonFollow handleSetFollow={onPress} />
        )}
      </View>
    </Animated.View>
  );
};

Header.propTypes = {
  onPress: PropTypes.func,
  topicDetail: PropTypes.object,
  isFollow: PropTypes.bool,
  opacityHeaderAnimation: PropTypes.number,
  getHeaderLayout: PropTypes.func
};

const styles = StyleSheet.create({
  Header: (opacityHeaderAnimation) => ({
    flexDirection: 'row',
    height: dimen.size.TOPIC_FEED_HEADER_HEIGHT,
    paddingHorizontal: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    opacity: opacityHeaderAnimation
  }),
  image: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(24),
    backgroundColor: 'lightgrey',
    marginRight: 8
  },
  domain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 14,
    alignSelf: 'center'
  },
  containerAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Header;
