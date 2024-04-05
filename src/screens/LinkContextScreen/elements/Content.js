import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import NewsEmptyState from '../../../assets/images/news-empty-state.png';
import {Gap} from '../../../components';
import {COLORS, SIZES} from '../../../utils/theme';
import {fonts} from '../../../utils/fonts';

const Content = ({item, onContentPressed}) => {
  const a = 0;

  return (
    <Pressable onPress={() => onContentPressed(item)} style={styles.pressableContainer}>
      <View style={styles.container}>
        <Text style={styles.domainItemTitle}>{item.content.title}</Text>
        {item.content.image ? (
          <Image source={{uri: item.content.image}} style={styles.domainImage} />
        ) : (
          <Image source={NewsEmptyState} style={styles.domainImageEmptyState} />
        )}
        <View style={styles.domainTextContainer}>
          <Text style={styles.domainItemDescription}>{item.content.description}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%'
  },
  domainItemTitle: {
    fontSize: 16,
    fontFamily: fonts.inter[700],
    lineHeight: 24,
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
    color: COLORS.white
  },
  domainItemDescription: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.white
  },
  domainIndicatorContainer: {
    marginLeft: -4
  },
  domainImage: {
    flex: 1,
    marginBottom: 8
  },
  domainImageEmptyState: {
    flex: 1,
    marginBottom: 8,
    backgroundColor: COLORS.gray110,
    resizeMode: 'center',
    alignSelf: 'center',
    width: '100%'
  },
  domainTextContainer: {
    paddingHorizontal: 20
  },
  pressableContainer: {
    flex: 1,
    display: 'flex'
  }
});

export default Content;
