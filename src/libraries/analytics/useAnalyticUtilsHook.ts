import AnalyticsEventTracking, {BetterSocialEventTracking} from './analyticsEventTracking';

const useAnalyticUtilsHook = (type: 'SIGNED' | 'ANONYMOUS') => {
  const getEventName = (
    signedEvent: BetterSocialEventTracking,
    anonEvent: BetterSocialEventTracking
  ): BetterSocialEventTracking => {
    if (type === 'SIGNED') return signedEvent;
    return anonEvent;
  };

  const eventTrackByUserType = (
    signedEvent: BetterSocialEventTracking,
    anonEvent: BetterSocialEventTracking,
    additionalData?: object
  ) => {
    if (type === 'SIGNED') return AnalyticsEventTracking.eventTrack(signedEvent, additionalData);
    return AnalyticsEventTracking.eventTrack(anonEvent, additionalData);
  };

  return {
    eventTrackByUserType,
    getEventName
  };
};

export default useAnalyticUtilsHook;
