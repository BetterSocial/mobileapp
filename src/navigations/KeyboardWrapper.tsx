import React from 'react';

import {KeyboardAvoidingView} from 'react-native';

type Props = {
  children: React.ReactNode;
};

const KeyboardWrapper = ({children}: Props): JSX.Element => {
  return <KeyboardAvoidingView style={{flex: 1}}>{children}</KeyboardAvoidingView>;
};

export default KeyboardWrapper;
