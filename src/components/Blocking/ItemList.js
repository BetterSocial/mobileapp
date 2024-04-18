import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const ItemList = ({label, active, onSelect, id}) => {
  const [type, setType] = React.useState('add');
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
      {active && <Icon name="check-circle" size={20} color={COLORS.signed_primary} />}
    </TouchableOpacity>
  );
};

export default ItemList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    borderBottomColor: COLORS.gray210,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20
  },
  label: {
    fontFamily: fonts.inter[400],
    fontSize: 14,
    paddingHorizontal: 20,
    color: COLORS.black,
    flex: 1
  }
});
