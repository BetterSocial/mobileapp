import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';

import {useNavigation} from '@react-navigation/core';

import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';

const Navigation = ({domain}) => {
  const navigation = useNavigation();
  const backScreen = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.Header}>
      <TouchableOpacity onPress={() => backScreen()} style={styles.backbutton}>
        <MemoIc_arrow_back width={normalize(18)} height={normalize(18)} />
      </TouchableOpacity>
      <View style={styles.domain}>
        <Text style={styles.domainText} numberOfLines={1} ellipsizeMode="tail">
          {domain}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Header: {
    flexDirection: 'row',
    height: normalize(48),
    paddingHorizontal: normalize(16),
    alignItems: 'center',
    backgroundColor: 'white',
  },
  backbutton: {
    position: 'absolute',
    left: 20,
  },
  domain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  domainText: {
    fontSize: normalizeFontSize(16),
    fontFamily: fonts.inter[600],
    lineHeight: normalize(19),
    paddingHorizontal: 50,
    textAlign: 'center',
  },
});

export default Navigation;
