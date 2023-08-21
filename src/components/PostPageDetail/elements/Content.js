import * as React from 'react';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

import Card from '../../Card/Card';
import ContentPoll from '../../../screens/FeedScreen/ContentPoll';
import ImageLayouter from '../../../screens/FeedScreen/elements/ImageLayouter';
import TopicsChip from '../../TopicsChip/TopicsChip';
import dimen from '../../../utils/dimen';
import useContentFeed from '../../../screens/FeedScreen/hooks/useContentFeed';
import usePostDetail from '../hooks/usePostDetail';
import {COLORS} from '../../../utils/theme';
import {POST_TYPE_LINK, POST_TYPE_POLL, POST_TYPE_STANDARD} from '../../../utils/constants';
import {colors} from '../../../utils/colors';
import {fonts, normalizeFontSize, normalizeFontSizeByWidth} from '../../../utils/fonts';
import {linkContextScreenParamBuilder} from '../../../utils/navigation/paramBuilder';
import {sanitizeUrl} from '../../../utils/string/StringUtils';
import {smartRender} from '../../../utils/Utils';

const Content = ({message, images_url, topics = [], item, onnewpollfetched, isPostDetail}) => {
  const navigation = useNavigation();
  const cekImage = () => images_url && images_url !== '';
  const {hashtagAtComponent} = useContentFeed({navigation});
  const {calculationText} = usePostDetail();
  const onImageClickedByIndex = (index) => {
    navigation.push('ImageViewer', {
      title: 'Photo',
      index,
      images: images_url?.reduce((acc, current) => {
        acc.push({url: current});
        return acc;
      }, [])
    });
  };

  const handleStyleFeed = () => {
    if (item.post_type !== POST_TYPE_LINK) {
      return styles.contentFeed;
    }
    return styles.contentFeedLink;
  };
  const navigateToLinkContextPage = () => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id
    );
    navigation.push('LinkContextScreen', param);
  };
  const onPressDomain = () => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id
    );

    navigation.navigate('DomainScreen', param);
  };

  const isShortText = () => {
    return images_url.length <= 0 && item.post_type === POST_TYPE_STANDARD && message.length <= 125;
  };

  const handleContainerPdp = () => {
    if (isShortText()) {
      return styles.shortText;
    }
    return {};
  };

  const handleMessageContainerPdp = () => {
    if (isShortText()) {
      return styles.centerVertical;
    }
    return {};
  };

  if (!cekImage) return null;

  return (
    <>
      <ScrollView
        style={[styles.contentFeed, handleContainerPdp()]}
        contentContainerStyle={styles.contensStyle(images_url.length > 0, isShortText())}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}>
        <View
          style={[
            handleStyleFeed(),
            {
              minHeight: calculationText(hashtagAtComponent(sanitizeUrl(message))).containerHeight
            },
            handleContainerPdp(),
            handleMessageContainerPdp()
          ]}>
          <View style={styles.postTextContainer(isPostDetail)}>
            {item.post_type !== POST_TYPE_LINK ? (
              <Text
                style={[
                  styles.textContentFeed(isShortText()),
                  {
                    fontSize: calculationText(message).fontSize,
                    lineHeight: calculationText(message).lineHeight
                  }
                ]}>
                {hashtagAtComponent(message, null, isShortText())}
              </Text>
            ) : (
              <Text
                style={[
                  styles.textContentFeed(isShortText()),
                  {
                    fontSize: calculationText(sanitizeUrl(message)).fontSize,
                    lineHeight: calculationText(sanitizeUrl(message)).lineHeight
                  }
                ]}>
                {hashtagAtComponent(sanitizeUrl(message), null, isShortText())}{' '}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.pollContainer}>
          {item && item.post_type === POST_TYPE_POLL ? (
            <View
              style={{
                flex: 1,
                justifyContent: isPostDetail ? 'flex-end' : 'flex-start',
                marginBottom: 0
              }}>
              <ContentPoll
                message={item.message}
                images_url={item.images_url}
                polls={item.pollOptions}
                item={item}
                pollexpiredat={item.polls_expired_at}
                multiplechoice={item.multiplechoice}
                isAlreadyPolling={item.isalreadypolling}
                onnewpollfetched={onnewpollfetched}
                voteCount={item.voteCount}
                topics={item?.topics}
                isPostDetail={isPostDetail}
              />
            </View>
          ) : null}
        </View>
        {item && item.post_type === POST_TYPE_LINK && (
          <View style={styles.newsCard}>
            {smartRender(Card, {
              domain: item.og.domain,
              date: new Date(item.og.date).toLocaleDateString(),
              domainImage: item.og.domainImage,
              title: item.og.title,
              description: item.og.description,
              image: item.og.image,
              url: item.og.url,
              onHeaderPress: onPressDomain,
              onCardContentPress: navigateToLinkContextPage,
              score: item.score,
              item
            })}
          </View>
        )}
        {images_url?.length > 0 && (
          <View style={styles.containerImage}>
            <ImageLayouter
              mode={FastImage.resizeMode.cover}
              images={images_url || []}
              onimageclick={onImageClickedByIndex}
            />
          </View>
        )}
        <TopicsChip isPdp={true} topics={topics} fontSize={normalizeFontSize(14)} text={message} />
      </ScrollView>
    </>
  );
};

Content.propTypes = {
  message: PropTypes.string,
  images_url: PropTypes.array,
  style: PropTypes.object,
  onPress: PropTypes.func
};

export default Content;

const styles = StyleSheet.create({
  contentFeed: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 5
  },
  textContentFeed: (isShort) => ({
    fontFamily: fonts.inter[400],
    fontWeight: 'normal',
    fontSize: normalizeFontSize(14),
    color: isShort ? colors.white : colors.black,
    flex: 1,
    flexWrap: 'wrap'
  }),

  contentFeedLink: {
    marginTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.white
  },
  newsCard: {
    paddingHorizontal: 20
  },
  containerImage: {
    flex: 1,
    height: dimen.normalizeDimen(300)
  },
  pollContainer: {
    paddingHorizontal: 12
  },
  postTextContainer: (isPostDetail) => ({
    paddingHorizontal: isPostDetail ? 12 : 0
  }),
  shortText: {
    minHeight: normalizeFontSizeByWidth(342),
    backgroundColor: '#11468F'
  },
  centerVertical: {
    justifyContent: 'center'
  },
  contensStyle: (containImage, isShortText) => ({
    paddingBottom: containImage || isShortText ? 0 : 40
  })
});
