import * as React from 'react';
import {Animated, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import PropTypes from 'prop-types';
import MemoIc_search from '../../assets/icons/Ic_search';
import StringConstant from '../../utils/string/StringConstant';
import {COLORS, FONTS, SIZES} from '../../utils/theme';
import {DISCOVERY_TAB_NEWS} from '../../utils/constants';
import {fonts} from '../../utils/fonts';

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
      <Pressable
        testID="containerPress"
        style={styles.pressableContainer}
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
    backgroundColor: COLORS.white,
    marginBottom: SIZES.base,
    marginHorizontal: SIZES.base
  },
  pressableContainer: {
    flex: 1
  },
  wrapperSearch: {
    flex: 1,
    backgroundColor: COLORS.lightgrey,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    height: 36
  },
  wrapperButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginEnd: SIZES.base,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 9,
    paddingBottom: 9
  },
  input: {
    marginRight: 16,
    paddingStart: 10,
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.inter[400],
    // height: 36,
    paddingTop: 0,
    paddingBottom: 0,
    alignSelf: 'center',
    color: COLORS.blackgrey
  },
  wrapperIcon: {
    marginLeft: 8,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  newPostText: {
    color: COLORS.anon_primary,
    marginRight: 11,
    ...FONTS.h3
  },
  animatedViewContainer: (animatedValue) => ({
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    // marginBottom: SIZES.base,
    marginTop: Platform.OS === 'android' ? 0 : animatedValue,
    top: Platform.OS === 'android' ? animatedValue : 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 7,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightgrey,
    height: 50
  })
});

export default React.memo(Search);
