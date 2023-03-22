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
import {fonts} from '../../utils/fonts';
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
  topics = []
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
        <Text style={styles.message} numberOfLines={3}>
          {hashtagAtComponent(sanitizeUrl)}
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
            item
          })}
        </>
      </TouchableNativeFeedback>
      <TopicsChip topics={topics} fontSize={FONT_SIZE_TEXT} text={sanitizeUrl} />
    </View>
  );
};

export default ContentLink;

const styles = StyleSheet.create({
  contentFeed: {
    flex: 1,
    marginTop: SIZES.base,
    marginHorizontal: 6,
    backgroundColor: COLORS.white
    // maxHeight: dimen.size.FEED_CONTENT_LINK_MAX_HEIGHT,
  },
  messageContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 7
    // backgroundColor: 'red'
  },
  message: {
    fontFamily: fonts.inter[400],
    lineHeight: 24,
    fontSize: FONT_SIZE_TEXT,
    letterSpacing: 0.1
  }
});
