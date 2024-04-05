/* eslint-disable consistent-return */
import * as React from 'react';
import {Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

import MemoIcClearCircle from '../../../assets/icons/ic_clear_circle';
import {MAX_POLLING_CHARACTER_ALLOWED} from '../../../utils/constants';
import {COLORS} from '../../../utils/theme';
import dimen from '../../../utils/dimen';
import {normalizeFontSize} from '../../../utils/fonts';

export default function PollItem({
  index = 0,
  poll,
  onremovepoll = () => {},
  onpollchanged = () => {},
  showdeleteicon,
  showcharactercount = false
}) {
  const [isTextInputFocus, setIsTextInputFocus] = React.useState(false);

  return (
    <View style={isTextInputFocus ? S.focuspollitemcontainer : S.pollitemcontainer}>
      <TextInput
        placeholderTextColor={COLORS.gray410}
        placeholder={`Choice ${index + 1}`}
        style={S.pollitemtextinput}
        onFocus={() => setIsTextInputFocus(true)}
        onBlur={() => setIsTextInputFocus(false)}
        onChangeText={(value) => {
          if (value.length <= MAX_POLLING_CHARACTER_ALLOWED) {
            return onpollchanged({text: value}, index);
          }
        }}
        value={poll.text}
        keyboardAppearance="dark"
      />
      {showcharactercount && (
        <Text
          style={
            S.pollitemtextcount
          }>{`${poll.text.length}/${MAX_POLLING_CHARACTER_ALLOWED}`}</Text>
      )}
      {showdeleteicon && (
        <TouchableOpacity style={S.removepollcontainer} onPress={() => onremovepoll(index)}>
          <MemoIcClearCircle width={20} height={20} style={S.removepollicon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  pollitemcontainer: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.balance_gray,
    borderRadius: 10,
    marginVertical: dimen.normalizeDimen(4),
    paddingHorizontal: dimen.normalizeDimen(8)
  },

  focuspollitemcontainer: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: dimen.normalizeDimen(4),
    paddingHorizontal: dimen.normalizeDimen(8),
    borderColor: COLORS.anon_primary
  },

  pollitemtextinput: {
    flex: 1,
    padding: dimen.normalizeDimen(Platform.OS === 'ios' ? 10 : 0),
    color: COLORS.white
  },

  removepollcontainer: {
    justifyContent: 'center',
    paddingHorizontal: dimen.normalizeDimen(8)
  },

  removepollicon: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  pollitemtextcount: {
    fontSize: normalizeFontSize(12),
    alignSelf: 'center',
    color: COLORS.balance_gray,
    marginEnd: dimen.normalizeDimen(8),
    marginStart: dimen.normalizeDimen(8)
  }
});
