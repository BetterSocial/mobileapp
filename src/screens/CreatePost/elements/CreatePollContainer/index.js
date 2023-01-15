import React, { lazy, Suspense } from 'react';
import { Platform, View } from 'react-native';

const CreatePollComponent = lazy(() =>
  Platform.OS === 'ios'
    ? import('./CreatePollContainer.ios')
    : import('./CreatePollContainer.android'),
);

const CreatePollContainer = (props) => (
    <Suspense fallback={<View />}>
      <CreatePollComponent {...props} />
    </Suspense>
  );

export default CreatePollContainer;
