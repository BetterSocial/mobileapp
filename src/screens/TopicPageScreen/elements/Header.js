import * as React from 'react';
import {StyleSheet, Text, Image, View, Animated} from 'react-native';

import TopicMemberIcon from '../../../assets/images/topic-member-picture.png';
import TopicDefaultIcon from '../../../assets/topic.png';
import dimen from '../../../utils/dimen';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {convertString} from '../../../utils/string/StringUtils';
import ButtonFollow from './ButtonFollow';
import ButtonFollowing from './ButtonFollowing';
import {colors} from '../../../utils/colors';

const Header = ({animatedValue, domain, onPress, isFollow = false, getHeaderLayout}) => {
  const onHeaderLayout = (event) => {
    const {height} = event.nativeEvent.layout;
    if (getHeaderLayout) {
      getHeaderLayout(height);
    }
  };

  return (
    <Animated.View onLayout={onHeaderLayout} style={styles.Header(animatedValue)}>
      <Image source={TopicDefaultIcon} style={styles.image} />
      <View style={styles.domain}>
        <Text style={styles.domainText} numberOfLines={1} ellipsizeMode="tail">
          {`#${convertString(domain, ' ', '')}`}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image testID="imageTopicMember" source={TopicMemberIcon} style={styles.member} />
          <Text style={styles.domainMember}>20 Members</Text>
        </View>
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
    paddingHorizontal: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: animatedValue
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
  domainText: {
    fontSize: normalizeFontSize(16),
    fontFamily: fonts.inter[600],
    textAlign: 'left',
    color: colors.black
  },
  member: {
    width: normalize(16),
    height: normalize(16),
    marginRight: 5
  },
  domainMember: {
    fontSize: normalizeFontSize(12),
    fontFamily: fonts.inter[400],
    textAlign: 'left',
    color: colors.blackgrey
  },
  containerAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Header;
