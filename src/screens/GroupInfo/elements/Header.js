import * as React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Gap} from '../../../components';
import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';
import {trimString} from '../../../utils/string/TrimString';
import {COLORS} from '../../../utils/theme';

const Header = ({title}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity testID="onBack" onPress={() => navigation.goBack()}>
        <MemoIc_arrow_back width={20} height={12} />
      </TouchableOpacity>
      <Text testID="title" style={styles.title}>
        {trimString(title, 21)}
      </Text>
      <Gap width={20} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: normalize(48),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  title: {
    fontSize: normalizeFontSize(16),
    fontFamily: fonts.inter[600],
    lineHeight: normalizeFontSize(19.36),
    color: COLORS.black
  }
});
