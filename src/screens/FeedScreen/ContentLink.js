import * as React from 'react';
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import Card from '../../components/Card/Card';
import TopicsChip from '../../components/TopicsChip/TopicsChip';
import dimen from '../../utils/dimen';
import { COLORS, SIZES } from '../../utils/theme';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { smartRender } from '../../utils/Utils';

const FONT_SIZE_TEXT = 16

const ContentLink = ({ item, og, onPress, onHeaderPress, onCardContentPress, score, message = "", messageContainerStyle = {}, topics = [] }) => {
  let route = useRoute();
  let isTouchableDisabled = route?.name === 'PostDetailPage';

  const __renderMessageContentLink = () => {
    let sanitizeUrl = message.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '').trim()
    if (sanitizeUrl?.length === 0) return <></>
    return <View style={{ ...styles.messageContainer, ...messageContainerStyle }}>
      <Text style={styles.message} numberOfLines={3}>{sanitizeUrl}</Text>
      <TopicsChip topics={topics} fontSize={FONT_SIZE_TEXT}/>
    </View>
  }

  return (
    <Pressable
      disabled={isTouchableDisabled}
      onPress={onPress}
      style={styles.contentFeed}>
      <>
        {__renderMessageContentLink()}
        {smartRender(Card, {
          domain: og.domain,
          date: new Date(og.date).toLocaleDateString(),
          domainImage:
            og.domainImage !== ''
              ? og.domainImage
              : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
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
    </Pressable>
  );
};

export default ContentLink;

const styles = StyleSheet.create({
  contentFeed: {
    flex: 1,
    marginTop: SIZES.base,
    marginHorizontal: 6,
    backgroundColor: COLORS.white,
    // maxHeight: dimen.size.FEED_CONTENT_LINK_MAX_HEIGHT,
  },
  messageContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 7,
    // backgroundColor: 'red'
  },
  message: {
    fontFamily: fonts.inter[400],
    lineHeight: 24,
    fontSize: FONT_SIZE_TEXT,
    letterSpacing: 0.1
  }
});
