import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import Card from '../../components/Card/Card';
import TopicsChip from '../../components/TopicsChip/TopicsChip';
import {COLORS} from '../../utils/theme';
import {fonts, normalizeFontSize, normalizeFontSizeByWidth} from '../../utils/fonts';
import {smartRender} from '../../utils/Utils';
import useContentFeed from './hooks/useContentFeed';
import useCalculationContentLink from './hooks/useCalculatiuonContentLink';

const FONT_SIZE_TEXT = 16;

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
  isPostDetail,
  contentHeight
}) => {
  const route = useRoute();
  const isTouchableDisabled = route?.name === 'PostDetailPage';
  const navigation = useNavigation();
  const sanitizeUrl = message.replace(/(https?:\/\/)?([^.\s]+)?[^.\s]+\.[^\s]+/gi, '').trim();
  const {hashtagAtComponent} = useContentFeed({navigation});

  const {textHeight, heightTopic, handleTextHeight, handleTopicLayout} =
    useCalculationContentLink();
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

  return (
    <View style={styles.contentFeed}>
      <TouchableNativeFeedback
        disabled={isTouchableDisabled}
        onPress={onPress}
        testID="contentLinkContentPressable">
        <>
          <TouchableWithoutFeedback onPress={onPress}>
            {renderMessageContentLink()}
          </TouchableWithoutFeedback>
          {smartRender(Card, {
            domain: og.domain,
            date: new Date(og.date).toLocaleDateString(),
            domainImage: og.domainImage,
            title: og.title,
            description: og.description,
            image: og.image,
            url: og.url,
            onHeaderPress,
            onCardContentPress,
            score,
            item,
            heightTopic,
            textHeight,
            contentHeight
          })}
        </>
      </TouchableNativeFeedback>
      <TopicsChip
        onLayout={handleTopicLayout}
        topics={topics}
        fontSize={normalizeFontSize(14)}
        text={sanitizeUrl}
        // topicContainer={styles.topicStyle}
      />
    </View>
  );
};

export default ContentLink;

const styles = StyleSheet.create({
  contentFeed: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: COLORS.white
  },
  messageContainer: {
    paddingHorizontal: 20,
    marginVertical: 6
  },
  message: {
    fontFamily: fonts.inter[400],
    lineHeight: 24,
    fontSize: normalizeFontSizeByWidth(16),
    letterSpacing: 0.1
  },
  topicStyle: {
    position: 'relative'
  }
});
