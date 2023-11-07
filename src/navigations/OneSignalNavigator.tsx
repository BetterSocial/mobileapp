import * as React from 'react';

import useOneSignalSubscribeToCommunityHooks from '../hooks/core/onesignal/useOneSignalSubscribeToCommunityHooks';

export type OneSignalNavigatorProps = {
  children: React.ReactNode;
};

const OneSignalNavigator = ({children}: OneSignalNavigatorProps) => {
  useOneSignalSubscribeToCommunityHooks();

  return <>{children}</>;
};

export default OneSignalNavigator;
