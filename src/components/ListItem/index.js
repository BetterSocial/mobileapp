import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MemoIc_arrow_right from '../../assets/icons/Ic_arrow_right';
import {colors} from '../../utils/colors';

const ListItem = ({icon, label, labelStyle, onPress, topic, listTopic}) => {
  if (topic) {
    return (
      <View style={styles.containerTopic}>
        <View style={styles.content}>
          <TouchableOpacity onPress={onPress}>{icon}</TouchableOpacity>
          {listTopic}
        </View>
      </View>
    );
  }
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        {icon}
        <Text style={[styles.text, labelStyle]}>{label}</Text>
      </View>
      <MemoIc_arrow_right width={8} height={12} />
    </TouchableOpacity>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightgrey,
    paddingVertical: 19,
    paddingRight: 24,
    paddingLeft: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  containerTopic: {
    backgroundColor: colors.lightgrey,
    paddingRight: 24,
    paddingLeft: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
  },
  content: {flexDirection: 'row', alignItems: 'center'},
  text: {marginLeft: 12},
});
