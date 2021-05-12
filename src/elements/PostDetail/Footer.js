import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IconIc from 'react-native-vector-icons/Ionicons';
import IconEn from 'react-native-vector-icons/Entypo';
import IconMt from 'react-native-vector-icons/MaterialIcons';
import IconMtC from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
const Footer = ({onBlock}) => {
  return (
    <View style={styles.constainer}>
      <TouchableOpacity style={styles.btn}>
        <IconIc
          name="ios-share-social-outline"
          size={17}
          color={colors.gray1}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => onBlock()}>
        <IconEn name="block" size={17} color={colors.gray1} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn}>
        <IconMt name="chat" size={17} color={colors.gray1} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.arrowup}>
        <IconMtC name="arrow-up-bold-outline" size={17} color={colors.gray1} />
      </TouchableOpacity>
      <Text style={styles.count}>0</Text>
      <TouchableOpacity>
        <IconMtC
          name="arrow-down-bold-outline"
          size={17}
          color={colors.gray1}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  constainer: {
    marginHorizontal: 22,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  btn: {
    marginHorizontal: 10,
  },
  count: {
    fontFamily: fonts.inter[400],
    fontSize: 14,
    marginHorizontal: 13,
    color: colors.gray1,
  },
  arrowup: {
    marginLeft: 20,
  },
});
