import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {fonts} from '../../utils/fonts';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../utils/colors';

const ItemList = ({label, active, onSelect, id}) => {
  // add | remove
  const [type, setType] = useState('add');
  const onActive = () => {
    if (type === 'add') {
      onSelect(id, label, type);
      setType('remove');
    } else {
      onSelect(id, label, type);
      setType('add');
    }
  };
  return (
    <TouchableOpacity style={styles.container} onPress={() => onActive()}>
      <Text style={styles.label}>{label}</Text>
      {active && <Icon name="check-circle" size={20} color={colors.red} />}
    </TouchableOpacity>
  );
};

export default ItemList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  label: {
    fontFamily: fonts.inter[400],
    fontSize: 14,
    paddingHorizontal: 20,
    color: '#000',
    flex: 1,
  },
});
