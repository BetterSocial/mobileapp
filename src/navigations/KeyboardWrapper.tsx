import React from 'react';

import {ViewStyle, KeyboardAvoidingView, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  children: any;
  keyboardVerticalOffset?: number;
  contentContainerStyle?: ViewStyle;
};

const KeyboardWrapper = ({children}: Props): JSX.Element => {
  const isIos = Platform.OS === 'ios';
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      keyboardVerticalOffset={insets.top}
      behavior={isIos ? 'padding' : undefined}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardWrapper;
