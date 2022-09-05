/* eslint-disable no-nested-ternary */
import * as React from 'react';
import PropTypes from 'prop-types';
import SeeMore from 'react-native-see-more-inline';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import Gap from '../../components/Gap';
import ImageLayouter from './elements/ImageLayouter';
import TopicsChip from '../../components/TopicsChip/TopicsChip';
import { COLORS, SIZES } from '../../utils/theme';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { getCaptionWithTopicStyle } from '../../utils/string/StringUtils';

const { width: screenWidth } = Dimensions.get('window');

const FONT_SIZE_MEDIA = 16
const FONT_SIZE_TEXT = 24
const FONT_SIZE_TEXT_LONG = 16

const Content = ({ message, images_url, style, onPress, topics = [] }) => {
  const navigation = useNavigation();
  const cekImage = () => images_url !== null && images_url !== '' && images_url !== undefined;

  const topicChipFontSize = message.length < 270 ? FONT_SIZE_TEXT : FONT_SIZE_TEXT_LONG;

  const onImageClickedByIndex = (index) => {
    navigation.push('ImageViewer', {
      title: 'Photo',
      index,
      images: images_url.reduce((acc, current) => {
        acc.push({ url: current });
        return acc;
      }, []),
    });
  };

  const handleText = (text, onPress) => {
    if (text.length > 650) {
      return (
        <View style={styles.textContainer}>
          <Text style={styles.text(text)} numberOfLines={9}>
            {getCaptionWithTopicStyle(text.substring(0, 300).trim(), navigation)}
            <Text onPress={onPress} style={styles.seemore}>
              ...more
            </Text>
          </Text>
          <TopicsChip topics={topics} fontSize={topicChipFontSize} 
              text={getCaptionWithTopicStyle(text.substring(0, 650).trim())} />
        </View>
      );
    } 
      return <View style={styles.textContainer}>
        <Text style={styles.text(text)} numberOfLines={14}>{getCaptionWithTopicStyle(text, navigation)}</Text>
        <TopicsChip topics={topics} fontSize={topicChipFontSize} text={text}/>
      </View>;
    
  };

  const handleTextMedia = (text, onPress) => (
      <View>
        <Text numberOfLines={4} style={styles.textMedia(text)}>
          {text.length < 180 ? (
            getCaptionWithTopicStyle(text, navigation)
          ) : (
            <Text>
              {`${text.substring(0, 165)}...`}
              <Text onPress={onPress} style={styles.seemore}>
                more
              </Text>
            </Text>
          )}
        </Text>
        <TopicsChip topics={topics} fontSize={FONT_SIZE_MEDIA} />
      </View>

    );

  return (
    <Pressable onPress={onPress} style={[styles.contentFeed, style]}>
      {cekImage() ? (
        images_url.length > 0 ? (
          <View style={styles.container}>
            <View
              style={{
                paddingLeft: 20,
                paddingRight: 20,
              }}>
              {handleTextMedia(message, onPress)}
            </View>
            <Gap height={SIZES.base} />
            <View style={styles.containerImage}>
              <ImageLayouter
                images={images_url}
                onimageclick={onImageClickedByIndex}
              />
            </View>
          </View>
        ) : (
          <View style={styles.containerShowMessage()}>
            {handleText(message, onPress)}
          </View>
        )
      ) : null}
    </Pressable>
  );
};

Content.propTypes = {
  message: PropTypes.string,
  images_url: PropTypes.array,
  style: PropTypes.object,
  onPress: PropTypes.func,
  topics: PropTypes.arrayOf(PropTypes.string)
};

export default Content;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerImage: {
    flex: 1,
  },
  imageList: {
    flex: 1,
    width: screenWidth - 32,
    borderRadius: 16,
  },
  containerShowMessage: () => ({
      justifyContent: 'center',
      // alignItems: currentRouteName === 'Feed' ? 'center' : 'center',
      alignItems: 'center',
      flex: 1,
      paddingBottom: 10,
      minHeight: 100,
      paddingLeft: 20,
      paddingRight: 20,
    }),
  text: (text) => {
    if (text.length < 270) {
      return {
        fontFamily: fonts.inter[400],
        fontWeight: 'normal',
        fontSize: FONT_SIZE_TEXT,
        color: colors.black,
        lineHeight: 44,
      };
    }
    return {
      fontFamily: fonts.inter[400],
      fontWeight: 'normal',
      fontSize: FONT_SIZE_TEXT_LONG,
      color: colors.black,
      lineHeight: 24,
    };
  },
  textMedia: (text) => ({
      fontFamily: fonts.inter[400],
      fontWeight: 'normal',
      fontSize: FONT_SIZE_MEDIA,
      color: colors.black,
      lineHeight: 24,
    }),

  seemore: {
    color: COLORS.blue,
  },
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerFeedProfile: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 13,
  },

  feedUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
  containerFeedText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  feedDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.black,
    lineHeight: 18,
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8,
  },
  contentFeed: {
    flex: 1,
    marginTop: 12,
  },
  textContentFeed: {
    fontFamily: fonts.inter[400],
    fontSize: 24,
    lineHeight: 24,
    color: colors.black,
  },
  textComment: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: colors.gray,
  },
  usernameComment: {
    fontFamily: fonts.inter[500],
    fontWeight: '900',
    fontSize: 12,
    lineHeight: 24,
    color: colors.black,
  },
  usernameTextComment: {
    fontFamily: fonts.inter[500],
    fontSize: 12,
    lineHeight: 24,
    color: colors.gray,
  },
  item: {
    width: screenWidth - 20,
    height: screenWidth - 20,
    marginTop: 10,
    marginLeft: -20,
    backgroundColor: 'pink',
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    aspectRatio: 1.5,
    resizeMode: 'cover',
  },
  imageAnonimity: {
    marginRight: 8,
    width: 32,
    height: 32,
  },
  textContainer: {
  },
});
