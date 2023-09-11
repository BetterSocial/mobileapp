import {useNavigation} from '@react-navigation/core';
import * as React from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';

import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import dimen from '../../../utils/dimen';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import ShareIconCircle from '../../../assets/icons/Ic_share_circle';
import {colors} from '../../../utils/colors';
import ButtonFollow from './ButtonFollow';
import TopicDomainHeader from './TopicDomainHeader';

const Navigation = ({
  domain,
  isHeaderHide,
  animatedValue,
  onShareCommunity,
  detail,
  isFollow,
  onPress,
  hideSeeMember,
  handleOnMemberPress
}) => {
  const navigation = useNavigation();

  const backScreen = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.Header(isHeaderHide)}>
      <TouchableOpacity onPress={() => backScreen()} style={styles.backbutton}>
        <MemoIc_arrow_back width={normalize(24)} height={normalize(24)} />
      </TouchableOpacity>
      <Animated.View style={styles.domain(animatedValue)}>
        <TopicDomainHeader
          domain={domain}
          detail={detail}
          isFollow={isFollow}
          hideSeeMember={hideSeeMember}
          handleOnMemberPress={handleOnMemberPress}
        />
      </Animated.View>
      <View style={styles.containerAction}>
        {!isFollow && isHeaderHide ? (
          <View style={{marginRight: normalize(10)}}>
            <ButtonFollow handleSetFollow={onPress} />
          </View>
        ) : (
          <TouchableOpacity onPress={onShareCommunity} style={styles.shareIconStyle}>
            <ShareIconCircle color="black" width={32} height={32} />
          </TouchableOpacity>
        )}
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
    paddingLeft: 20,
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
