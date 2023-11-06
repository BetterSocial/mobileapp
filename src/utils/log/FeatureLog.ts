/* eslint-disable no-shadow */

enum EFeatureLogFlag {
  // Hooks
  useSimpleWebsocketHook = 'useSimpleWebsocketHook',
  useOneSignalSubscribeToCommunityHooks = 'useOneSignalSubscribeToCommunityHooks',

  // Utils
  oneSignalUtils = 'oneSignalUtils'
}

type TFeatureLogFlag = {
  [K in keyof typeof EFeatureLogFlag]: boolean;
};

const FeatureLogFlag: TFeatureLogFlag = {
  useSimpleWebsocketHook: false,
  useOneSignalSubscribeToCommunityHooks: false,
  oneSignalUtils: true
};

const getFeatureLoggerInstance = (flag: EFeatureLogFlag) => {
  const featLog = (...args: any[]) => {
    const isEnabled = FeatureLogFlag[flag];
    if (isEnabled) {
      console.log(...args);
    }
  };

  return {
    featLog
  };
};

export {FeatureLogFlag, TFeatureLogFlag, EFeatureLogFlag};
export default getFeatureLoggerInstance;
