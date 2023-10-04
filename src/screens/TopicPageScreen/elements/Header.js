import * as React from 'react';
import {StyleSheet, Image, View, Animated} from 'react-native';

import TopicDefaultIcon from '../../../assets/topic.png';
import dimen from '../../../utils/dimen';
import {normalize} from '../../../utils/fonts';
import ButtonFollow from './ButtonFollow';
import ButtonFollowing from './ButtonFollowing';
import TopicDomainHeader from './TopicDomainHeader';

const Header = ({
  offsetAnimation,
  onPress,
  detail,
  hideSeeMember,
  isFollow = false,
  getHeaderLayout,
  handleOnMemberPress
}) => {
  const onHeaderLayout = (event) => {
    const {height} = event.nativeEvent.layout;
    if (getHeaderLayout) {
      getHeaderLayout(height);
    }
  };

  return (
    <Animated.View onLayout={onHeaderLayout} style={styles.Header(offsetAnimation)}>
      <Image
        source={detail?.icon_path ? {uri: detail?.icon_path} : TopicDefaultIcon}
        style={styles.image}
      />
      <View style={styles.domain}>
        <TopicDomainHeader
          detail={detail}
          isFollow={isFollow}
          hideSeeMember={hideSeeMember}
          handleOnMemberPress={handleOnMemberPress}
        />
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

const styles = StyleSheet.create({
  Header: (animatedValue) => ({
    flexDirection: 'row',
    height: dimen.size.TOPIC_FEED_HEADER_HEIGHT,
    paddingHorizontal: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: animatedValue,
    marginBottom: normalize(4)
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
