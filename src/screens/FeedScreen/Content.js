/* eslint-disable no-plusplus */
import * as React from 'react';
/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import {Dimensions, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import {useNavigation, useRoute} from '@react-navigation/native';

import ContentPoll from './ContentPoll';
import ImageLayouter from './elements/ImageLayouter';
import BlurredLayer from './elements/BlurredLayer';
import TopicsChip from '../../components/TopicsChip/TopicsChip';
import {COLORS} from '../../utils/theme';
import {
  DISCOVERY_TAB_USERS,
  POST_TYPE_LINK,
  POST_TYPE_POLL,
  POST_TYPE_STANDARD
} from '../../utils/constants';
import {fonts, normalizeFontSizeByWidth} from '../../utils/fonts';
import {getCaptionWithTopicStyle} from '../../utils/string/StringUtils';
import useCalculationContent from './hooks/useCalculationContent';
import {getCommentLength} from '../../utils/getstream';

const {width: screenWidth} = Dimensions.get('window');
const BUFFER_CONTENT_TEXT_HEIGHT = 50;
const Content = ({
  message,
  images_url = [],
  style,
  onPress,
  topics = [],
  item,
  onNewPollFetched,
  setHaveSeeMore
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [layoutHeight, setLayoutHeight] = React.useState(null);
  const [textHeight, setTextHeight] = React.useState(null);
  const maxFontSize = normalizeFontSizeByWidth(28);
  const minFontSize = normalizeFontSizeByWidth(16);
  const {
    handleCalculation,
    onLayoutTopicChip,
    heightTopic,
    amountLineTopic,
    heightPoll,
    handleMarginVertical,
    onPollLayout
  } = useCalculationContent();
  const [amountCut, setAmountCut] = React.useState(0);
  const [textCut, setTextCut] = React.useState(null);
  const [arrText] = React.useState([]);
  const isIos = Platform.OS === 'ios';

  React.useEffect(() => {
    if (setHaveSeeMore && typeof setHaveSeeMore === 'function') {
      const haveSeeMoreText = amountCut < message.length;
      setHaveSeeMore(haveSeeMoreText);
    }
  }, [amountCut]);
  const {lineHeight, font} = handleCalculation(
    layoutHeight,
    textHeight,
    maxFontSize,
    minFontSize,
    item.post_type,
    item.images_url,
    message
  );
  const calculateMaxLine = () => {
    if (item.post_type === POST_TYPE_LINK || images_url.length > 0) {
      return 5;
    }
    if (item.post_type === POST_TYPE_POLL) {
      const result = Math.round((layoutHeight - heightPoll - heightTopic) / lineHeight);

      return result >= 0 ? result : 0;
    }
    if (getCommentLength(item.latest_reactions.comment) > 0) {
      return Math.floor(layoutHeight / lineHeight);
    }
    return Math.round(layoutHeight / lineHeight);
  };

  const handleStyleFont = () => {
    const defaultStyle = [
      styles.textMedia,
      {
        fontSize: font,
        lineHeight
      }
    ];
    return defaultStyle;
  };

  const handleTextLine = ({nativeEvent}) => {
    if (!textHeight || textHeight <= 0) {
      setTextHeight(nativeEvent.layout.height);
    }
  };

  const handleCountDeviceLine = () => {
    let newMaxLine = calculateMaxLine();
    const countDeviceLine = newMaxLine;
    if (!isIos) {
      newMaxLine -= 1;
    }
    return {
      countDeviceLine,
      newMaxLine
    };
  };

  const handleTopicLength = () => {
    const topicLine = amountLineTopic + 0;
    const countTopicLine = amountLineTopic + 1;
    return {
      topicLine,
      countTopicLine
    };
  };
  const handleNoTopicLength = () => {
    const newMaxLine = isIos ? 1 : 0;
    const countDeviceLine = isIos ? 2 : 1;
    return {
      newMaxLine,
      countDeviceLine
    };
  };

  const handleMarginTopic = () => {
    if (images_url.length <= 0 && item?.post_type === POST_TYPE_STANDARD) {
      return heightTopic;
    }
    return 12;
  };

  const adjustmentCountDeviceLine = () => {
    let {newMaxLine, countDeviceLine} = handleCountDeviceLine();
    if (
      (item.post_type === POST_TYPE_STANDARD || item.post_type === POST_TYPE_POLL) &&
      item.images_url.length <= 0
    ) {
      if (topics.length > 0) {
        newMaxLine -= handleTopicLength().topicLine;
        countDeviceLine -= handleTopicLength().countTopicLine;
      } else {
        newMaxLine -= handleNoTopicLength().newMaxLine;
        countDeviceLine -= handleNoTopicLength().countDeviceLine;
      }
    } else {
      countDeviceLine -= 2;
    }
    return {
      countDeviceLine,
      newMaxLine
    };
  };
  const handleTextLayout = ({nativeEvent}) => {
    let text = '';
    const {newMaxLine, countDeviceLine} = adjustmentCountDeviceLine();
    for (let i = 0; i < newMaxLine; i += 1) {
      if (nativeEvent.lines[i]) {
        if (i < countDeviceLine) {
          text += nativeEvent.lines[i].text;
          arrText.push(nativeEvent.lines[i].text);
        } else if (i === countDeviceLine) {
          text += nativeEvent.lines[i].text.substring(0, 28);
          arrText.push(nativeEvent.lines[i].text.substring(0, 28));
        }
      }
    }
    setTextCut(text);
    setAmountCut(text.length);
  };
  const showSeeMore = amountCut < message.length;

  const renderHandleTextContent = () => {
    return (
      <View
        testID="postTypePoll"
        style={[
          styles.containerText,
          {marginBottom: handleMarginTopic()},
          {backgroundColor: COLORS.transparent}
        ]}>
        {amountCut <= 0 ? (
          <Text
            onTextLayout={handleTextLayout}
            numberOfLines={calculateMaxLine()}
            onLayout={handleTextLine}
            style={[handleStyleFont(), handleContainerText().text]}>
            {message}
          </Text>
        ) : (
          <>
            <Text
              numberOfLines={calculateMaxLine()}
              style={[handleStyleFont(), handleContainerText().text]}>
              {getCaptionWithTopicStyle(
                route?.params?.id,
                textCut,
                navigation,
                null,
                item?.topics,
                item,
                handleContainerText().isShort
              )}

              {showSeeMore ? <Text style={styles.seemore}> More..</Text> : null}
            </Text>
          </>
        )}
      </View>
    );
  };

  const handleContainerText = () => {
    if (!showSeeMore && item.post_type === POST_TYPE_STANDARD && images_url.length <= 0) {
      return {
        container: styles.centerVertical(item?.bg),
        text: styles.centerVerticalText(item?.color),
        isShort: true
      };
    }
    return {
      container: styles.mv5,
      text: {},
      isShort: false
    };
  };
  const handleHeightContainer = ({nativeEvent}) => {
    setLayoutHeight(nativeEvent.layout.height + BUFFER_CONTENT_TEXT_HEIGHT);
  };

  const calculateLineTopicChip = (nativeEvent) => {
    onLayoutTopicChip(nativeEvent, lineHeight);
  };

  const handleBlurredContent = () => {
    navigation.navigate('DiscoveryScreen', {
      tab: DISCOVERY_TAB_USERS
    });
  };

  return (
    <Pressable
      onLayout={handleHeightContainer}
      onPress={item?.isBlurredPost ? null : () => onPress()}
      style={[styles.contentFeed, style]}>
      <BlurredLayer
        withToast={true}
        onPressContent={handleBlurredContent}
        isVisible={item?.isBlurredPost}>
        {message?.length > 0 ? (
          <View>
            <View
              style={[
                styles.containerMainText(handleContainerText().isShort),
                handleContainerText().container,
                item?.isBlurredPost
                  ? {
                      minHeight: 442
                    }
                  : {}
              ]}>
              {renderHandleTextContent()}
            </View>
          </View>
        ) : null}

        {item && item.post_type === POST_TYPE_POLL ? (
          <View
            style={[
              styles.containerMainText(handleContainerText().isShort),
              {marginVertical: handleMarginVertical(message)}
            ]}>
            <ContentPoll
              message={item.message}
              images_url={item.images_url}
              polls={item.pollOptions}
              item={item}
              pollexpiredat={item.polls_expired_at}
              multiplechoice={item.multiplechoice}
              isAlreadyPolling={item.isalreadypolling}
              onnewpollfetched={onNewPollFetched}
              voteCount={item.voteCount}
              topics={item?.topics}
              onLayout={onPollLayout}
            />
          </View>
        ) : null}
        {images_url.length > 0 && (
          <View style={[styles.containerImage]}>
            <ImageLayouter
              isFeed={true}
              images={images_url}
              onimageclick={() => onPress(showSeeMore)}
            />
          </View>
        )}
      </BlurredLayer>

      <TopicsChip
        onLayout={calculateLineTopicChip}
        topics={topics}
        fontSize={normalizeFontSizeByWidth(14)}
        text={message}
      />
    </Pressable>
  );
};

Content.propTypes = {
  message: PropTypes.string,
  images_url: PropTypes.array,
  style: PropTypes.object,
  onPress: PropTypes.func,
  topics: PropTypes.arrayOf(PropTypes.string),
  item: PropTypes.object,
  onNewPollFetched: PropTypes.func,
  setHaveSeeMore: PropTypes.func
};

export default Content;

export const styles = StyleSheet.create({
  containerImage: {
    flex: 1
  },
  imageList: {
    flex: 1,
    width: screenWidth - 32,
    borderRadius: 16
  },
  textMedia: {
    fontFamily: fonts.inter[400],
    fontWeight: 'normal',
    fontSize: normalizeFontSizeByWidth(28),
    color: COLORS.black,
    lineHeight: 24,
    flex: 1
  },

  seemore: {
    color: COLORS.blue
  },
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
  feedDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.black,
    lineHeight: 18
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: COLORS.blackgrey,
    marginLeft: 8,
    marginRight: 8
  },
  contentFeed: {
    flex: 1,
    marginTop: 0,
    height: '100%',
    width: '100%'
  },
  item: {
    width: screenWidth - 20,
    height: screenWidth - 20,
    marginTop: 10,
    marginLeft: -20
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
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
  textContainer: {},
  containerMainText: (isShort) => ({
    paddingHorizontal: 16
    // paddingVertical: isShort ? 0 : 10
  }),
  containerText: {
    flexDirection: 'row'
  },
  centerVertical: (bg) => ({
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: `${bg}`
  }),
  centerVerticalText: () => ({
    color: 'black',
    opacity: 1
  }),
  mv5: {
    marginVertical: 6
  }
});
