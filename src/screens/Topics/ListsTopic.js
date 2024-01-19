import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {COLORS} from '../../utils/theme';

const styles = StyleSheet.create({
  bgTopicSelectNotActive: (isActive) => ({
    backgroundColor: isActive ? COLORS.bondi_blue : COLORS.concrete,
    // minWidth: 100,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 14,
    flexDirection: 'row',
    // justifyContent: 'center',
    marginRight: 8,
    marginBottom: 10,
    alignItems: 'center'
  }),
  textTopicNotActive: (isActive) => ({
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: isActive ? COLORS.white : COLORS.mine_shaft
    // paddingLeft: 5,
  })
});

const ListTopics = ({item, i, onPress}) => {
  const [isActive, setIsActive] = React.useState(false);

  const handleSelectedLanguage = (id) => {
    setIsActive((prevState) => !prevState);
    if (onPress) {
      onPress(id);
    }
  };

  return (
    <Pressable
      onPress={() => handleSelectedLanguage(item.topic_id)}
      key={i}
      style={[styles.bgTopicSelectNotActive(isActive)]}>
      <Text>{item.icon}</Text>
      <Text style={[styles.textTopicNotActive(isActive)]}>#{item.name}</Text>
    </Pressable>
  );
};

export default React.memo(ListTopics);
