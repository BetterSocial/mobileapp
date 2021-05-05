import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import IconEn from 'react-native-vector-icons/Entypo';
import Handcuffs from '../../assets/icon-svg/handcuffs.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
const ItemListLarge = ({id, label, desc, iconReght, icon, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        {icon === 'block' && <IconEn name="block" size={17} color={'#000'} />}
        {icon === 'handcuffs' && <Handcuffs />}
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.desc}>{desc}</Text>
        {iconReght && (
          <TouchableOpacity style={styles.btn}>
            <IconFA5 name="chevron-right" size={17} color={'#000'} />
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
    borderTopColor: '#E0E0E0',
    borderTopWidth: 1,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 20,
    marginLeft: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 15,
    fontFamily: fonts.inter[500],
    color: '#000',
    fontSize: 14,
  },
  desc: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
    marginTop: 5,
    flex: 1,
  },
});
