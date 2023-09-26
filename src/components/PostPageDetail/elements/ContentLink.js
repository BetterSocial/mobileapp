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
import usePostDetail from '../hooks/usePostDetail';

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

  const sanitizeUrl = message.replace(/(https?:\/\/)?([^.\s]+)?[^.\s]+\.[^\s]+/gi, '').trim();
  const {hashtagAtComponent} = useContentFeed({navigation});
  const {calculationText} = usePostDetail();
  const renderMessageContentLink = () => {
    if (sanitizeUrl?.length === 0) return <></>;
    return (
      <View
        style={{
          ...styles.messageContainer,
          ...messageContainerStyle,
          paddingLeft: isPostDetail ? 12 : 0,
          height: calculationText(item.message, item.post_type).containerHeight
        }}>
        {!isPostDetail ? (
          <Text tyle={[styles.message]}>
            {hashtagAtComponent(sanitizeUrl, 50)}{' '}
            {message.length > 50 && <Text style={{color: COLORS.blue}}> More...</Text>}{' '}
          </Text>
        ) : (
          <Text
            style={[
              styles.message,
              {
                fontSize: calculationText(sanitizeUrl).fontSize,
                lineHeight: calculationText(sanitizeUrl).lineHeight
              }
            ]}>
            {hashtagAtComponent(sanitizeUrl)}
          </Text>
        )}
      </View>
    );
  };

  return (
    <>
      <ScrollView
        style={[styles.contentFeed]}
        contentContainerStyle={{flexGrow: 1}}
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
    marginHorizontal: 6,
    backgroundColor: COLORS.white,
    paddingTop: 5,
    height: 300
  },
  message: {
    fontFamily: fonts.inter[400],
    lineHeight: 24,
    fontSize: FONT_SIZE_TEXT,
    letterSpacing: 0.1
  }
});
