import * as React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const FlatListItem = ({value, index, select, onSelect, icon, desc}) => {
  if (icon) {
    return (
      <TouchableOpacity testID="onselect" style={styles.container} onPress={() => onSelect(index)}>
        <View style={styles.contentText}>
          {icon}
          <View style={styles.containerLabel}>
            <Text style={styles.labelIcon}>{value}</Text>
            <Text style={styles.desc}>{desc}</Text>
          </View>
        </View>
        {index === select && <Icon name="check-circle" color={COLORS.anon_primary} size={20} />}
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity testID="noicon" style={styles.container} onPress={() => onSelect(index)}>
      <Text style={styles.label}>{value}</Text>
      {index === select && (
        <Icon testID="circle-icon" name="check-circle" color={COLORS.anon_primary} size={20} />
      )}
    </TouchableOpacity>
  );
};

export default FlatListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightgrey,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  label: {
    fontFamily: fonts.inter[400],
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.black
  },
  desc: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.blackgrey,
    flexWrap: 'wrap'
  },
  labelIcon: {
    fontFamily: fonts.inter[500],
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.black
  },
  contentText: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    width: 'auto'
  },
  containerLabel: {
    paddingLeft: 12,
    flexWrap: 'nowrap',
    width: '88%'
  }
});
