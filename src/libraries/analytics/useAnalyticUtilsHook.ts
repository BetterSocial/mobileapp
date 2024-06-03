import AnalyticsEventTracking, {BetterSocialEventTracking} from './analyticsEventTracking';
import {BetterSocialChannelType} from '../../../types/database/schema/ChannelList.types';

export type ChannelTypeEventTracking = {
  signed?: BetterSocialEventTracking | undefined;
  anon?: BetterSocialEventTracking | undefined;
  group?: BetterSocialEventTracking | undefined;
  additionalData?: object;
};

const useAnalyticUtilsHook = (
  type: 'SIGNED' | 'ANONYMOUS',
  channelType: BetterSocialChannelType | undefined
) => {
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

  const eventTrackByChannelType = ({
    signed,
    anon,
    group,
    additionalData
  }: ChannelTypeEventTracking) => {
    if (channelType === 'PM' && signed)
      return AnalyticsEventTracking.eventTrack(signed, additionalData);
    if (channelType === 'ANON_PM' && anon)
      return AnalyticsEventTracking.eventTrack(anon, additionalData);
    if (channelType === 'GROUP' && group)
      return AnalyticsEventTracking.eventTrack(group, additionalData);

    return null;
  };

  return {
    eventTrackByUserType,
    eventTrackByChannelType,
    getEventName
  };
};

export default useAnalyticUtilsHook;
