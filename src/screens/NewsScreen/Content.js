import * as React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Gap from '../../components/Gap';
import Image, {imageConst} from '../../components/Image';
import {COLORS, FONTS, SIZES} from '../../utils/theme';
import {NewsEmptyState} from '../../assets/images';
import {fonts} from '../../utils/fonts';
import {sanitizeUrlForLinking} from '../../utils/Utils';

const Content = (props) => {
  const navigation = useNavigation();
  let {item, title, image, description, url, onContentClicked = undefined} = props;

  let onContentPressed = () => {
    if(onContentClicked) {
      return onContentClicked()
    }

    return navigation.push('LinkContextScreen', {
      item,
    });
  };

  return (
    <Pressable onPress={onContentPressed}>
      <View style={styles.container}>
        <View style={styles.base}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Gap height={SIZES.base} />
        <View style={{paddingHorizontal: -SIZES.base}}>
          {image ? (
            <Image
              source={{uri: image, priority: imageConst.priority.normal}}
              style={{
                width: '100%',
                height: 180,
              }}
            />
          ) : (
            <Image
              source={NewsEmptyState}
              style={{
                width: '100%',
                height: 180,
              }}
            />
          )}
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
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: SIZES.base,
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
