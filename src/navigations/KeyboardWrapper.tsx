import React from 'react';

import {ViewStyle, KeyboardAvoidingView, Platform} from 'react-native';
import dimen from '../utils/dimen';

type Props = {
  children: any;
  keyboardVerticalOffset?: number;
  contentContainerStyle?: ViewStyle;
};

const KeyboardWrapper = ({children, keyboardVerticalOffset}: Props): JSX.Element => {
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      keyboardVerticalOffset={keyboardVerticalOffset || dimen.normalizeDimen(40)}
      {...(Platform.OS === 'ios' ? {behavior: 'padding'} : {})}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardWrapper;
