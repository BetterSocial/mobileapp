/* eslint-disable arrow-body-style */
import * as React from 'react';
import Icon from 'react-native-vector-icons/Fontisto';
import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {fonts, normalizeFontSize} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';
import dimen from '../../utils/dimen';

const TopicItem = ({label, removeTopic, style, onTopicPress = () => {}}) => {
  return (
    <Pressable testID="topicPress" onPress={onTopicPress}>
      <View style={[styles.containerTag, style]}>
        <Text style={styles.tag}>{label}</Text>
        <TouchableOpacity
          testID="removeTopic"
          onPress={() => removeTopic(label)}
          style={styles.btn}>
          <Icon name="close" size={13.33} color={COLORS.white} allowFontScaling={false} />
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
    paddingLeft: dimen.normalizeDimen(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: dimen.normalizeDimen(12)
  },
  tag: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    color: COLORS.white
  },
  btn: {
    marginLeft: dimen.normalizeDimen(7),
    paddingVertical: dimen.normalizeDimen(10),
    paddingLeft: dimen.normalizeDimen(4),
    paddingRight: dimen.normalizeDimen(10)
  }
});
