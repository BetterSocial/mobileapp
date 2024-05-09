import * as React from 'react';
import {View, Text, StyleSheet, Animated, Pressable} from 'react-native';

import IconSearch from '../../../assets/icons/Ic_search';
import IconTopic from '../../../assets/icons/ic_topic';
import StringConstant from '../../../utils/string/StringConstant';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {COLORS, SIZES} from '../../../utils/theme';
import dimen from '../../../utils/dimen';

const Search = ({animatedValue, onContainerClicked = () => {}, getSearchLayout}) => {
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
        <Pressable onPress={() => {}} style={styles.btnCreate}>
          <Text style={styles.btnCreateText}>Create new community</Text>
          <IconTopic fill={COLORS.signed_primary} />
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
    borderWidth: 1,
    borderColor: COLORS.signed_primary,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: dimen.normalizeDimen(4),
    paddingHorizontal: dimen.normalizeDimen(8)
  },
  btnCreateText: {
    fontSize: normalizeFontSize(12),
    fontFamily: fonts.inter[600],
    color: COLORS.signed_primary,
    width: 56,
    marginRight: dimen.normalizeDimen(2)
  }
});

export default React.memo(Search);
