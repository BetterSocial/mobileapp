import * as React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/Octicons';

import {fonts} from '../../utils/fonts';
import Gap from '../../components/Gap';

const Header = ({onSetting, onSearch}) => {
  return (
    <View style={styles.header}>
      <View style={{flexDirection: 'row'}}>
        <Image
          source={require('../../assets/images/ProfileDefault.png')}
          style={styles.image}
        />
        <TouchableOpacity style={styles.setting} onPress={onSearch}>
          <Icon name="search" size={20} />
        </TouchableOpacity>
      </View>
      <Text style={styles.headerTitle}>Post</Text>
      <View style={{flexDirection: 'row'}}>
        <Gap style={{width: 50}} />
        <TouchableOpacity style={styles.setting} onPress={onSetting}>
          <Icon name="settings" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  image: {
    height: 32,
    width: 32,
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  setting: {
    backgroundColor: '#e8e8e8',
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: fonts.inter[700],
    fontSize: 18,
    color: '#363131',
  },
});
