import React from 'react';

import {KeyboardAvoidingView, Platform} from 'react-native';

type Props = {
  children: React.ReactNode;
};

const KeyboardWrapper = ({children}: Props): JSX.Element => {
  const isIos = Platform.OS === 'ios';
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={isIos ? 'padding' : undefined}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardWrapper;
