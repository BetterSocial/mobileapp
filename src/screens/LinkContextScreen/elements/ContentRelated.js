import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import NewsEmptyState from '../../../assets/images/news-empty-state.png';
import {Gap} from '../../../components';
import {COLORS, SIZES} from '../../../utils/theme';
import {fonts} from '../../../utils/fonts';

const ContentRelated = ({item, onContentPressed}) => (
  <Pressable onPress={() => onContentPressed(item)}>
    <Text style={styles.domainItemTitle}>{item.content.title}</Text>
    {item.content.image ? (
      <Image source={{uri: item.content.image}} style={styles.domainImage} />
    ) : (
      <Image source={NewsEmptyState} style={styles.domainImageEmptyState} />
    )}
    <View style={styles.domainTextContainer}>
      <Text style={styles.domainItemDescription}>{item.content.description}</Text>
    </View>
    {/* <Gap height={14} /> */}
  </Pressable>
);

const styles = StyleSheet.create({
  domainItemTitle: {
    fontSize: 16,
    fontFamily: fonts.inter[700],
    lineHeight: 24,
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 12
  },
  domainItemDescription: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    lineHeight: 24
  },
  domainTextContainer: {
    paddingHorizontal: 20
  },
  domainIndicatorContainer: {
    marginLeft: -4
  },
  domainImage: {
    height: 200,
    marginBottom: 14
  },
  domainImageEmptyState: {
    height: 135,
    marginBottom: 14,
    backgroundColor: COLORS.lightgrey,
    resizeMode: 'center',
    width: '100%'
  }
});

export default ContentRelated;
