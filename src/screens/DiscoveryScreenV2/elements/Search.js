/* eslint-disable no-use-before-define */
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

const DiscoverySearch = ({
  setDiscoveryLoadingData = () => {},
  searchText = '',
  setSearchText = () => {},
  isFocus = true,
  placeholderText = StringConstant.discoverySearchBarPlaceholder,
  setIsFocus = () => {},
  setIsFirstTimeOpen = () => {},
  fetchDiscoveryData = () => {},
  fetchData,
  onCancelToken = () => {},
  hideBackIcon = false
}) => {
  const navigation = useNavigation();
  const [, discoveryDispatch] = React.useContext(Context).discovery;
  const discoverySearchBarRef = React.useRef(null);

  const [isSearchIconShown, setIsSearchIconShown] = React.useState(false);
  const [isTextAvailable, setIsTextAvailable] = React.useState(false);
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
    setIsTextAvailable(text.length > 0);
    debounceChangeText(text);
  };

  const handleOnClearText = () => {
    setSearchText('');
    setLastSearch('');
    // setIsTextAvailable(false)
    // debounced.cancel()
    // discoverySearchBarRef.current.focus()
  };

  const handleOnSubmitEditing = (event) => {
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

  React.useEffect(() => {
    setIsSearchIconShown(!isFocus && !isTextAvailable);
  }, [isTextAvailable, isFocus]);

  React.useEffect(() => {
    debounceChangeText(searchText);
    setIsTextAvailable(searchText.length > 0);
  }, [searchText]);

  React.useEffect(() => {
    const unsubscribe = () => {
      setIsTextAvailable(false);
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
                fill={colors.black}
                style={{alignSelf: 'center'}}
              />
            </View>
          </TouchableNativeFeedback>
        )}
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.wrapperSearch}>
          {isSearchIconShown && (
            <View style={styles.wrapperIcon}>
              <MemoIcSearch width={16.67} height={16.67} />
            </View>
          )}
          <TextInput
            ref={discoverySearchBarRef}
            testID={TestIdConstant.discoveryScreenSearchBar}
            focusable={true}
            // value={discoverySearchBarText}
            value={searchText}
            onChangeText={handleChangeText}
            onFocus={() => handleFocus(true)}
            onBlur={() => handleFocus(false)}
            multiline={false}
            returnKeyType="search"
            onSubmitEditing={handleOnSubmitEditing}
            placeholder={placeholderText}
            placeholderTextColor={COLORS.gray1}
            style={styles.input}
          />

          <TouchableOpacity
            testID={TestIdConstant.discoveryScreenClearButton}
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
    marginRight: 20
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
  newPostText: {
    color: COLORS.holytosca,
    marginRight: 11,
    ...FONTS.h3
  },
  animatedViewContainer: (hideBackIcon) => ({
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 0,
    zIndex: 10,
    height: dimen.size.DISCOVERY_HEADER_HEIGHT,
    paddingTop: 7,
    paddingBottom: 7,
    borderBottomWidth: hideBackIcon ? 0 : 1,
    borderBottomColor: COLORS.alto
  })
});

export default DiscoverySearch;
