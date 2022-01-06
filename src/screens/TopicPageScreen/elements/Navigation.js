import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, SafeAreaView } from 'react-native';

import { useNavigation } from '@react-navigation/core';

import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import { fonts, normalize, normalizeFontSize } from '../../../utils/fonts';
import { ButtonFollow, ButtonFollowing } from '../../../components/Button';
import { convertString } from '../../../utils/string/StringUtils';

const Navigation = ({ domain, onPress, isFollow = false }) => {
  const navigation = useNavigation();
  const backScreen = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.Header}>
      <TouchableOpacity onPress={() => backScreen()} style={styles.backbutton}>
        <MemoIc_arrow_back width={normalize(18)} height={normalize(18)} />
      </TouchableOpacity>
      <View style={styles.domain}>
        <Text style={styles.domainText} numberOfLines={1} ellipsizeMode="tail">
          {`#${convertString(domain, ' ', '')}`}
        </Text>
      </View>
      <View style={{ marginRight: 10 }} >
        {isFollow ? (
          <ButtonFollowing handleSetUnFollow={onPress} />
        ) : (
          <ButtonFollow handleSetFollow={onPress} />
        )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Header: {
    flexDirection: 'row',
    height: normalize(48),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: normalize(16),
  },
  backbutton: {
    paddingLeft: 20
  },
  domain: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  domainText: {
    fontSize: normalizeFontSize(18),
    fontFamily: fonts.inter[600],
    lineHeight: normalize(19),
    paddingHorizontal: 50,
    fontWeight: 'bold',
  },
  buttonFollow: {
    paddingHorizontal: 5,
    paddingVertical: 10
  }
});

export default Navigation;
