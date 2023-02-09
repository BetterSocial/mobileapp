import * as React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const TopicsChip = ({topics = [], fontSize = 24, isPdp}) => {
  const navigation = useNavigation();

  const onTopicPress = (topic) => {
    navigation.navigate('TopicPageScreen', {id: topic.replace('#', '')});
  };

  if (topics.length === 0) return <></>;

  return (
    <View style={!isPdp ? styles.topicContainer : styles.topicContainerPdp}>
      {topics.map((item) => (
        <View key={`topicContainer-${item}`} style={styles.topicItemContainer}>
          <TouchableOpacity
            testID="topic-chip"
            activeOpacity={1}
            onPress={() => onTopicPress(item)}>
            <Text style={{...styles.topicText, fontSize}}>#{item}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default TopicsChip;

const styles = StyleSheet.create({
  topicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 12,
    position: 'absolute',
    bottom: 0,
    marginLeft: 16
    // backgroundColor: colors.blue
  },
  topicContainerPdp: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%'
    // marginLeft: 16
  },
  topicItemContainer: {
    backgroundColor: colors.lightgrey,
    borderRadius: 14,
    overflow: 'hidden',
    marginEnd: 11,
    marginBottom: 4
  },
  topicText: {
    fontFamily: fonts.inter[500],
    paddingHorizontal: 13,
    paddingVertical: 4.5,
    // fontSize: 12,
    // lineHeight: 14.52,
    borderRadius: 14,
    color: colors.blue
    // backgroundColor: colors.red,
  }
});
