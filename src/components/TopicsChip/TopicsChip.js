import * as React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const TopicsChip = ({
  topics = [],
  fontSize = 24,
  onLayout,
  topicContainer,
  topicItemStyle,
  textStyle
}) => {
  const navigation = useNavigation();

  const onTopicPress = (topic) => {
    navigation.push('TopicPageScreen', {id: topic.replace('#', '')});
  };

  const handleLayout = ({nativeEvent}) => {
    if (onLayout && typeof onLayout === 'function') {
      onLayout(nativeEvent);
    }
  };

  if (topics.length === 0) return <></>;

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal
      onLayout={handleLayout}
      contentContainerStyle={styles.contentStyle}
      style={[styles.topicContainer, topicContainer]}>
      {topics.map((item) => (
        <View key={`topicContainer-${item}`} style={[styles.topicItemContainer, topicItemStyle]}>
          <TouchableOpacity
            testID="topic-chip"
            activeOpacity={1}
            onPress={() => onTopicPress(item)}>
            <Text style={{...styles.topicText, fontSize, textStyle}}>
              #{item && item.toLowerCase()}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default TopicsChip;

const styles = StyleSheet.create({
  topicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    marginLeft: 12
  },
  topicItemContainer: {
    backgroundColor: COLORS.transparent,
    borderRadius: 14,
    overflow: 'hidden',
    marginEnd: 11,
    marginBottom: 4,
    paddingHorizontal: 13,
    paddingVertical: 4.5,
    borderWidth: 1,
    borderColor: COLORS.white30percent
  },
  topicText: {
    fontFamily: fonts.inter[500],
    borderRadius: 14,
    color: COLORS.white
  },
  contentStyle: {
    paddingRight: 12
  }
});
