import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import MemoIcQuestionMark from '../../../assets/icons/Ic_question_mark';
import {fonts, normalize} from '../../../utils/fonts';
import {LockIcon, PencilIcon} from '../../../assets';
import {COLORS} from '../../../utils/theme';

export const KarmaLock = (props: {onPressCreatePost: () => void}) => {
  const [isTooltipShown, setIsTooltipShown] = React.useState(false);

  return (
    <View
      style={{
        backgroundColor: COLORS.gray110,
        borderRadius: 12,
        paddingVertical: 6,
        paddingHorizontal: 4
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <LockIcon />
        <Text
          style={{
            fontSize: 12,
            color: COLORS.white,
            fontWeight: '500',
            paddingHorizontal: 8,
            lineHeight: 22
          }}>
          Create a post to unlock your Karma score
        </Text>
        <Tooltip
          allowChildInteraction={true}
          isVisible={isTooltipShown}
          placement={'bottom'}
          closeOnContentInteraction={false}
          onClose={() => setIsTooltipShown(false)}
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
                  fontFamily: fonts.inter[600],
                  paddingVertical: normalize(8),
                  fontSize: normalize(14),
                  lineHeight: normalize(20),
                  color: COLORS.signed_primary,
                  width: '100%',
                  textAlign: 'right'
                }}
                onPress={() => setIsTooltipShown(false)}>
                Got it!
              </Text>
            </View>
          }>
          <TouchableOpacity onPress={() => setIsTooltipShown(true)}>
            <View>
              <MemoIcQuestionMark width={normalize(16)} height={normalize(16)} />
            </View>
          </TouchableOpacity>
        </Tooltip>
      </View>
      <TouchableOpacity
        onPress={props.onPressCreatePost}
        style={{
          backgroundColor: COLORS.signed_primary,
          height: 36,
          marginTop: 8,
          borderRadius: 8,
          marginHorizontal: 2
        }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 9,
            marginHorizontal: 10
          }}>
          <PencilIcon />
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.inter[400],
              color: COLORS.white,
              marginLeft: 8
            }}>
            Start Posting
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
