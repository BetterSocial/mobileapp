import * as React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {SIZES, FONTS, COLORS} from '../../utils/theme';
import {sanitizeUrlForLinking} from '../../utils/Utils';
import Gap from '../../components/Gap';
import {fonts} from '../../utils/fonts';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';

const Content = (props) => {
  const navigation = useNavigation();
  let {item, title, image, description, url} = props;

  let onContentPressed = () => {
    navigation.push('DetailDomainScreen', {
      item,
    });
  };

  return (
    <TouchableOpacity onPress={onContentPressed}>
      <View style={styles.container}>
        <View style={styles.base}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Gap height={SIZES.base} />
        <View style={{paddingHorizontal: -SIZES.base}}>
          <Image
            source={{uri: image ? image : DEFAULT_PROFILE_PIC_PATH}}
            style={{
              width: '100%',
              height: SIZES.height * 0.3,
            }}
          />
        </View>
        <View style={styles.base}>
          <Text style={styles.content}>
            {description}{' '}
            <Text
              onPress={() => Linking.openURL(sanitizeUrlForLinking(url))}
              style={{
                color: COLORS.blue,
                textDecorationLine: 'underline',
                marginStart: 8,
                fontFamily: fonts.inter[600],
                lineHeight: 18,
                fontSize: 12,
              }}>
              Open Link
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.base,
  },
  base: {
    paddingHorizontal: SIZES.base,
  },
  content: {
    marginLeft: 12,
    marginRight: 12,
    marginTop: 5,
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.blackgrey,
  },
  title: {
    marginLeft: 12,
    marginRight: 12,
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 17,
  },
});

export default Content;
