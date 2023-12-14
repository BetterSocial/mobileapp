import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {COLORS} from '../../utils/theme';

const ListTopics = ({item, i, myTopic, handleSelectedLanguage}) => (
  <Pressable
    onPress={() => handleSelectedLanguage(item.topic_id)}
    key={i}
    style={[
      styles.bgTopicSelectNotActive,
      {backgroundColor: myTopic[item.topic_id] ? COLORS.blue : COLORS.concrete}
    ]}>
    <Text>{item.icon}</Text>
    <Text
      style={[
        styles.textTopicNotActive,
        {color: myTopic[item.topic_id] ? COLORS.white : COLORS.mineShaft}
      ]}>
      #{item.name}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  bgTopicSelectNotActive: {
    backgroundColor: COLORS.concrete,
    // minWidth: 100,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 14,
    flexDirection: 'row',
    // justifyContent: 'center',
    marginRight: 8,
    marginBottom: 10,
    alignItems: 'center'
  },
  textTopicNotActive: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: COLORS.mineShaft
    // paddingLeft: 5,
  }
});

export default React.memo(ListTopics);
