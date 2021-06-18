import * as React from 'react';
import {View, Text, Image, StyleSheet, Linking} from 'react-native';

import {SIZES, FONTS} from '../../utils/theme';

import {sanitizeUrlForLinking} from '../../utils/Utils';
import Gap from '../../components/Gap';

const Content = ({title, image, description, url}) => {
  return (
    <View style={styles.container}>
      <View style={styles.base}>
        <Text style={{...FONTS.h3}}>{title}</Text>
      </View>
      <Gap height={SIZES.base} />
      <View style={{paddingHorizontal: -SIZES.base}}>
        <Image
          source={{uri: image}}
          style={{
            width: '100%',
            height: SIZES.height * 0.3,
          }}
        />
      </View>
      <View style={styles.base}>
        <Text style={{...FONTS.body3}}>
          {description}{' '}
          <Text
            onPress={() => Linking.openURL(sanitizeUrlForLinking(url))}
            style={{
              color: '#2f80ed',
              textDecorationLine: 'underline',
              marginStart: 8,
              fontFamily: 'bold',
              fontSize: 12,
            }}>
            Open Link
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.base,
  },
  base: {
    paddingHorizontal: SIZES.base,
  },
});

export default Content;
