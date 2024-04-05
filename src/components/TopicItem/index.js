/* eslint-disable arrow-body-style */
import * as React from 'react';
import Icon from 'react-native-vector-icons/Fontisto';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const TopicItem = ({label, removeTopic, style, onTopicPress = () => {}}) => {
  return (
    <Pressable testID="topicPress" onPress={onTopicPress}>
      <View style={[styles.containerTag, style]}>
        <Text style={styles.tag}>{label}</Text>
        <TouchableOpacity
          testID="removeTopic"
          onPress={() => removeTopic(label)}
          style={styles.btn}>
          <Icon name="close" size={13.33} allowFontScaling={false} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default TopicItem;

const styles = StyleSheet.create({
  containerTag: {
    backgroundColor: COLORS.almostBlack,
    borderRadius: 14,
    paddingLeft: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 12
  },
  tag: {
    fontFamily: fonts.inter[400],
    fontSize: 12
  },
  btn: {
    marginLeft: 7,
    paddingVertical: 10,
    paddingLeft: 4,
    paddingRight: 10
  }
});
