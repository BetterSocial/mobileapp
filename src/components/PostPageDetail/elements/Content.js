import * as React from 'react';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';
import Card from '../../Card/Card';
import ContentPoll from '../../../screens/FeedScreen/ContentPoll';
import ImageLayouter from '../../../screens/FeedScreen/elements/ImageLayouter';
import TopicsChip from '../../TopicsChip/TopicsChip';
import dimen from '../../../utils/dimen';
import useContentFeed from '../../../screens/FeedScreen/hooks/useContentFeed';
import {COLORS, hexToRgb} from '../../../utils/theme';
import {POST_TYPE_LINK, POST_TYPE_POLL, POST_TYPE_STANDARD} from '../../../utils/constants';
import {fonts, normalizeFontSize, normalizeFontSizeByWidth} from '../../../utils/fonts';
import {linkContextScreenParamBuilder} from '../../../utils/navigation/paramBuilder';
import {sanitizeUrl} from '../../../utils/string/StringUtils';
import {smartRender} from '../../../utils/Utils';
import useCalculationContent from '../../../screens/FeedScreen/hooks/useCalculationContent';
import {listFeedColor} from '../../../configs/FeedColor';

const Content = ({
  message,
  images_url,
  topics = [],
  item,
  onnewpollfetched,
  isPostDetail,
  haveSeeMore,
  parentData
}) => {
  const navigation = useNavigation();
  const cekImage = () => images_url && images_url !== '';
  const {hashtagAtComponent} = useContentFeed({navigation});
  const {handleCalculation} = useCalculationContent();
  const [textHeight, setTextHeight] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(0);
  const maxFontSize = normalizeFontSizeByWidth(28);
  const minFontSize = normalizeFontSizeByWidth(16);
  const [remainingHeight, setRemainingHeight] = React.useState(0);
  const [topicHeight, setTopicHeight] = React.useState(0);
  const {handleMarginVertical} = useCalculationContent();
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
  const {font, lineHeight} = handleCalculation(
    containerHeight,
    textHeight,
    maxFontSize,
    minFontSize,
    item.post_type,
    images_url
  );

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
  React.useEffect(() => {
    if (containerHeight > 0 && textHeight > 0) {
      const remainingHeightNumber = containerHeight - textHeight;
      setRemainingHeight(remainingHeightNumber);
    }
  }, [containerHeight, textHeight]);

  const randomIndex = React.useMemo(() => {
    return Math.floor(Math.random() * listFeedColor.length);
  }, []);

  const isShortText = () => {
    return images_url.length <= 0 && item.post_type === POST_TYPE_STANDARD && !haveSeeMore;
  };
  const handleContainerPdp = () => {
    if (isShortText()) {
      const backgroundData = (() => {
        if (parentData?.bg) {
          return parentData.bg;
        }
        if (item.anon_user_info_color_code) {
          return hexToRgb(item.anon_user_info_color_code, 0.25);
        }
        const newColor = listFeedColor[randomIndex];
        return hexToRgb(newColor.bg, 0.25);
      })();
      return styles.shortText(backgroundData);
    }
    return {};
  };
  const handleMessageContainerPdp = () => {
    if (isShortText()) {
      return styles.centerVertical;
    }
    return {};
  };

  const handleTextHeight = ({nativeEvent}) => {
    if (!textHeight || textHeight <= 0) {
      setTextHeight(nativeEvent.layout.height);
    }
  };

  const handleContainerHeight = ({nativeEvent}) => {
    if (!containerHeight || containerHeight <= 0) {
      setContainerHeight(nativeEvent.layout.height);
    }
  };

  const handlePaddingBottom = () => {
    const isTextPassTopic = remainingHeight <= lineHeight + font * 2;
    if ((!isTextPassTopic && topics.length > 0) || images_url?.length > 0) {
      return 0;
    }
    return topicHeight;
  };

  const handleTopicChipHeight = (nativeEvent) => {
    setTopicHeight(nativeEvent?.layout?.height);
  };

  if (!cekImage) return null;
  return (
    <>
      <ScrollView
        style={[styles.contentFeed, handleContainerPdp()]}
        contentContainerStyle={styles.contensStyle(handlePaddingBottom())}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}>
        {isShortText() && (
          <LinearGradient
            colors={['#184A57', '#275D8A']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          />
        )}
        {sanitizeUrl(message)?.length > 0 ? (
          <View
            onLayout={handleContainerHeight}
            style={[
              styles.contentFeed,
              handleContainerPdp(),
              handleMessageContainerPdp(),
              styles.ph4,
              styles.mv5
            ]}>
            <View style={styles.postTextContainer(isPostDetail)}>
              {item.post_type !== POST_TYPE_LINK ? (
                <Text
                  onLayout={handleTextHeight}
                  style={[
                    styles.textContentFeed(isShortText(), parentData?.color),
                    {
                      fontSize: font,
                      lineHeight
                    }
                  ]}>
                  {hashtagAtComponent(message, null, isShortText())}
                </Text>
              ) : (
                <Text
                  style={[
                    styles.textContentFeed(isShortText(), parentData?.color),
                    {
                      fontSize: font,
                      lineHeight
                    }
                  ]}>
                  {hashtagAtComponent(sanitizeUrl(message), null, isShortText())}{' '}
                </Text>
              )}
            </View>
          </View>
        ) : null}

        {item && item.post_type === POST_TYPE_POLL ? (
          <View
            style={[
              styles.pollContainer,
              {marginVertical: handleMarginVertical(sanitizeUrl(message))}
            ]}>
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
          </View>
        ) : null}
        {item && item.post_type === POST_TYPE_LINK && (
          <View
            style={[
              styles.newsCard,
              {
                marginVertical: handleMarginVertical(sanitizeUrl(message))
              }
            ]}>
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
              score: item.credderScore,
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
        <TopicsChip
          onLayout={handleTopicChipHeight}
          isPdp={true}
          topics={topics}
          fontSize={normalizeFontSize(14)}
          text={message}
        />
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
    backgroundColor: COLORS.almostBlack
  },
  textContentFeed: () => ({
    fontFamily: fonts.inter[400],
    fontWeight: 'normal',
    fontSize: normalizeFontSize(14),
    color: COLORS.black,
    flex: 1,
    flexWrap: 'wrap'
  }),

  contentFeedLink: {
    marginTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.almostBlack
  },
  newsCard: {
    paddingHorizontal: 6
  },
  containerImage: {
    flex: 1,
    height: dimen.size.FEED_CONTENT_HEIGHT
  },
  pollContainer: {
    paddingHorizontal: 12
  },
  postTextContainer: (isPostDetail) => ({
    paddingHorizontal: isPostDetail ? 12 : 0
  }),
  shortText: (bg) => ({
    minHeight: normalizeFontSizeByWidth(342),
    backgroundColor: bg
  }),
  centerVertical: {
    justifyContent: 'center',
    backgroundColor: COLORS.transparent
  },
  contensStyle: (paddingBottom) => ({
    paddingBottom,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: COLORS.darkGray
  }),
  ph4: {
    paddingHorizontal: 4
  },
  mv5: {
    marginTop: 6,
    marginBottom: 12
  }
});
