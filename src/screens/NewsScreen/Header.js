import * as React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import MemoIc_rectangle_gradient from '../../assets/Ic_rectangle_gradient';
import {Avatar} from '../../components';
import Gap from '../../components/Gap';
import {COLORS, FONTS, SIZES} from '../../utils/theme';

const Header = ({image, domain, time}) => {
  return (
    <View style={{flexDirection: 'row', paddingHorizontal: SIZES.base}}>
      <Avatar image={image} />
      <Gap width={8} />
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{...FONTS.h3}}>{domain}</Text>
          <View style={styles.point} />
          <Text style={{color: COLORS.gray, ...FONTS.body3}}>
            {new Date(time).toLocaleDateString()}
          </Text>
        </View>
        <MemoIc_rectangle_gradient width={SIZES.width * 0.43} height={20} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperItem: {backgroundColor: 'white', marginBottom: 16},
  wrapperImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 46,
    width: 46,
    borderRadius: 45,
  },
  wrapperText: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#00ADB5',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: COLORS.gray,
    marginLeft: 8,
    marginRight: 8,
  },
});

export default Header;
