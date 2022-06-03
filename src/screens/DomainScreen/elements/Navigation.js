import * as React from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import Header from '../../../components/Header';
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
    <Header 
    title={domain}
    titleStyle={styles.domainText}
    onPress={backScreen}
    // containerStyle={styles.Header}
    />
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
