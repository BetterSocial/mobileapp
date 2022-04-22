import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import NewsEmptyState from '../../../assets/images/news-empty-state.png';
import {Gap} from '../../../components';
import {SIZES} from '../../../utils/theme';
import {fonts} from '../../../utils/fonts';

const Content = ({item, onContentPressed}) => {
  return (
    <Pressable onPress={() => onContentPressed(item)}>
      <View>
        <View style={{paddingHorizontal: 20, marginTop: 14, marginBottom: 14}}>
          <Text style={styles.domainItemTitle}>{item.content.title}</Text>
        </View>
        <Gap height={SIZES.base} />
        {item.content.image ? (
          <Image
            source={{uri: item.content.image}}
            style={{height: 200, marginBottom: 14}}
          />
        ) : (
          <Image
            source={NewsEmptyState}
            style={{height: 135, marginBottom: 14}}
          />
        )}
        <Gap />
        <Gap height={SIZES.base} />
        <View style={{paddingHorizontal: 20}}>
          <Text style={styles.domainItemDescription}>
            {item.content.description}
          </Text>
        </View>
        <Gap height={14} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  domainItemTitle: {
    fontSize: 16,
    fontFamily: fonts.inter[700],
    lineHeight: 24,
  },
  domainItemDescription: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    lineHeight: 24,
  },
  domainIndicatorContainer: {
    marginLeft: -4,
  },
});

export default Content;
