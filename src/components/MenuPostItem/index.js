import * as React from 'react';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import MemoIc_arrow_right from '../../assets/icons/Ic_arrow_right';
import {COLORS} from '../../utils/theme';

const MenuPostItem = ({icon, label, labelStyle, onPress, topic, listTopic}) => {
  if (topic) {
    return (
      <Pressable style={styles.containerTopic} onPress={onPress} hitSlop={{bottom: 0, top: 0}}>
        <View style={styles.content}>
          <TouchableOpacity onPress={onPress}>{icon}</TouchableOpacity>
          {listTopic}
        </View>
      </Pressable>
    );
  }
  return (
    <TouchableOpacity testID="notopic" style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        {icon}
        <Text style={[styles.text, labelStyle]}>{label}</Text>
      </View>
      <MemoIc_arrow_right width={8} height={12} fill={COLORS.white} />
    </TouchableOpacity>
  );
};

export default MenuPostItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray110,
    paddingVertical: 19,
    paddingRight: 24,
    paddingLeft: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8
  },
  containerTopic: {
    backgroundColor: COLORS.gray110,
    paddingRight: 24,
    paddingLeft: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8
  },
  content: {flexDirection: 'row', alignItems: 'center', flex: 1},
  text: {marginLeft: 12}
});
