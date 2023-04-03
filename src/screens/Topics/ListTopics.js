import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {colors} from '../../utils/colors';

const ListTopics = ({item, i, myTopic, handleSelectedLanguage}) => (
  <Pressable
    onPress={() => handleSelectedLanguage(item.topic_id)}
    key={i}
    style={[
      styles.bgTopicSelectNotActive,
      {backgroundColor: myTopic[item.topic_id] ? colors.bondi_blue : colors.concrete}
    ]}>
    <Text>{item.icon}</Text>
    <Text
      style={[
        styles.textTopicNotActive,
        {color: myTopic[item.topic_id] ? colors.white : colors.mine_shaft}
      ]}>
      #{item.name}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  bgTopicSelectNotActive: {
    backgroundColor: colors.concrete,
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
    color: colors.mine_shaft
    // paddingLeft: 5,
  }
});

export default React.memo(ListTopics);