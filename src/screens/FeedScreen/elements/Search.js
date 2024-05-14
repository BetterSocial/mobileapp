import * as React from 'react';
import {View, Text, StyleSheet, Animated, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import IconSearch from '../../../assets/icons/Ic_search';
import IconTopic from '../../../assets/icons/ic_topic';
import StringConstant from '../../../utils/string/StringConstant';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {COLORS, SIZES} from '../../../utils/theme';
import dimen from '../../../utils/dimen';

const Search = ({animatedValue, onContainerClicked = () => {}, getSearchLayout}) => {
  const navigation = useNavigation();

  const onSearchLayout = (event) => {
    const {height} = event.nativeEvent.layout;
    if (getSearchLayout) {
      getSearchLayout(height);
    }
  };

  return (
    <Animated.View onLayout={onSearchLayout} style={styles.animatedViewContainer(animatedValue)}>
      <View style={styles.row}>
        <Pressable onPress={onContainerClicked} style={styles.searchPressableContainer}>
          <View style={styles.wrapperSearch}>
            <View style={styles.wrapperIcon}>
              <IconSearch width={16.67} height={16.67} fill={COLORS.gray310} />
            </View>
            <Text style={styles.inputText}>{StringConstant.discoverySearchBarPlaceholder}</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('CreateCommunity')} style={styles.btnCreate}>
          <IconTopic fill={COLORS.signed_primary} />
          <Text style={styles.btnCreateText}>Start a new{'\n'}community</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: dimen.normalizeDimen(20)
  },
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.almostBlack,
    marginBottom: SIZES.base
  },
  searchPressableContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  wrapperSearch: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray110,
    marginRight: dimen.normalizeDimen(12),
    borderRadius: SIZES.base,
    alignSelf: 'center',
    height: 34
  },
  inputText: {
    marginRight: dimen.normalizeDimen(16),
    paddingStart: dimen.normalizeDimen(10),
    flex: 1,
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[400],
    paddingTop: 0,
    paddingBottom: 0,
    color: COLORS.gray410,
    alignSelf: 'center'
  },
  wrapperIcon: {
    marginLeft: dimen.normalizeDimen(8),
    alignSelf: 'center',
    justifyContent: 'center'
  },
  animatedViewContainer: (animatedValue) => ({
    flexDirection: 'row',
    backgroundColor: COLORS.almostBlack,
    marginBottom: SIZES.base,
    marginTop: animatedValue,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: dimen.normalizeDimen(7),
    paddingBottom: dimen.normalizeDimen(7)
  }),
  btnCreate: {
    backgroundColor: COLORS.gray110,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 34,
    width: 94
  },
  btnCreateText: {
    fontSize: normalizeFontSize(10),
    fontFamily: fonts.inter[600],
    color: COLORS.signed_primary,
    marginLeft: dimen.normalizeDimen(6)
  }
});

export default React.memo(Search);
