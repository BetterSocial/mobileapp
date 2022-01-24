import * as React from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import dimen from '../../../utils/dimen';
import {fonts, normalize, normalizeFontSize} from '../../../utils/fonts';

const Navigation = ({domain}) => {
  const navigation = useNavigation();
  const backScreen = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView>
      <View style={styles.Header}>
      <TouchableOpacity onPress={() => backScreen()} >
        <MemoIc_arrow_back width={normalize(18)} height={normalize(18)} />
      </TouchableOpacity>
      <View style={styles.domain}>
        <Text style={styles.domainText} numberOfLines={1} ellipsizeMode="tail">
          {domain}
        </Text>
      </View>
    </View>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  Header: {
    flexDirection: 'row',
    height: dimen.size.DOMAIN_HEADER_HEIGHT,
    paddingHorizontal: normalize(16),
    alignItems: 'center',
    backgroundColor: 'white',
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
