import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, SafeAreaView } from 'react-native';

import { useNavigation } from '@react-navigation/core';

import MemoIc_arrow_back from '../../../assets/arrow/Ic_arrow_back';
import { fonts, normalize, normalizeFontSize } from '../../../utils/fonts';

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
          {domain}
        </Text>
      </View>
      <View style={{marginRight: 10}} >
        {isFollow ? (
          <TouchableNativeFeedback  onPress={onPress}>
            <View style={{
              backgroundColor: 'transparent',
              borderRadius: normalize(8),
              paddingHorizontal: normalize(12),
              paddingVertical: normalize(1),
              borderColor: '#00ADB5',
              borderWidth: 0.5,
            }}>
              <Text style={{
                color: '#00ADB5',
                fontSize: normalizeFontSize(14),
                fontFamily: fonts.inter[500],
                // lineHeight: normalize(24),
                textAlign: 'center',
              }}>Following</Text>
            </View>
          </TouchableNativeFeedback>
        ) : (
          <TouchableNativeFeedback onPress={onPress}>
            <View style={{ backgroundColor: '#00ADB5', borderRadius: normalize(8), paddingHorizontal: normalize(12), paddingVertical: normalize(1) }}>
              <Text style={{
                color: 'white',
                fontSize: normalizeFontSize(14),
                fontFamily: fonts.inter[500],
                // lineHeight: normalize(24),
                textAlign: 'center',
              }}>Follow</Text>
            </View>
          </TouchableNativeFeedback>
        )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Header: {
    flexDirection: 'row',
    height: normalize(40),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(8),
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: normalize(16),
  },
  backbutton: {
    paddingLeft: 20
  },
  domain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  domainText: {
    fontSize: normalizeFontSize(18),
    fontFamily: fonts.inter[600],
    lineHeight: normalize(19),
    paddingHorizontal: 50,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonFollow: {
    paddingHorizontal: 5,
    paddingVertical: 10
  }
});

export default Navigation;
