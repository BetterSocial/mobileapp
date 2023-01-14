import React from 'react';
import { Platform } from 'react-native';
import CreatePollContainerIOS from './CreatePollContainer.ios';
import CreatePollContainerAndroid from './CreatePollContainer.android';

function CreatePollContainer(props) {
  if (Platform.OS === 'android') {
    return <CreatePollContainerAndroid {...props} />
  }
    return <CreatePollContainerIOS {...props} />

}

export default CreatePollContainer;
