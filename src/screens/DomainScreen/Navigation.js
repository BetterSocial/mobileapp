import * as React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import MemoIc_arrow_back from '../../assets/arrow/Ic_arrow_back';
import {fonts} from '../../utils/fonts';
import {useNavigation} from '@react-navigation/core';

const Navigation = ({domain}) => {
  const navigation = useNavigation();
  const backScreen = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.Header}>
      <TouchableOpacity onPress={() => backScreen()}>
        <MemoIc_arrow_back width={18} height={18} />
      </TouchableOpacity>
      <View style={styles.domain}>
        <Text style={styles.domainText}>{domain}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Header: {
    flexDirection: 'row',
    height: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  domain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  domainText: {
    fontSize: 16,
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    lineHeight: 19,
  },
});

export default Navigation;
