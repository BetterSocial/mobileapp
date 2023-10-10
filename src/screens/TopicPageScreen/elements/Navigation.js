import {useNavigation} from '@react-navigation/core';
import * as React from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';

import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import dimen from '../../../utils/dimen';
import {normalize, normalizeFontSizeByWidth} from '../../../utils/fonts';
import ShareIconCircle from '../../../assets/icons/Ic_share_circle';
import ButtonFollow from './ButtonFollow';
import TopicDomainHeader from './TopicDomainHeader';

const Navigation = (props) => {
  const {opacityNavAnimation, onShareCommunity, isHeaderHide, isFollow, onPress} = props;
  const navigation = useNavigation();

  const backScreen = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.Header(isHeaderHide)]}>
      <TouchableOpacity onPress={() => backScreen()} style={styles.backbutton}>
        <MemoIc_arrow_back width={normalize(24)} height={normalize(24)} />
      </TouchableOpacity>
      <Animated.View style={styles.domain(opacityNavAnimation)}>
        <TopicDomainHeader {...props} />
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

Navigation.propTypes = {
  opacityNavAnimation: PropTypes.number,
  onShareCommunity: PropTypes.func,
  isHeaderHide: PropTypes.bool,
  isFollow: PropTypes.bool,
  onPress: PropTypes.func
};

const styles = StyleSheet.create({
  Header: (isHeaderHide) => ({
    flexDirection: 'row',
    height: isHeaderHide
      ? dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT2
      : dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 99,
    paddingHorizontal: normalizeFontSizeByWidth(20)
  }),
  backbutton: {
    paddingRight: 16,
    height: '100%',
    justifyContent: 'center'
  },
  domain: (opacityNavAnimation) => ({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 14,
    alignSelf: 'center',
    opacity: opacityNavAnimation
  }),
  containerAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shareIconStyle: {},
  searchContainerStyle: {
    position: 'relative',
    marginBottom: 0
  }
});

export default Navigation;
