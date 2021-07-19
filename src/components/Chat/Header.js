import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import IconFI from 'react-native-vector-icons/Fontisto';
import IconEP from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';

import MemoIc_arrow_back_white from '../../assets/arrow/Ic_arrow_back_white';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const Header = ({username, profile}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MemoIc_arrow_back_white width={20} height={12} />
        </TouchableOpacity>
        <Image source={{uri: profile}} style={styles.image} />
        <Text style={styles.name}>{username}</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.btnOptions}>
          <IconEP name="dots-three-vertical" size={12.87} color={'#fff'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: colors.holytosca,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },
  btnOptions: {
    paddingLeft: 9.165,
    paddingRight: 4,
  },
  btnSearch: {
    paddingRight: 9.165,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    marginLeft: 18,
  },
  name: {
    marginLeft: 10,
    fontFamily: fonts.inter[600],
    color: '#fff',
    fontSize: 14,
  },
});
