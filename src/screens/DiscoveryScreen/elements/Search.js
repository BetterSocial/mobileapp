import * as React from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useNavigation } from '@react-navigation/core'

import DiscoveryAction from '../../../context/actions/discoveryAction';
import DiscoveryRepo from '../../../service/discovery';
import GeneralComponentAction from '../../../context/actions/generalComponentAction';
import IconClear from '../../../assets/icon/IconClear';
import MemoIc_arrow_back_white from '../../../assets/arrow/Ic_arrow_back_white';
import MemoIc_pencil from '../../../assets/icons/Ic_pencil';
import MemoIc_search from '../../../assets/icons/Ic_search';
import StringConstant from '../../../utils/string/StringConstant';
import dimen from '../../../utils/dimen';
import {COLORS, FONTS, SIZES} from '../../../utils/theme';
import {Context} from '../../../context/Store';
import { colors } from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';

let getDataTimeoutId;

const DiscoverySearch = ({onPress, animatedValue, showBackButton = false, onContainerClicked = () => {}}) => {
  const navigation = useNavigation()
  const [generalComponent, generalComponentDispatch] = React.useContext(Context).generalComponent
  const [discovery, discoveryDispatch] = React.useContext(Context).discovery
  const discoverySearchBarRef = React.useRef(null)
  const [isTextAvailable, setIsTextAvailable] = React.useState(false)
  const [isFocus, setIsFocus] = React.useState(false)

  let { discoverySearchBarText } = generalComponent

  const __handleBackPress = () => {
    if(navigation.canGoBack()) navigation.goBack()
  }

  const __handleFocus = (isFocus) => {
    setIsFocus(isFocus)
  }

  const __handleChangeText = (text) => {
    setIsTextAvailable(text.length > 0)
    GeneralComponentAction.setDiscoverySearchBar(text, generalComponentDispatch)
  }

  const __handleOnClearText = () => {
    __handleChangeText("")
    setIsTextAvailable(false)
    discoverySearchBarRef.current.focus()
  }

  const __fetchDiscoveryData = async() => {
    let data = await DiscoveryRepo.fetchDiscoveryData(discoverySearchBarText)
    if(data.success) {
      DiscoveryAction.setDiscoveryData(data, discoveryDispatch)
    }
    DiscoveryAction.setDiscoveryLoadingData(false, discoveryDispatch)
  }

  React.useEffect(() => {
    if(discoverySearchBarText.length > 1) {
      DiscoveryAction.setDiscoveryLoadingData(true, discoveryDispatch)
      if(getDataTimeoutId) clearTimeout(getDataTimeoutId)
      
      getDataTimeoutId = setTimeout( async() => {
        await __fetchDiscoveryData()
      }, 3000)
    }
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
  },[])

  return (
    <Animated.View style={styles.animatedViewContainer(animatedValue)}>
      <Pressable onPress={__handleBackPress}
        android_ripple={{
          color: COLORS.gray1,
          borderless: true,
          radius: 20,
        }} style={styles.arrowContainer}>
        <View style={styles.backArrow}>        
          <MemoIc_arrow_back_white width={20} height={12} fill={colors.black} style={{ alignSelf: 'center'}}/>
        </View>
      </Pressable>
      <Pressable onPress={onContainerClicked} style={styles.searchContainer}>
        <View style={styles.wrapperSearch}>
          {(!isTextAvailable && !isFocus) && <View style={styles.wrapperIcon}>
            <MemoIc_search width={16.67} height={16.67} />
          </View>
          }
          {/* <Text style={styles.inputText}>{StringConstant.newsTabHeaderPlaceholder}</Text> */}
          <TextInput
            ref={discoverySearchBarRef}
            focusable={true}
            autoFocus={true}
            value={generalComponent.discoverySearchBarText}
            onChangeText={__handleChangeText}
            onFocus={() => __handleFocus(true)}
            onBlur={() => __handleFocus(false)}
            multiline={false}
            placeholder={StringConstant.discoverySearchBarPlaceholder}
            placeholderTextColor={COLORS.gray1}
            style={styles.input} />

          {(isTextAvailable || isFocus) && <Pressable onPress={__handleOnClearText} style={styles.clearIconContainer}
            android_ripple={{
              color: COLORS.gray1,
              borderless: true,
              radius: 14,
            }}>
            <View style={styles.wrapperDeleteIcon}>
              <IconClear width={9} height={10} iconColor={colors.black}/>
            </View>
          </Pressable> }
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  arrowContainer: {paddingLeft:20},
  backArrow : {flex: 1, justifyContent: 'center', marginRight: 9, },
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: SIZES.base,
    marginHorizontal: SIZES.base,
  },
  clearIconContainer: {
    justifyContent: 'center', 
    alignItems: 'center',
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
    height: 36,
    paddingTop: 0,
    paddingBottom: 0,
  },
  inputText: {
    marginRight: 16,
    paddingStart: 10,
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.inter[400],
    // height: 36,
    paddingTop: 0,
    paddingBottom: 0,
    color: COLORS.gray1,
    alignSelf: 'center'
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
    marginRight: 9.5,
  },
  newPostText: {
    color: COLORS.holyTosca,
    marginRight: 11,
    ...FONTS.h3,
  },
  animatedViewContainer: (animatedValue) => ({
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: animatedValue,
    zIndex: 10,
    height: dimen.size.DISCOVERY_HEADER_HEIGHT,
    paddingTop: 7,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.alto,
    // paddingLeft: 20,
    // paddingRight: 20,
  }),
});

export default DiscoverySearch;
