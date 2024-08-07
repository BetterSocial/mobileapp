import React, {memo} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {fonts} from '../../../../utils/fonts';
import {COLORS} from '../../../../utils/theme';

const styles = StyleSheet.create({
  titleText: {
    fontFamily: fonts.inter[500],
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.black
  },
  suggestionContainer: {
    paddingHorizontal: 20
  },
  capsulContainer: {
    backgroundColor: COLORS.gray110,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 10,
    marginTop: 10
  },
  moreTopicContainer: {
    marginTop: 10
  },
  moreText: {
    fontSize: 14,
    color: COLORS.bondi_blue
  }
});

const dummyData = [
  {name: 'Ghostship'},
  {name: 'Disney'},
  {name: 'Ghostship'},
  {name: 'Disney'},
  {name: 'Ghostship'},
  {name: 'Disney'},
  {name: 'Ghostship'},
  {name: 'Disney'},
  {name: 'Ghostship'},
  {name: 'Disney'},
  {name: 'Ghostship'},
  {name: 'Disney'},
  {name: 'Ghostship'},
  {name: 'Disney'},
  {name: 'Ghostship'},
  {name: 'Disney'}
];

const SuggestionTopic = () => {
  const renderData = ({item}) => (
    <TouchableOpacity style={styles.capsulContainer}>
      <Text>{item.name} </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.suggestionContainer}>
      <Text style={styles.titleText}>Suggested Communities</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <FlatList
          data={dummyData}
          renderItem={renderData}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingVertical: 10}}
          nestedScrollEnabled
          numColumns={6}
        />
      </ScrollView>
      <TouchableOpacity style={styles.moreTopicContainer}>
        <Text style={[styles.titleText, styles.moreText]}>More Communities</Text>
      </TouchableOpacity>
    </View>
  );
};

export default memo(SuggestionTopic);
