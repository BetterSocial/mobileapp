import * as React from 'react';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import Card from '../../Card/Card';
import TopicsChip from '../../TopicsChip/TopicsChip';
import {COLORS} from '../../../utils/theme';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {smartRender} from '../../../utils/Utils';
import useContentFeed from '../../../screens/FeedScreen/hooks/useContentFeed';

const FONT_SIZE_TEXT = 14;

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

  const sanitizeUrl = message.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').trim();
  const {hashtagAtComponent} = useContentFeed({navigation});
  const renderMessageContentLink = () => {
    if (sanitizeUrl?.length === 0) return <></>;
    return (
      <View style={{...styles.messageContainer, ...messageContainerStyle}}>
        <Text style={styles.message}>
          {!isPostDetail ? hashtagAtComponent(sanitizeUrl, 50) : hashtagAtComponent(sanitizeUrl)}
          {!isPostDetail && message.length > 50 && <Text style={{color: '#2F80ED'}}> More...</Text>}
          {/* {hashtagAtComponent(sanitizeUrl)} */}
        </Text>
      </View>
    );
  };

  return (
    <>
      <ScrollView
        style={styles.contentFeed}
        contentContainerStyle={{flexGrow: 1, paddingBottom: 100}}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}>
        <TouchableNativeFeedback
          disabled={isTouchableDisabled}
          onPress={onPress}
          testID="contentLinkContentPressable">
          <>
            <TouchableWithoutFeedback onPress={onPress}>
              {renderMessageContentLink()}
            </TouchableWithoutFeedback>
            <View style={{flex: 1, marginTop: 10}}>
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
      </ScrollView>
    </>
  );
};

export default ContentLink;

const styles = StyleSheet.create({
  contentFeed: {
    flex: 1,
    // marginTop: SIZES.base,
    marginHorizontal: 6,
    backgroundColor: COLORS.white
    // maxHeight: dimen.size.FEED_CONTENT_LINK_MAX_HEIGHT,
  },
  messageContainer: {
    paddingHorizontal: 20
    // paddingBottom: 15,
    // paddingTop: 7
    // backgroundColor: 'red'
  },
  message: {
    fontFamily: fonts.inter[400],
    lineHeight: 24,
    fontSize: FONT_SIZE_TEXT,
    letterSpacing: 0.1
  }
});
