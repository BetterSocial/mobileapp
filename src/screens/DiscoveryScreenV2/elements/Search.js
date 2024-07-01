/* eslint-disable no-use-before-define */
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PropTypes from 'prop-types';
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from 'react-native';
import {debounce} from 'lodash';
import {useNavigation} from '@react-navigation/core';

import DiscoveryAction from '../../../context/actions/discoveryAction';
import IconClear from '../../../assets/icon/IconClear';
import MemoIcArrowBackWhite from '../../../assets/arrow/Ic_arrow_back_white';
import MemoIcSearch from '../../../assets/icons/Ic_search';
import StringConstant from '../../../utils/string/StringConstant';
import TestIdConstant from '../../../utils/testId';
import dimen from '../../../utils/dimen';
import {COLORS, FONTS, SIZES} from '../../../utils/theme';
import {Context} from '../../../context/Store';
import {RECENT_SEARCH_TERMS} from '../../../utils/cache/constant';
import {fonts, normalizeFontSize} from '../../../utils/fonts';

const DiscoverySearch = ({
  setDiscoveryLoadingData = () => {},
  searchText = '',
  setSearchText = () => {},
  placeholderText = StringConstant.discoverySearchBarPlaceholder,
  setIsFocus = () => {},
  setIsFirstTimeOpen = () => {},
  fetchDiscoveryData = () => {},
  fetchData,
  onCancelToken = () => {},
  hideBackIcon = false,
  eventTrack = {
    onFocus: () => {}
  }
}) => {
  const navigation = useNavigation();
  const [, discoveryDispatch] = React.useContext(Context).discovery;
  const discoverySearchBarRef = React.useRef(null);
  const isForceSearch = React.useRef(false);

  const [lastSearch, setLastSearch] = React.useState('');

  const debounced = React.useCallback(
    debounce((text) => {
      handleSubmitSearchData(text);
    }, 1000),

    []
  );

  const handleBackPress = () => {
    Keyboard.dismiss();
    if (navigation.canGoBack()) navigation.goBack();
  };

  const handleFocus = (isFocusParam) => {
    setIsFocus(isFocusParam);
  };

  const setAllLoading = (isLoading) => {
    setDiscoveryLoadingData({
      user: isLoading,
      topic: isLoading,
      domain: isLoading,
      news: isLoading
    });
  };

  const debounceChangeText = (text) => {
    /**
     * isForceSearch ref is used to prevent this function to be called twice
     * when TextInput's onSubmitEditing is called.
     * Calling this function willChange the isForceSearch ref value back to false after check is true
     * to re-enable the function.
     */
    if (isForceSearch?.current) {
      isForceSearch.current = false;
      return;
    }

    onCancelToken();
    if (text.length > 2) {
      setAllLoading(true);
      setIsFirstTimeOpen(false);
      debounced(text);
    } else {
      setIsFirstTimeOpen(true);
      setAllLoading(false);
      debounced(text);
      debounced.cancel();
    }
  };

  const handleChangeText = (text) => {
    setSearchText(text);
    debounceChangeText(text);
  };

  const handleOnClearText = () => {
    handleFocus(true);
    discoverySearchBarRef?.current?.focus();
    setSearchText('');
    setLastSearch('');
    debounceChangeText('');
  };

  const handleOnSubmitEditing = (event) => {
    isForceSearch.current = true;
    onCancelToken();
    const {text} = event?.nativeEvent;
    handleSubmitSearchData(text);
  };

  const handleSubmitSearchData = async (text) => {
    if (text === lastSearch) return;

    setLastSearch(text);
    setAllLoading(true);
    setIsFirstTimeOpen(false);

    if (fetchData !== undefined) {
      fetchData(true, text);
    } else {
      fetchDiscoveryData(text);
    }

    const result = await AsyncStorage.getItem(RECENT_SEARCH_TERMS);

    if (!result) {
      const itemToSave = JSON.stringify([text]);
      DiscoveryAction.setDiscoveryRecentSearch([text], discoveryDispatch);
      AsyncStorage.setItem(RECENT_SEARCH_TERMS, itemToSave);
      return;
    }

    let resultArray = JSON.parse(result);
    if (resultArray.indexOf(text) > -1) return;

    resultArray = [text].concat(resultArray);
    if (resultArray.length > 3) resultArray.pop();

    DiscoveryAction.setDiscoveryRecentSearch(resultArray, discoveryDispatch);
    AsyncStorage.setItem(RECENT_SEARCH_TERMS, JSON.stringify(resultArray));
  };

  const onFocus = () => {
    eventTrack.onFocus();
    handleFocus(true);
  };

  React.useEffect(() => {
    debounceChangeText(searchText);
  }, [searchText]);

  React.useEffect(() => {
    if (discoverySearchBarRef?.current) {
      setTimeout(() => {
        discoverySearchBarRef?.current?.focus();
      }, 1000);
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = () => {
      setSearchText('');
      DiscoveryAction.setDiscoveryData(
        {
          followedUsers: [],
          unfollowedUsers: [],
          followedDomains: [],
          unfollowedDomains: [],
          followedTopic: [],
          unfollowedTopic: [],
          news: []
        },
        discoveryDispatch
      );
    };

    return unsubscribe;
  }, []);

  return (
    <View style={styles.animatedViewContainer(hideBackIcon)}>
      <View style={styles.arrowContainer}>
        {!hideBackIcon && (
          <TouchableNativeFeedback
            testID={TestIdConstant.discoveryScreenBackArrow}
            onPress={handleBackPress}>
            <View style={styles.backArrow}>
              <MemoIcArrowBackWhite
                width={20}
                height={12}
                fill={COLORS.white}
                style={{alignSelf: 'center'}}
              />
            </View>
          </TouchableNativeFeedback>
        )}
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.wrapperSearch}>
          <View style={styles.wrapperIcon}>
            <MemoIcSearch width={16.67} height={16.67} fill={COLORS.gray310} />
          </View>
          <TextInput
            ref={discoverySearchBarRef}
            testID={TestIdConstant.discoveryScreenSearchBar}
            // value={discoverySearchBarText}
            value={searchText}
            onChangeText={handleChangeText}
            onFocus={onFocus}
            onBlur={() => handleFocus(false)}
            multiline={false}
            returnKeyType="search"
            onSubmitEditing={handleOnSubmitEditing}
            placeholder={placeholderText}
            placeholderTextColor={COLORS.gray410}
            style={styles.input}
            keyboardAppearance="dark"
          />

          <TouchableOpacity
            testID={TestIdConstant.discoveryScreenClearButton}
            delayPressIn={0}
            onPress={handleOnClearText}
            style={styles.clearIconContainer}
            android_ripple={{
              color: COLORS.gray110,
              borderless: true,
              radius: 35
            }}>
            <View style={styles.wrapperDeleteIcon}>
              <IconClear width={9} height={10} fill={COLORS.gray410} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {paddingLeft: 20},
  backArrow: {
    flex: 1,
    justifyContent: 'center',
    marginRight: dimen.normalizeDimen(9)
  },
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.almostBlack,
    marginBottom: SIZES.base
  },
  clearIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  searchContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: dimen.normalizeDimen(20)
  },
  wrapperSearch: {
    flex: 1,
    backgroundColor: COLORS.gray110,
    borderRadius: dimen.normalizeDimen(SIZES.base),
    alignSelf: 'center',
    flexDirection: 'row',
    height: dimen.normalizeDimen(34),
    paddingRight: dimen.normalizeDimen(12)
  },
  wrapperButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginEnd: SIZES.base,
    paddingHorizontal: dimen.normalizeDimen(8),
    paddingVertical: dimen.normalizeDimen(9)
  },
  input: {
    marginRight: dimen.normalizeDimen(16),
    paddingStart: dimen.normalizeDimen(8),
    flex: 1,
    fontSize: normalizeFontSize(14),
    fontFamily: fonts.inter[400],
    alignSelf: 'center',
    height: dimen.normalizeDimen(33),
    paddingTop: 0,
    paddingBottom: 0,
    color: COLORS.white
  },
  wrapperIcon: {
    marginLeft: dimen.normalizeDimen(9.67),
    marginRight: dimen.normalizeDimen(1.67),
    alignSelf: 'center',
    justifyContent: 'center'
  },
  wrapperDeleteIcon: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  newPostText: {
    color: COLORS.anon_primary,
    marginRight: dimen.normalizeDimen(11),
    ...FONTS.h3
  },
  animatedViewContainer: (hideBackIcon) => ({
    flexDirection: 'row',
    backgroundColor: COLORS.almostBlack,
    marginTop: 0,
    zIndex: 10,
    height: dimen.size.DISCOVERY_HEADER_HEIGHT,
    paddingVertical: dimen.normalizeDimen(7),
    borderBottomWidth: hideBackIcon ? 0 : dimen.normalizeDimen(1),
    borderBottomColor: COLORS.gray110
  })
});

DiscoverySearch.propTypes = {
  setDiscoveryLoadingData: PropTypes.func,
  searchText: PropTypes.string,
  setSearchText: PropTypes.func,
  placeholderText: PropTypes.string,
  setIsFocus: PropTypes.func,
  setIsFirstTimeOpen: PropTypes.func,
  fetchDiscoveryData: PropTypes.func,
  fetchData: PropTypes.func,
  onCancelToken: PropTypes.func,
  hideBackIcon: PropTypes.bool
};

export default DiscoverySearch;
