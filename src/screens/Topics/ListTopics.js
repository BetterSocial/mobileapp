import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {COLORS} from '../../utils/theme';
import {fonts} from '../../utils/fonts';

const ListTopics = ({item, i, myTopic, handleSelectedLanguage}) => (
  <Pressable
    onPress={() => handleSelectedLanguage(item.topic_id)}
    key={i}
    style={[
      styles.bgTopicSelectNotActive,
      {backgroundColor: myTopic[item.topic_id] ? COLORS.signed_primary : COLORS.gray110}
    ]}>
    <Text>{item.icon}</Text>
    <Text
      style={[
        styles.textTopicNotActive,
        {color: myTopic[item.topic_id] ? COLORS.white : COLORS.white}
      ]}>
      #{item.name}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  bgTopicSelectNotActive: {
    backgroundColor: COLORS.gray110,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 14,
    flexDirection: 'row',
    marginRight: 8,
    marginBottom: 10,
    alignItems: 'center'
  },
  textTopicNotActive: {
    fontFamily: fonts.inter[500],
    fontSize: 12,
    color: COLORS.white
  }
});

export default React.memo(ListTopics);
