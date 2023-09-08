/* eslint-disable no-use-before-define */
import * as React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';

import IconClear from '../../../assets/icon/IconClear';
import MemoIcSearch from '../../../assets/icons/Ic_search';
import StringConstant from '../../../utils/string/StringConstant';
import TestIdConstant from '../../../utils/testId';
import dimen from '../../../utils/dimen';
import {COLORS, SIZES} from '../../../utils/theme';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

const TopicSearch = ({
  searchText = '',
  setSearchText = () => {},
  handleSubmitSearchData = () => {}
}) => {
  const handleOnSubmitEditing = (event) => {
    const text = event?.nativeEvent?.text;
    handleSubmitSearchData(text);
  };

  const handleOnClearText = () => {
    setSearchText('');
  };

  return (
    <View style={styles.animatedViewContainer}>
      <View style={styles.searchContainer}>
        <View style={styles.wrapperSearch}>
          <View style={styles.wrapperIcon}>
            <MemoIcSearch width={16.67} height={16.67} />
          </View>
          <TextInput
            testID={TestIdConstant.topicScreenSearchBar}
            focusable={true}
            value={searchText}
            onChangeText={setSearchText}
            multiline={false}
            returnKeyType="search"
            onSubmitEditing={handleOnSubmitEditing}
            placeholder={StringConstant.topicMemberPlaceholder}
            placeholderTextColor={COLORS.gray1}
            style={styles.input}
          />

          <TouchableOpacity
            testID={TestIdConstant.topicScreenClearButton}
            delayPressIn={0}
            onPress={handleOnClearText}
            style={styles.clearIconContainer}
            android_ripple={{
              color: COLORS.gray1,
              borderless: true,
              radius: 35
            }}>
            <View style={styles.wrapperDeleteIcon}>
              <IconClear width={9} height={10} iconColor={colors.black} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {paddingLeft: 20},
  backArrow: {flex: 1, justifyContent: 'center', marginRight: 9},
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: SIZES.base,
    marginHorizontal: SIZES.base
  },
  clearIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -20.5,
    paddingRight: 30,
    paddingLeft: 30,
    zIndex: 1000
  },
  searchContainer: {
    flex: 1,
    marginHorizontal: 20
  },
  wrapperSearch: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    height: 36,
    paddingRight: 8
  },
  input: {
    marginRight: 16,
    paddingStart: 8,
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.inter[400],
    alignSelf: 'center',
    height: 33,
    paddingTop: 0,
    paddingBottom: 0
  },
  wrapperIcon: {
    marginLeft: 9.67,
    marginRight: 1.67,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  wrapperDeleteIcon: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  animatedViewContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    zIndex: 10,
    height: dimen.size.DISCOVERY_HEADER_HEIGHT,
    paddingTop: 7,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.alto
  }
});

export default TopicSearch;
