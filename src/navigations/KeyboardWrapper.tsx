import React from 'react';

import {KeyboardAvoidingView, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
};

const KeyboardWrapper = ({children}: Props): JSX.Element => {
  const isIos = Platform.OS === 'ios';
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={isIos ? 'padding' : undefined}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardWrapper;
