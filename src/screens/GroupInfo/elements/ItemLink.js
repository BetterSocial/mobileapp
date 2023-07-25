import * as React from 'react';
import {Image, Linking, TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../utils/colors';
import {fonts} from '../../../utils/fonts';
import {trimString} from '../../../utils/string/TrimString';

const ItemLink = ({domain, link, title, image}) => {
  return (
    <TouchableOpacity testID="onPress" onPress={() => Linking.openURL(link)}>
      <View style={styles.container}>
        <View style={styles.detail}>
          <View style={styles.itemDetail}>
            <Text testID="title" style={styles.title}>
              {trimString(title, 50)}
            </Text>
            <Text testID="domain" style={styles.domain}>
              {domain}
            </Text>
          </View>
          <Image style={styles.image} source={{uri: image}} />
        </View>
        <Text style={styles.link}>{link}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ItemLink;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightgrey,
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 4
  },
  title: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 16.94,
    color: '#000'
  },
  domain: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: colors.gray
  },
  link: {
    fontFamily: fonts.inter[400],
    fontSize: 14,
    lineHeight: 20,
    color: colors.blue,
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 4
  },
  itemDetail: {
    flex: 1,
    paddingVertical: 5,
    paddingLeft: 6
  },
  image: {
    width: 70,
    height: 64,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4
  },
  detail: {
    backgroundColor: colors.alto,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
