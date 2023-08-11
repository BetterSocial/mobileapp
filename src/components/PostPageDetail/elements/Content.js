import * as React from 'react';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {Dimensions, Platform, StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

import Card from '../../Card/Card';
import ContentPoll from '../../../screens/FeedScreen/ContentPoll';
import ImageLayouter from './ImageLayouter';
import TopicsChip from '../../TopicsChip/TopicsChip';
import dimen from '../../../utils/dimen';
import useContentFeed from '../../../screens/FeedScreen/hooks/useContentFeed';
import usePostDetail from '../hooks/usePostDetail';
import {COLORS} from '../../../utils/theme';
import {POST_TYPE_LINK, POST_TYPE_POLL} from '../../../utils/constants';
import {colors} from '../../../utils/colors';
import {fonts, normalizeFontSize} from '../../../utils/fonts';
import {linkContextScreenParamBuilder} from '../../../utils/navigation/paramBuilder';
import {sanitizeUrl} from '../../../utils/string/StringUtils';
import {smartRender} from '../../../utils/Utils';

const {width: screenWidth} = Dimensions.get('window');
const FONT_SIZE_TEXT = 16;
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

  const handleTopicStyle = () => {
    if (images_url.length > 0) {
      return styles.topicContainerWithImage;
    }
    return styles.topicContainerNoImage;
  };

  if (!cekImage) return null;
  return (
    <>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        style={styles.contentFeed}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}>
        <View
          style={[
            handleStyleFeed(),
            {
              minHeight: calculationText(hashtagAtComponent(sanitizeUrl(message))).containerHeight
            }
          ]}>
          <View style={styles.postTextContainer(isPostDetail)}>
            {item.post_type !== POST_TYPE_LINK ? (
              <Text
                style={[
                  styles.textContentFeed,
                  {
                    fontSize: calculationText(message).fontSize,
                    lineHeight: calculationText(message).lineHeight
                  }
                ]}>
                {hashtagAtComponent(message)}
              </Text>
            ) : (
              <Text
                style={[
                  styles.textContentFeed,
                  {
                    fontSize: calculationText(sanitizeUrl(message)).fontSize,
                    lineHeight: calculationText(sanitizeUrl(message)).lineHeight
                  }
                ]}>
                {hashtagAtComponent(sanitizeUrl(message))}{' '}
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
        <View style={handleTopicStyle()}>
          <TopicsChip
            isPdp={true}
            topics={topics}
            fontSize={normalizeFontSize(14)}
            text={message}
          />
        </View>
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
  container: {
    flex: 1,
    paddingBottom: 16
  },
  fletlist: {flex: 1},
  imageList: {
    flex: 1,
    width: screenWidth - 32,
    borderRadius: 16
  },
  containerShowMessage: (currentRouteName) => ({
    justifyContent: 'center',
    alignItems: currentRouteName === 'Feed' ? 'center' : 'center',
    flex: 1,
    paddingBottom: 10,
    minHeight: 100
  }),
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
    fontSize: 14,
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
    backgroundColor: COLORS.white,
    paddingTop: 5
  },
  topicContainerWithImage: {
    position: 'absolute',
    bottom: 0
  },
  topicContainerNoImage: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-end'
  },
  textContentFeed: {
    fontFamily: fonts.inter[400],
    fontWeight: 'normal',
    fontSize: normalizeFontSize(14),
    color: colors.black,
    flex: 1,
    flexWrap: 'wrap'
  },
  textComment: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    lineHeight: 18,
    color: colors.gray
  },
  usernameComment: {
    fontFamily: fonts.inter[500],
    fontWeight: '900',
    fontSize: normalizeFontSize(12),
    lineHeight: 24,
    color: colors.black
  },
  usernameTextComment: {
    fontFamily: fonts.inter[500],
    fontSize: normalizeFontSize(12),
    lineHeight: 24,
    color: colors.gray
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
  contentFeedLink: {
    // flex: 1,
    marginTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.white
  },
  newsCard: {
    paddingHorizontal: 20
    // height: '80%',
  },
  message: {
    fontFamily: fonts.inter[400],
    lineHeight: 24,
    fontSize: FONT_SIZE_TEXT,
    letterSpacing: 0.1
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
  })
});
