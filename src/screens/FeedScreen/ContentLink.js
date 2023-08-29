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
import {COLORS, SIZES} from '../../utils/theme';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {smartRender} from '../../utils/Utils';
import useContentFeed from './hooks/useContentFeed';

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
  isPostDetail
}) => {
  const route = useRoute();
  const isTouchableDisabled = route?.name === 'PostDetailPage';
  const navigation = useNavigation();

  const sanitizeUrl = message.replace(/(https?:\/\/)?([^.\s]+)?[^.\s]+\.[^\s]+/gi, '').trim();
  const {hashtagAtComponent} = useContentFeed({navigation});
  const renderMessageContentLink = () => {
    if (sanitizeUrl?.length === 0) return <></>;
    return (
      <View style={{...styles.messageContainer, ...messageContainerStyle}}>
        <Text style={styles.message}>
          {!isPostDetail ? hashtagAtComponent(sanitizeUrl, 100) : hashtagAtComponent(sanitizeUrl)}
          {!isPostDetail && message.length > 100 && (
            <Text style={{color: '#2F80ED'}}> More...</Text>
          )}
          {/* {hashtagAtComponent(sanitizeUrl)} */}
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
          <View style={{flex: 1}}>
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
              item
            })}
          </View>
        </>
      </TouchableNativeFeedback>
      <TopicsChip topics={topics} fontSize={normalizeFontSize(14)} text={sanitizeUrl} />
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
    marginVertical: 5
  },
  message: {
    fontFamily: fonts.inter[400],
    lineHeight: 24,
    fontSize: FONT_SIZE_TEXT,
    letterSpacing: 0.1
  }
});
