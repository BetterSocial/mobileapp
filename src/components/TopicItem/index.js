import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
const TopicItem = ({label, removeTopic, style}) => {
  return (
    <View style={[styles.containerTag, style]}>
      <Text style={styles.tag}>{label}</Text>
      <TouchableOpacity onPress={() => removeTopic(label)}>
        <Icon name="close" size={13.33} />
      </TouchableOpacity>
    </View>
  );
};

export default TopicItem;

const styles = StyleSheet.create({
  containerTag: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 7.33,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 12,
  },
  tag: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    marginRight: 5,
    flexWrap: 'wrap',
  },
});
