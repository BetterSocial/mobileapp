/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from 'react-native';
import { debounce } from 'lodash'
import { useNavigation } from '@react-navigation/core'

import DiscoveryAction from '../../../context/actions/discoveryAction';
import DiscoveryRepo from '../../../service/discovery';
import GeneralComponentAction from '../../../context/actions/generalComponentAction';
import IconClear from '../../../assets/icon/IconClear';
import MemoIc_arrow_back_white from '../../../assets/arrow/Ic_arrow_back_white';
import MemoIc_search from '../../../assets/icons/Ic_search';
import StringConstant from '../../../utils/string/StringConstant';
import TestIdConstant from '../../../utils/testId';
import dimen from '../../../utils/dimen';
import { COLORS, FONTS, SIZES } from '../../../utils/theme';
import { Context } from '../../../context/Store';
import { RECENT_SEARCH_TERMS } from '../../../utils/cache/constant';
import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';

const DiscoverySearch = () => {
  const navigation = useNavigation()
  const [generalComponent, generalComponentDispatch] = React.useContext(Context).generalComponent
  const [discovery, discoveryDispatch] = React.useContext(Context).discovery
  const discoverySearchBarRef = React.useRef(null)

  const { discoverySearchBarText } = generalComponent

  const [isSearchIconShown, setIsSearchIconShown] = React.useState(false)
  const [isTextAvailable, setIsTextAvailable] = React.useState(false)
  const [lastSearch, setLastSearch] = React.useState('')
  const [searchText, setSearchText] = React.useState(discoverySearchBarText)

  const debounced = React.useCallback(debounce((text) => {
    __handleSubmitSearchData(text)
  }, 1000)

    , [])

  const { isFocus } = discovery

  const __handleBackPress = () => {
    Keyboard.dismiss()
    if (navigation.canGoBack()) navigation.goBack()
    // console.log('back ' + new Date().valueOf())
  }

  const __handleFocus = (isFocus) => {
    DiscoveryAction.setDiscoveryFocus(isFocus, discoveryDispatch)
  }

  const __debounceChangeText = (text) => {
    if (text.length > 2) {
      DiscoveryAction.setDiscoveryLoadingData(true, discoveryDispatch)
      DiscoveryAction.setDiscoveryFirstTimeOpen(false, discoveryDispatch)
      debounced(text)
    } else {
      if (text.length === 0) DiscoveryAction.setDiscoveryFirstTimeOpen(true, discoveryDispatch)
      DiscoveryAction.setDiscoveryLoadingData(false, discoveryDispatch)
      debounced.cancel()
    }
  }

  const __handleChangeText = (text) => {
    setSearchText(text)
    setIsTextAvailable(text.length > 0)
    __debounceChangeText(text)
    GeneralComponentAction.setDiscoverySearchBar(text, generalComponentDispatch)
  }

  const __handleOnClearText = () => {
    setSearchText("")
    GeneralComponentAction.setDiscoverySearchBar("", generalComponentDispatch)
    // setIsTextAvailable(false)
    // debounced.cancel()
    DiscoveryAction.reset(discoveryDispatch)
    // discoverySearchBarRef.current.focus()
  }

  const __handleOnSubmitEditing = (event) => {
    const { text } = event?.nativeEvent
    __handleSubmitSearchData(text)
  }

  const __handleSubmitSearchData = async (text) => {
    if (text === lastSearch) return

    setLastSearch(text)
    DiscoveryAction.setDiscoveryLoadingData(true, discoveryDispatch)
    DiscoveryAction.setDiscoveryFirstTimeOpen(false, discoveryDispatch)
    __fetchDiscoveryData(text)

    const result = await AsyncStorage.getItem(RECENT_SEARCH_TERMS)

    if (!result) {
      const itemToSave = JSON.stringify([text])
      DiscoveryAction.setDiscoveryRecentSearch([text], discoveryDispatch)
      return AsyncStorage.setItem(RECENT_SEARCH_TERMS, itemToSave)
    }

    let resultArray = JSON.parse(result)
    if (resultArray.indexOf(text) > -1) return

    resultArray = [text].concat(resultArray)
    if (resultArray.length > 3) resultArray.pop()

    DiscoveryAction.setDiscoveryRecentSearch(resultArray, discoveryDispatch)
    return AsyncStorage.setItem(RECENT_SEARCH_TERMS, JSON.stringify(resultArray))
  }

  const __fetchDiscoveryData = async (text) => {
    DiscoveryRepo.fetchDiscoveryDataUser(text).then(async (data) => {
      if (data.success) {
        await DiscoveryAction.setDiscoveryDataUsers(data, discoveryDispatch)
      }
      DiscoveryAction.setDiscoveryLoadingDataUser(false, discoveryDispatch)
    })

    DiscoveryRepo.fetchDiscoveryDataDomain(text).then(async (data) => {
      if (data.success) {
        await DiscoveryAction.setDiscoveryDataDomains(data, discoveryDispatch)
      }

      DiscoveryAction.setDiscoveryLoadingDataDomain(false, discoveryDispatch)
    })

    DiscoveryRepo.fetchDiscoveryDataTopic(text).then(async (data) => {
      if (data.success) {
        await DiscoveryAction.setDiscoveryDataTopics(data, discoveryDispatch)
      }

      DiscoveryAction.setDiscoveryLoadingDataTopic(false, discoveryDispatch)
    })

    DiscoveryRepo.fetchDiscoveryDataNews(text).then(async (data) => {
      if (data.success) {
        await DiscoveryAction.setDiscoveryDataNews(data, discoveryDispatch)
      }

      DiscoveryAction.setDiscoveryLoadingDataNews(false, discoveryDispatch)
    })
  }

  React.useEffect(() => {
    setIsSearchIconShown(!isFocus && !isTextAvailable)
  }, [isTextAvailable, isFocus])

  React.useEffect(() => {
    __debounceChangeText(searchText)
    setIsTextAvailable(searchText.length > 0)
  }, [searchText])

  React.useEffect(() => {
    setSearchText(discoverySearchBarText)
  }, [discoverySearchBarText])

  React.useEffect(() => {
    const unsubscribe = () => {
      setIsTextAvailable(false)
      GeneralComponentAction.setDiscoverySearchBar('', generalComponentDispatch)
      DiscoveryAction.setDiscoveryData({
        followedUsers: [],
        unfollowedUsers: [],
        followedDomains: [],
        unfollowedDomains: [],
        followedTopic: [],
        unfollowedTopic: [],
        news: [],
      }, discoveryDispatch)
    }

    return unsubscribe
  }, [])

  return (
    <View style={styles.animatedViewContainer}>
      <View style={styles.arrowContainer}>
        <TouchableNativeFeedback testID={TestIdConstant.discoveryScreenBackArrow} onPress={__handleBackPress}>
          <View style={styles.backArrow}>
            <MemoIc_arrow_back_white width={20} height={12} fill={colors.black} style={{ alignSelf: 'center' }} />
          </View>
        </TouchableNativeFeedback>
      </View>
      <View style={styles.searchContainer}>
        <View style={styles.wrapperSearch}>
          {isSearchIconShown && <View style={styles.wrapperIcon}>
            <MemoIc_search width={16.67} height={16.67} />
          </View>
          }
          <TextInput
            ref={discoverySearchBarRef}
            testID={TestIdConstant.discoveryScreenSearchBar}
            focusable={true}
            autoFocus={true}
            // value={discoverySearchBarText}
            value={searchText}
            onChangeText={__handleChangeText}
            onFocus={() => __handleFocus(true)}
            onBlur={() => __handleFocus(false)}
            multiline={false}
            returnKeyType="search"
            onSubmitEditing={__handleOnSubmitEditing}
            placeholder={StringConstant.discoverySearchBarPlaceholder}
            placeholderTextColor={COLORS.gray1}
            style={styles.input} />

          <TouchableOpacity testID={TestIdConstant.discoveryScreenClearButton} delayPressIn={0} onPress={__handleOnClearText} style={styles.clearIconContainer}
            android_ripple={{
              color: COLORS.gray1,
              borderless: true,
              radius: 35,
            }}
          >
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
  arrowContainer: { paddingLeft: 20 },
  backArrow: { flex: 1, justifyContent: 'center', marginRight: 9, },
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: SIZES.base,
    marginHorizontal: SIZES.base,
  },
  clearIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -20.5,
    paddingRight: 30,
    paddingLeft: 30,
    zIndex: 1000,
  },
  searchContainer: {
    flex: 1,
    marginRight: 20,
  },
  wrapperSearch: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    height: 36,
    paddingRight: 8,
  },
  wrapperButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginEnd: SIZES.base,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 9,
    paddingBottom: 9,
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
    paddingBottom: 0,
  },
  wrapperIcon: {
    marginLeft: 9.67,
    marginRight: 1.67,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  wrapperDeleteIcon: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  newPostText: {
    color: COLORS.holyTosca,
    marginRight: 11,
    ...FONTS.h3,
  },
  animatedViewContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 0,
    zIndex: 10,
    height: dimen.size.DISCOVERY_HEADER_HEIGHT,
    paddingTop: 7,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.alto,
  },
});

export default DiscoverySearch;
