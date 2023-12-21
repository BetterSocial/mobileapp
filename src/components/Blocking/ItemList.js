import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import {colors} from '../../utils/colors';
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
    <TouchableOpacity testID="click" style={styles.container} onPress={() => onActive()}>
      <Text style={styles.label}>{label}</Text>
      {active && <Icon testID="active-icon" name="check-circle" size={20} color={colors.red} />}
    </TouchableOpacity>
  );
};

export default ItemList;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
    borderBottomColor: COLORS.alto,
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
