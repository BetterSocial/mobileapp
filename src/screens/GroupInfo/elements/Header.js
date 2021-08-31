import React from 'react';
import {TouchableWithoutFeedback, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Gap} from '../../../components';
import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import {fonts} from '../../../utils/fonts';

const Header = ({title}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <MemoIc_arrow_back width={20} height={12} />
      </TouchableWithoutFeedback>
      <Text style={styles.title}>{title}</Text>
      <Gap width={20} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 48,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.inter[600],
    lineHeight: 19.36,
    color: '#000',
  },
});
