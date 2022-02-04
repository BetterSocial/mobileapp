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
import {COLORS, FONTS, SIZES} from '../../../utils/theme';

import MemoIcClearCircle from '../../../assets/icons/ic_clear_circle';
import MemoIc_arrow_back_white from '../../../assets/arrow/Ic_arrow_back_white';
import MemoIc_pencil from '../../../assets/icons/Ic_pencil';
import MemoIc_search from '../../../assets/icons/Ic_search';
import StringConstant from '../../../utils/string/StringConstant';
import { colors } from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';
import { useNavigation } from '@react-navigation/core'

const Search = ({value, onChangeText, onPress, animatedValue, showBackButton = false, onContainerClicked = () => {}}) => {
  const navigation = useNavigation()

  const __handleBackPress = () => {
    if(navigation.canGoBack()) navigation.goBack()
  }

  return (
    <Animated.View style={styles.animatedViewContainer(animatedValue)}>
      <Pressable onPress={__handleBackPress}>
        <View style={styles.backArrow}>        
          <MemoIc_arrow_back_white width={20} height={12} fill={colors.black} style={{ alignSelf: 'center'}}/>
        </View>
      </Pressable>
      <Pressable onPress={onContainerClicked} style={styles.searchContainer}>
        <View style={styles.wrapperSearch}>
          <View style={styles.wrapperIcon}>
            <MemoIc_search width={16.67} height={16.67} />
          </View>
          {/* <Text style={styles.inputText}>{StringConstant.newsTabHeaderPlaceholder}</Text> */}
          <TextInput
            focusable={true}
            autoFocus={true}
            value={value}
            onChangeText={onChangeText}
            multiline={false}
            placeholder={StringConstant.newsTabHeaderPlaceholder}
            placeholderTextColor={COLORS.gray1}
            style={styles.input}
            />

          <Pressable onPress={() => onChangeText("")} style={styles.clearIconContainer}>
            <View style={styles.wrapperDeleteIcon}>
              <MemoIcClearCircle width={16.67} height={16.67} iconColor={colors.black}/>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  backArrow : {flex: 1, justifyContent: 'center', marginRight: 16, },
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: SIZES.base,
    marginHorizontal: SIZES.base,
  },
  clearIconContainer: {justifyContent: 'center'},
  searchContainer: {
    flex: 1,
  },
  wrapperSearch: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignSelf: 'center',
    flexDirection: 'row',
    height: 36,
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
    paddingStart: 10,
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
    marginLeft: 8,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  wrapperDeleteIcon: {
    marginLeft: 8,
    marginRight: 16,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  newPostText: {
    color: COLORS.holyTosca,
    marginRight: 11,
    ...FONTS.h3,
  },
  animatedViewContainer: (animatedValue) => ({
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: SIZES.base,
    marginTop: animatedValue,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 7,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.alto,
    paddingLeft: 20,
    paddingRight: 20,
  }),
});

export default Search;
