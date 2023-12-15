import * as React from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Tooltip from 'react-native-walkthrough-tooltip';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import BetterScore from '../../../assets/Logogram.png';
import MemoIc_question_mark from '../../../assets/icons/Ic_question_mark';
import {normalize} from '../../../utils/fonts';
import {CircleGradient} from '../../../components/Karma/CircleGradient';

type KarmaScoreProps = {
  score: number;
};

export const KarmaScore = ({score}: KarmaScoreProps) => {
  const [isTooltipShown, setIsTooltipShown] = React.useState(false);
  return (
    <TouchableWithoutFeedback onPress={() => setIsTooltipShown(true)}>
      <View
        style={{
          borderRadius: 32,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'flex-start'
        }}>
        <View style={{marginRight: 8}}>
          <CircleGradient size={normalize(28)} width={normalize(2.3)} fill={score}>
            <FastImage
              resizeMode={FastImage.resizeMode.center}
              source={BetterScore}
              style={{width: 28, height: 28}}
            />
          </CircleGradient>
        </View>
        <Text
          style={{
            fontWeight: '500',
            fontSize: 24,
            lineHeight: 36,
            marginRight: 8
          }}>{`${score} Karma`}</Text>
        <Tooltip
          allowChildInteraction={true}
          isVisible={isTooltipShown}
          placement={'bottom'}
          backgroundColor={'rgba(0,0,0,0)'}
          closeOnContentInteraction={false}
          onClose={() => setIsTooltipShown(false)}
          closeOnBackgroundInteraction={true}
          contentStyle={{
            borderRadius: 10,
            padding: 16,
            height: 'auto'
          }}
          content={
            <View>
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: normalize(16),
                  lineHeight: normalize(24),
                  marginBottom: normalize(8)
                }}>
                Your Karma Score
              </Text>
              <Text
                style={{
                  fontWeight: '400',
                  fontSize: normalize(12),
                  lineHeight: normalize(18),
                  marginBottom: normalize(8),
                  color: '#69707C'
                }}>
                The higher your Karma score, the higher your visibility on the platform. Get
                rewarded for positive contributions to the community - and avoid being blocked by
                others!
              </Text>
              <Text
                style={{
                  fontWeight: '600',
                  paddingVertical: normalize(8),
                  fontSize: normalize(14),
                  lineHeight: normalize(20),
                  color: '#4782D7',
                  width: '100%',
                  textAlign: 'right'
                }}
                onPress={() => setIsTooltipShown(false)}>
                Got it!
              </Text>
            </View>
          }>
          <View style={{}}>
            <MemoIc_question_mark width={normalize(13)} height={normalize(13)} />
          </View>
        </Tooltip>
      </View>
    </TouchableWithoutFeedback>
  );
};
