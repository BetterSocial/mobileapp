import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
} from 'react-native';

import MemoIcNewChat from '../../../assets/icons/ic_new_chat';
import MemoIc_search from '../../../assets/icons/Ic_search';
import StringConstant from '../../../utils/string/StringConstant';
import {COLORS, FONTS, SIZES} from '../../../utils/theme';

const Search = ({onPress, animatedValue}) => {
  return (
    <Animated.View style={styles.animatedViewContainer(animatedValue)}>
      <View style={styles.wrapperSearch}>
        <TextInput
          multiline={false}
          placeholder={StringConstant.chatTabHeaderPlaceholder}
          placeholderTextColor={COLORS.gray1}
          style={styles.input}
        />
        <View style={styles.wrapperIcon}>
          <MemoIc_search width={17} height={17} />
        </View>
      </View>
      <TouchableOpacity style={styles.wrapperButton} onPress={onPress}>
        <Text style={styles.newPostText}>
          {StringConstant.chatTabHeaderCreateChatButtonText}
        </Text>
        <View>
          <MemoIcNewChat height={17} width={15} style={{marginTop: 0}} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: SIZES.base,
  },
  wrapperSearch: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 14,
    marginRight: 12,
    borderRadius: 8,
    alignSelf: 'center',
    height: 36,
  },
  wrapperButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginEnd: SIZES.base,
    paddingLeft: 8,
    paddingRight: 4,
    paddingTop: 9,
    paddingBottom: 9,
    // backgroundColor: 'red',
  },
  input: {
    marginLeft: 24,
    paddingStart: 16,
    lineHeight: 36,
  },
  wrapperIcon: {
    position: 'absolute',
    left: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  newPostText: {
    color: COLORS.holyTosca,
    marginRight: 11,
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    lineHeight: 14.52,
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
    padding: 7,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray1,
  }),
});

export default Search;
