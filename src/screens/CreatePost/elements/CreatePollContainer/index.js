import React, { lazy, Suspense } from 'react';
import { Platform, View } from 'react-native';

const CreatePollComponent = lazy(() =>
  Platform.OS === 'ios'
    ? import('./CreatePollContainer.ios')
    : import('./CreatePollContainer.android'),
);

const CreatePollContainer = (props) => {
  return (
    <Suspense fallback={<View />}>
      <CreatePollComponent {...proe.ps} />
    </Suspense>
  );
};

export default CreatePollContainer;
