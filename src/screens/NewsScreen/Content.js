import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {Linking, Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Gap from '../../components/Gap';
import Image, {imageConst} from '../../components/Image';
import {COLORS, SIZES} from '../../utils/theme';
import {NewsEmptyState} from '../../assets/images';
import {fonts} from '../../utils/fonts';
import {sanitizeUrlForLinking} from '../../utils/Utils';

const Content = (props) => {
  const navigation = useNavigation();
  const {item, title, image, description, url, onContentClicked = undefined, eventTrack} = props;

  const onContentPressed = () => {
    if (onContentClicked) {
      return onContentClicked();
    }

    eventTrack?.onOpenLinkContextScreen();

    return navigation.push('LinkContextScreen', {
      item
    });
  };

  const onOpenLinkPressed = () => {
    eventTrack?.onOpenLinkPressed();
    Linking.openURL(sanitizeUrlForLinking(url));
  };

  return (
    <Pressable testID="press" onPress={onContentPressed}>
      <View>
        <View style={styles.base}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Gap height={SIZES.base} />
        <View>
          {image ? (
            <Image
              source={{uri: image, priority: imageConst.priority.normal}}
              style={{
                width: '100%',
                height: 180
              }}
              resizeMode={imageConst.resizeMode.cover}
            />
          ) : (
            <Image
              source={NewsEmptyState}
              style={{
                width: '100%',
                height: 180
              }}
              resizeMode={imageConst.resizeMode.co}
            />
          )}
        </View>
        <View style={styles.base}>
          <Text style={styles.content}>
            {description}{' '}
            <Text
              testID="textPress"
              onPress={onOpenLinkPressed}
              style={{
                color: COLORS.signed_primary,
                textDecorationLine: 'underline',
                marginStart: 8,
                fontFamily: fonts.inter[600],
                lineHeight: 18,
                fontSize: 12
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
    color: COLORS.gray510
  },
  title: {
    // marginLeft: 12,
    // marginRight: 12,
    fontFamily: fonts.inter[600],
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.white
  }
});

export default Content;
