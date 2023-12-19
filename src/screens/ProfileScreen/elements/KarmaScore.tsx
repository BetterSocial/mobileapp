import * as React from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {colors} from '../../../utils/colors/index';
import BetterScore from '../../../assets/better-score.png';

type KarmaScoreProps = {
  score: number;
};

export const KarmaScore = ({score}: KarmaScoreProps) => {
  return (
    <View
      style={{
        backgroundColor: colors.darkBlue,
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
      <Text style={{fontWeight: '800', color: colors.white, fontSize: 21, marginRight: 8}}>
        {score}
      </Text>
      <Text style={{fontSize: 12, fontWeight: '700', color: colors.white}}>Karma</Text>
    </View>
  );
};
