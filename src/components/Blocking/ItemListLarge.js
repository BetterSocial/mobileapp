import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import IconEn from 'react-native-vector-icons/Entypo';

import Handcuffs from '../../assets/icon-svg/handcuffs.svg';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const ItemListLarge = ({label, desc, iconReght, icon, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        {icon === 'block' && <IconEn name="block" size={17} color={COLORS.black} />}
        {icon === 'handcuffs' && <Handcuffs />}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.desc}>{desc}</Text>
        {iconReght && (
          <TouchableOpacity style={styles.btn}>
            <IconFA5 name="chevron-right" size={17} color={COLORS.black} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ItemListLarge;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderTopColor: COLORS.lightgrey,
    borderTopWidth: 1
  },
  content: {
    flexDirection: 'row'
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 20,
    marginLeft: 15
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    marginLeft: 15,
    fontFamily: fonts.inter[500],
    color: COLORS.black,
    fontSize: 14
  },
  desc: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.blackgrey,
    marginTop: 5,
    flex: 1
  }
});
