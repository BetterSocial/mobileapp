import React from 'react';
import {View, Text} from 'react-native';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const index = ({text}) => (
  <View
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 16,
      marginVertical: 20
    }}>
    <View
      style={{
        backgroundColor: COLORS.lightgrey,
        borderRadius: 18,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Text
        style={{
          color: COLORS.blackgrey,
          fontFamily: fonts.inter[400],
          fontSize: 14,
          fontWeight: '400',
          textAlign: 'center'
        }}>
        {text}
      </Text>
    </View>
  </View>
);

export default index;
