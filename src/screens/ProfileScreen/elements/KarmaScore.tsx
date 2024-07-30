import * as React from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import {Text, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import MemoIcQuestionMark from '../../../assets/icons/Ic_question_mark';
import {BetterSocialLogoGram} from '../../../assets';
import {COLORS} from '../../../utils/theme';
import {CircleGradient} from '../../../components/Karma/CircleGradient';
import {ProfileScreenAnalyticsEventTracking} from '../../../libraries/analytics/useProfileScreenAnalyticsHook';
import {fonts, normalize} from '../../../utils/fonts';

type KarmaScoreProps = {
  score: number;
  evenTrack: ProfileScreenAnalyticsEventTracking;
};

export const KarmaScore = ({score, evenTrack}: KarmaScoreProps) => {
  const [isTooltipShown, setIsTooltipShown] = React.useState(false);
  const showTooltip = () => {
    if (evenTrack?.onNoPostsKarmaScoreClicked) evenTrack.onNoPostsKarmaScoreClicked();
    setIsTooltipShown(true);
  };

  const closeTooltip = () => {
    if (evenTrack?.onNoPostsKarmaScoreClosed) evenTrack.onNoPostsKarmaScoreClosed();
    setIsTooltipShown(false);
  };

  return (
    <TouchableWithoutFeedback onPress={showTooltip}>
      <View
        style={{
          borderRadius: 32,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'flex-start'
        }}>
        <View style={{marginRight: 8}}>
          <CircleGradient size={normalize(28)} width={normalize(6)} fill={score}>
            <BetterSocialLogoGram />
          </CircleGradient>
        </View>
        <Text
          style={{
            fontFamily: fonts.inter[500],
            fontSize: 24,
            lineHeight: 36,
            marginRight: 8,
            color: COLORS.white
          }}>{`${score} Karma`}</Text>
        <Tooltip
          allowChildInteraction={true}
          isVisible={isTooltipShown}
          placement={'bottom'}
          closeOnContentInteraction={false}
          onClose={closeTooltip}
          closeOnBackgroundInteraction={true}
          contentStyle={{
            borderRadius: 10,
            padding: 16,
            height: 'auto',
            backgroundColor: COLORS.almostBlack
          }}
          content={
            <View>
              <Text
                style={{
                  fontFamily: fonts.inter[600],
                  fontSize: normalize(16),
                  lineHeight: normalize(24),
                  marginBottom: normalize(8),
                  color: COLORS.white
                }}>
                What is my Karma Score?
              </Text>
              <Text
                style={{
                  fontFamily: fonts.inter[400],
                  fontSize: normalize(12),
                  lineHeight: normalize(18),
                  marginBottom: normalize(8),
                  color: COLORS.gray510
                }}>
                The higher your Karma score, the higher your visibility on the platform. Get
                rewarded for positive contributions to the community - and avoid being blocked by
                others! Your Karma score will be shown as a circle around your profile picture,
                including for your anonymous posts.
              </Text>
              <Text
                style={{
                  fontWeight: '600',
                  paddingTop: normalize(8),
                  fontSize: normalize(14),
                  lineHeight: normalize(20),
                  color: COLORS.signed_primary,
                  width: '100%',
                  textAlign: 'right'
                }}
                onPress={closeTooltip}>
                Got it!
              </Text>
            </View>
          }>
          <View style={{}}>
            <MemoIcQuestionMark width={normalize(13)} height={normalize(13)} />
          </View>
        </Tooltip>
      </View>
    </TouchableWithoutFeedback>
  );
};
