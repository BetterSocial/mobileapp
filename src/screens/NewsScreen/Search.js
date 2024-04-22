import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import MemoIc_search from '../../assets/icons/Ic_search';
import StringConstant from '../../utils/string/StringConstant';
import dimen from '../../utils/dimen';
import {COLORS, SIZES} from '../../utils/theme';
import {DISCOVERY_TAB_NEWS} from '../../utils/constants';
import {fonts, normalizeFontSize} from '../../utils/fonts';

const Search = ({animatedValue}) => {
  const navigation = useNavigation();

  const handleOnContainerPress = () => {
    navigation.push('DiscoveryScreen', {
      tab: DISCOVERY_TAB_NEWS
    });
  };

  return (
    <Animated.View
      style={[
        styles.animatedViewContainer(animatedValue),
        {position: Platform.OS === 'android' ? 'absolute' : 'relative'}
      ]}>
      <TouchableOpacity
        testID="news-search-back-button"
        style={styles.backPadding}
        onPress={() => navigation.goBack()}>
        <ArrowLeftIcon />
      </TouchableOpacity>
      <Pressable
        testID="containerPress"
        style={styles.searchPressableContainer}
        onPress={handleOnContainerPress}>
        <View style={styles.wrapperSearch}>
          <View style={styles.wrapperIcon}>
            <MemoIc_search width={16.67} height={16.67} fill={COLORS.gray310} />
          </View>
          <Text style={styles.input}>{StringConstant.newsTabHeaderPlaceholder}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

Search.propTypes = {
  animatedValue: PropTypes.number
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.almostBlack,
    marginBottom: SIZES.base
  },
  searchPressableContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  backPadding: {
    alignSelf: 'center',
    paddingLeft: 28
  },
  wrapperSearch: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray110,
    marginLeft: dimen.normalizeDimen(20),
    marginRight: dimen.normalizeDimen(12),
    borderRadius: SIZES.base,
    alignSelf: 'center',
    height: 34
  },
  wrapperButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginEnd: SIZES.base,
    paddingLeft: dimen.normalizeDimen(8),
    paddingRight: dimen.normalizeDimen(12),
    paddingTop: dimen.normalizeDimen(9),
    paddingBottom: dimen.normalizeDimen(9)
  },
  input: {
    paddingStart: dimen.normalizeDimen(10),
    lineHeight: normalizeFontSize(28),
    flex: 1,
    paddingBottom: 0,
    paddingTop: 0,
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    alignSelf: 'center',
    color: COLORS.gray410
  },
  wrapperIcon: {
    marginLeft: dimen.normalizeDimen(8),
    alignSelf: 'center',
    justifyContent: 'center'
  },
  newPostText: {
    color: COLORS.anon_primary,
    marginRight: dimen.normalizeDimen(4),
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(14)
  },
  animatedViewContainer: (animatedValue) => ({
    flexDirection: 'row',
    backgroundColor: COLORS.almostBlack,
    marginTop: Platform.OS === 'android' ? 0 : animatedValue,
    top: Platform.OS === 'android' ? animatedValue : 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: dimen.normalizeDimen(7),
    paddingBottom: dimen.normalizeDimen(7),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray110,
    height: 50
  })
});

export default React.memo(Search);
