import * as React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import FastImage from 'react-native-fast-image';
import BlurredLayer from './elements/BlurredLayer';
import Card from '../../components/Card/Card';
import TopicsChip from '../../components/TopicsChip/TopicsChip';
import dimen from '../../utils/dimen';
import useCalculationContentLink from './hooks/useCalculatiuonContentLink';
import useContentFeed from './hooks/useContentFeed';
import {COLORS} from '../../utils/theme';
import {DISCOVERY_TAB_USERS} from '../../utils/constants';
import {fonts, normalize, normalizeFontSize, normalizeFontSizeByWidth} from '../../utils/fonts';
import {smartRender} from '../../utils/Utils';
import ImageLayouter from './elements/ImageLayouter';

const ContentLink = ({
  item,
  og,
  onPress,
  onHeaderPress,
  onCardContentPress,
  score,
  message = '',
  messageContainerStyle = {},
  topics = [],
  isPostDetail
}) => {
  const route = useRoute();
  const isTouchableDisabled = route?.name === 'PostDetailPage';
  const navigation = useNavigation();
  const sanitizeUrl = message.replace(/(https?:\/\/)?([^.\s]+)?[^.\s]+\.[^\s]+/gi, '').trim();
  const {hashtagAtComponent} = useContentFeed({navigation});

  const {textHeight, handleTextHeight, handleTopicLayout} = useCalculationContentLink();

  const renderMessageContentLink = () => {
    if (sanitizeUrl?.length === 0) return <></>;
    return (
      <View
        testID="urlComponent"
        onLayout={handleTextHeight}
        style={{...styles.messageContainer, ...messageContainerStyle}}>
        <Text style={styles.message}>
          {!isPostDetail ? hashtagAtComponent(sanitizeUrl, 100) : hashtagAtComponent(sanitizeUrl)}
          {!isPostDetail && message.length > 100 && (
            <Text style={{color: COLORS.blue}}> More...</Text>
          )}
        </Text>
      </View>
    );
  };

  const isBlurredPost = item?.isBlurredPost;

  const handleBlurredContent = () => {
    navigation.navigate('DiscoveryScreen', {
      tab: DISCOVERY_TAB_USERS
    });
  };

  const momentDate = moment(og?.content_published_at || og?.date);
  const date = momentDate.format('MMM DD, YYYY');

  return (
    <BlurredLayer withToast={true} onPressContent={handleBlurredContent} isVisible={isBlurredPost}>
      <View style={styles.contentFeed}>
        <TouchableNativeFeedback
          disabled={isTouchableDisabled}
          onPress={onPress}
          testID="contentLinkContentPressable">
          <>
            <TouchableWithoutFeedback onPress={onPress}>
              {renderMessageContentLink()}
            </TouchableWithoutFeedback>
            {item && item?.images_url?.length > 0 ? (
              <View style={[styles.containerImage(isBlurredPost)]}>
                <ImageLayouter
                  mode={FastImage.resizeMode.cover}
                  isFeed={true}
                  images={item?.images_url}
                  onimageclick={() => onPress(item)}
                />
              </View>
            ) : (
              smartRender(Card, {
                domain: og.domain,
                date,
                domainImage: og.domainImage,
                title: og.title,
                description: og.description,
                image: og.image,
                url: og.url,
                onHeaderPress,
                onCardContentPress,
                score,
                item,
                heightTopic: normalize(60),
                textHeight,
                contentHeight: dimen.size.FEED_CONTENT_HEIGHT,
                containerStyle: {flex: topics.length > 0 ? 0 : 1}
              })
            )}
          </>
        </TouchableNativeFeedback>
        {!isBlurredPost && (
          <TopicsChip
            onLayout={handleTopicLayout}
            topics={topics}
            fontSize={normalizeFontSize(14)}
            text={sanitizeUrl}
            topicContainer={styles.topicStyle(item?.images_url?.length > 0)}
            topicItemStyle={styles.topicItemStyle}
          />
        )}
      </View>
    </BlurredLayer>
  );
};

ContentLink.propTypes = {
  item: PropTypes.object,
  og: PropTypes.object,
  onPress: PropTypes.func,
  onHeaderPress: PropTypes.func,
  onCardContentPress: PropTypes.func,
  score: PropTypes.number,
  message: PropTypes.string,
  messageContainerStyle: PropTypes.object,
  topics: PropTypes.array,
  isPostDetail: PropTypes.bool
};

export default ContentLink;

const styles = StyleSheet.create({
  contentFeed: {
    height: dimen.size.FEED_CONTENT_HEIGHT,
    paddingHorizontal: 6,
    backgroundColor: COLORS.almostBlack,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.darkGray
  },
  messageContainer: {
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 12
  },
  message: {
    fontFamily: fonts.inter[400],
    lineHeight: 24,
    fontSize: normalizeFontSizeByWidth(16),
    letterSpacing: 0.1,
    color: COLORS.white
  },
  topicStyle: (hasImage) => ({
    position: hasImage ? 'absolute' : 'relative',
    marginLeft: hasImage ? 12 : 0,
    bottom: hasImage ? 4 : 0
  }),
  topicItemStyle: {
    marginBottom: 0
  },
  containerImage: (isBlurred) => ({
    flex: 1,
    height: isBlurred ? dimen.normalizeDimen(422) : 100
  })
});
