import React from 'react';
import {View, Text, Image, StyleSheet, Platform, Dimensions} from 'react-native';
import {Gap} from '../../../components';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const Empty = () => (
  <View style={styles.container}>
    <Image style={styles.image} source={require('../../../assets/ic_empty.png')} />
    <Gap height={20} />
    <View style={{width: 241, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={styles.text}>No posts yet - start this topic off by posting about it</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('screen').height * 0.7
  },
  image: {
    width: 300,
    height: 300
  },
  text: {
    fontSize: 14,
    fontFamily: fonts.inter[400],
    fontWeight: '400',
    lineHeight: 16,
    color: COLORS.black,
    textAlign: 'center'
  }
});

export default Empty;
