import * as React from 'react';
/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import {Dimensions, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import {useNavigation, useRoute} from '@react-navigation/native';

import ContentPoll from './ContentPoll';
import ImageLayouter from './elements/ImageLayouter';
import TopicsChip from '../../components/TopicsChip/TopicsChip';
import {COLORS} from '../../utils/theme';
import {POST_TYPE_LINK, POST_TYPE_POLL} from '../../utils/constants';
import {colors} from '../../utils/colors';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {getCaptionWithTopicStyle} from '../../utils/string/StringUtils';
import usePostDetail from '../../components/PostPageDetail/hooks/usePostDetail';

const {width: screenWidth, height} = Dimensions.get('window');

const Content = ({
  message,
  images_url = [],
  style,
  onPress,
  topics = [],
  item,
  onNewPollFetched
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const devHeight = Dimensions.get('screen').height;
  const substringPostImage = devHeight / 2.5 - 40 * (height / screenWidth);
  const substringNoImageNoTopic = devHeight / 1.5 - 40 * (height / screenWidth);
  const substringNoImageTopic = devHeight / 1.6 - 40 * (height / screenWidth);
  const substringWithPoll = devHeight / 3 - 40 * (height / screenWidth);
  const substringWithPollTopic = devHeight / 5 - 40 * (height / screenWidth);
  const {calculationText} = usePostDetail();
  const {fontSize, lineHeight, defaultNumberLine} = calculationText(
    message,
    item.post_type,
    null,
    normalizeFontSize(30),
    normalizeFontSize(40),
    125,
    true
  );
  const onImageClickedByIndex = (index) => {
    navigation.push('ImageViewer', {
      title: 'Photo',
      index,
      images: images_url.reduce((acc, current) => {
        acc.push({url: current});
        return acc;
      }, [])
    });
  };
  const renderHandleTextContent = () => {
    let substringNumber = 0;
    if (images_url.length > 0) {
      substringNumber = substringPostImage;
    }
    if (images_url.length < 1 && topics.length > 0) {
      substringNumber = substringNoImageTopic;
    }
    if (images_url.length < 1 && topics.length < 1) {
      substringNumber = substringNoImageNoTopic;
    }

    if (item.post_type === POST_TYPE_POLL && topics.length < 1) {
      substringNumber = substringWithPoll;
    }

    if (item.post_type === POST_TYPE_POLL && topics.length > 1) {
      substringNumber = substringWithPollTopic;
    }

    const handleStyleFont = () => {
      const defaultStyle = [
        styles.textMedia,
        {
          fontSize,
          lineHeight
        }
      ];
      return defaultStyle;
    };
    return (
      <View testID="postTypePoll" style={[styles.containerText, handleContainerText()]}>
        <Text numberOfLines={defaultNumberLine} style={handleStyleFont()}>
          {getCaptionWithTopicStyle(
            route?.params?.id,
            message,
            navigation,
            substringNumber,
            item?.topics,
            item
          )}{' '}
          {message.length > substringPostImage ? (
            <Text style={{color: '#2F80ED'}}>More...</Text>
          ) : null}
        </Text>
      </View>
    );
  };

  const handleContainerText = () => {
    if (
      message?.length < 125 &&
      item.post_type !== POST_TYPE_POLL &&
      item.post_type !== POST_TYPE_LINK &&
      images_url.length <= 0
    ) {
      return styles.centerVertical;
    }
    return {};
  };

  return (
    <Pressable onPress={onPress} style={[styles.contentFeed, style]}>
      {message?.length > 0 ? (
        <View>
          <View style={[styles.containerMainText, handleContainerText()]}>
            {renderHandleTextContent()}
          </View>
        </View>
      ) : null}

      {item && item.post_type === POST_TYPE_POLL ? (
        <View style={styles.containerMainText}>
          <ContentPoll
            message={item.message}
            images_url={item.images_url}
            polls={item.pollOptions}
            // onPress={() => onPress(item, index)}
            item={item}
            pollexpiredat={item.polls_expired_at}
            multiplechoice={item.multiplechoice}
            isAlreadyPolling={item.isalreadypolling}
            onnewpollfetched={onNewPollFetched}
            voteCount={item.voteCount}
            topics={item?.topics}
          />
        </View>
      ) : null}
      {images_url.length > 0 && (
        <View style={styles.containerImage}>
          <ImageLayouter images={images_url} onimageclick={onImageClickedByIndex} />
        </View>
      )}

      <TopicsChip topics={topics} fontSize={normalizeFontSize(14)} text={message} />
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

export const styles = StyleSheet.create({
  containerImage: {
    flex: 1
  },
  imageList: {
    flex: 1,
    width: screenWidth - 32,
    borderRadius: 16
  },
  textMedia: {
    fontFamily: fonts.inter[400],
    fontWeight: 'normal',
    fontSize: normalizeFontSize(14),
    color: colors.black,
    lineHeight: 24,
    flex: 1,
    flexWrap: 'wrap'
  },

  seemore: {
    color: COLORS.blue
  },
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerFeedProfile: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 13
  },

  feedUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: normalizeFontSize(14),
    color: colors.black
  },
  containerFeedText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  feedDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.black,
    lineHeight: 18
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8
  },
  contentFeed: {
    flex: 1,
    marginTop: 0
    // backgroundColor: 'red'
  },
  item: {
    width: screenWidth - 20,
    height: screenWidth - 20,
    marginTop: 10,
    marginLeft: -20,
    backgroundColor: 'pink'
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    aspectRatio: 1.5,
    resizeMode: 'cover'
  },
  imageAnonimity: {
    marginRight: 8,
    width: 32,
    height: 32
  },
  textContainer: {},
  containerMainText: {
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  containerText: {
    flexDirection: 'row'
  },
  centerVertical: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }
});
