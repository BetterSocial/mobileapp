import {useNavigation} from '@react-navigation/core';
import * as React from 'react';
import {Animated, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import TopicMemberIcon from '../../../assets/images/topic-member-picture.png';
import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import MemoIc_arrow_back_circle from '../../../assets/arrow/Ic_arrow_back_circle';
import dimen from '../../../utils/dimen';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {convertString} from '../../../utils/string/StringUtils';
import ShareIcon from '../../../assets/icons/Ic_share';
import ShareIconCircle from '../../../assets/icons/Ic_share_circle';
import {colors} from '../../../utils/colors';

const Navigation = ({domain, isHeaderHide, animatedValue, onShareCommunity, detail}) => {
  const navigation = useNavigation();

  const backScreen = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.Header(isHeaderHide)}>
      <TouchableOpacity onPress={() => backScreen()} style={styles.backbutton}>
        {isHeaderHide ? (
          <MemoIc_arrow_back_circle width={normalize(32)} height={normalize(32)} />
        ) : (
          <MemoIc_arrow_back width={normalize(24)} height={normalize(24)} />
        )}
      </TouchableOpacity>
      <Animated.View style={styles.domain(animatedValue)}>
        <Text style={styles.domainText} numberOfLines={1} ellipsizeMode="tail">
          {`#${convertString(domain, ' ', '')}`}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image testID="imageTopicMember" source={TopicMemberIcon} style={styles.member} />
          <Text style={styles.domainMember}>{detail?.followersCount} Members</Text>
        </View>
      </Animated.View>
      <View style={styles.containerAction}>
        <TouchableOpacity onPress={onShareCommunity} style={styles.shareIconStyle}>
          {isHeaderHide ? (
            <ShareIconCircle color="black" width={32} height={32} />
          ) : (
            <ShareIcon color="black" width={24} height={24} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Header: (isHeaderHide) => ({
    flexDirection: 'row',
    height: isHeaderHide
      ? dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT2
      : dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT,
    paddingRight: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 99
  }),
  backbutton: {
    paddingLeft: 16,
    paddingRight: 16,
    height: '100%',
    justifyContent: 'center'
  },
  domain: (animatedValue) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 14,
    alignSelf: 'center',
    opacity: animatedValue
  }),
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
  },
  shareIconStyle: {
    padding: 10
  }
});

export default Navigation;
