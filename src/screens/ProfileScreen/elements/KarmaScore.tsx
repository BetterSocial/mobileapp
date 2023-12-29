import * as React from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import BetterScore from '../../../assets/better-score.png';
import {COLORS} from '../../../utils/theme';

type KarmaScoreProps = {
  score: number;
};

export const KarmaScore = ({score}: KarmaScoreProps) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.darkBlue,
        borderRadius: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 5,
        alignSelf: 'flex-start'
      }}>
      <FastImage
        resizeMode={FastImage.resizeMode.contain}
        source={BetterScore}
        style={{width: 24, height: 24, marginRight: 8}}
      />
      <Text style={{fontWeight: '800', color: COLORS.white, fontSize: 21, marginRight: 8}}>
        {score}
      </Text>
      <Text style={{fontSize: 12, fontWeight: '700', color: COLORS.white}}>Karma</Text>
    </View>
  );
};
