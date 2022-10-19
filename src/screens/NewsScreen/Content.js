import * as React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Gap from '../../components/Gap';
import Image, {imageConst} from '../../components/Image';
import {COLORS, SIZES} from '../../utils/theme';
import {NewsEmptyState} from '../../assets/images';
import {fonts} from '../../utils/fonts';
import {sanitizeUrlForLinking} from '../../utils/Utils';
import FastImage from 'react-native-fast-image';

const Content = (props) => {
  const navigation = useNavigation();
  const {item, title, image, description, url, onContentClicked = undefined} = props;

  const onContentPressed = () => {
    if(onContentClicked) {
      return onContentClicked()
    }

    return navigation.push('LinkContextScreen', {
      item,
    });
  };

  return (
    <Pressable onPress={onContentPressed}>
      <View >
        <View style={styles.base}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Gap height={SIZES.base} />
        <View >
          {image ? (
            <Image
              source={{uri: image, priority: imageConst.priority.normal}}
              style={{
                width: '100%',
                height: 180,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <Image
              source={NewsEmptyState}
              style={{
                width: '100%',
                height: 180,
              }}
              resizeMode={FastImage.resizeMode.cover}
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
  base: {
    // paddingHorizontal: SIZES.base,
  },
  content: {
    // marginLeft: 12,
    // marginRight: 12,
    marginTop: 5,
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.blackgrey,
  },
  title: {
    // marginLeft: 12,
    // marginRight: 12,
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 17,
  },
});

export default Content;
