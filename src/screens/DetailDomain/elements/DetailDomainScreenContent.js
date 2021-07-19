import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const DetailDomainScreenContent = ({
  date,
  description,
  domain,
  domainImage,
  image,
  title,
  url,
}) => {
  const onReadFullActiclePressed = () => {
    if (Linking.canOpenURL(url)) Linking.openURL(url);
  };

  return (
    <View styles={styles.contentContainer}>
      <Text style={styles.title}>{title}</Text>
      <Image
        source={{
          uri: image,
        }}
        style={styles.contentImage}
      />
      <Text style={styles.description}>
        {description}{' '}
        <Text onPress={onReadFullActiclePressed} style={styles.readFullText}>
          Read full article
        </Text>
      </Text>
    </View>
  );
};

let styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: 'red',
  },
  title: {
    fontFamily: fonts.inter[500],
    fontSize: 24,
    lineHeight: 29.05,
    color: COLORS.black,
    marginHorizontal: 20,
    marginVertical: 12,
  },
  contentImage: {
    height: 210,
    width: '100%',
    resizeMode: 'contain',
  },
  description: {
    marginTop: 8,
    marginHorizontal: 20,
    fontFamily: fonts.inter[400],
    fontSize: 16,
    lineHeight: 24,
  },
  readFullText: {
    marginTop: 8,
    marginHorizontal: 20,
    fontFamily: fonts.inter[500],
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.blue,
  },
});

export default DetailDomainScreenContent;
