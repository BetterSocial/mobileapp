import * as React from 'react';
/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import {Dimensions, Platform, Pressable, StyleSheet, Text, View} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import {useNavigation, useRoute} from '@react-navigation/native';

import ContentPoll from './ContentPoll';
import ImageLayouter from './elements/ImageLayouter';
import TopicsChip from '../../components/TopicsChip/TopicsChip';
import {COLORS} from '../../utils/theme';
import {POST_TYPE_LINK, POST_TYPE_POLL} from '../../utils/constants';
import {colors} from '../../utils/colors';
import {fonts, normalizeFontSize, normalizeFontSizeByWidth} from '../../utils/fonts';
import {getCaptionWithTopicStyle} from '../../utils/string/StringUtils';
import useCalculationContent from './hooks/useCalculationContent';

const {width: screenWidth, height} = Dimensions.get('window');

const Content = ({
  message,
  images_url = [],
  style,
  onPress,
  topics = [],
  item,
  onNewPollFetched
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [layoutHeight, setLayoutHeight] = React.useState(null);
  const [textHeight, setTextHeight] = React.useState(null);
  const maxFontSize = normalizeFontSizeByWidth(40);
  const minFontSize = normalizeFontSizeByWidth(18);
  const {handleCalculation} = useCalculationContent();
  const [amountCut, setAmountCut] = React.useState(0);
  const [newMessage, setNewMessage] = React.useState(null);
  // const [textWidth, setTextWidth] = React.useState(null);
  const [numberLine, setNumberLine] = React.useState(0);
  const onImageClickedByIndex = (index) => {
    navigation.push('ImageViewer', {
      title: 'Photo',
      index,
      images: images_url.reduce((acc, current) => {
        acc.push({url: current});
        return acc;
      }, [])
    });
  };
  const [hasMoreText, setHasMoreText] = React.useState(false);
  const renderHandleTextContent = () => {
    const {lineHeight, font, readMore} = handleCalculation(
      layoutHeight,
      textHeight,
      maxFontSize,
      minFontSize,
      item.post_type,
      item.images_url,
      message
    );
    const maxLine = Math.ceil(layoutHeight / lineHeight);

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
      console.log(nativeEvent, 'babu');
      // if (!textWidth || textWidth <= 0) {
      //   setTextWidth(nativeEvent.layout.width);
      // }
    };

    // React.useEffect(() => {
    //   if (amountCut) {
    //     console.log({amountCut, numberLine, maxLine}, 'nani');
    //     if (numberLine > maxLine) {
    //       setNewMessage(message.substring(0, amountCut - 50));
    //     }
    //   }
    // }, [amountCut, numberLine]);

    const handleTextLayout = ({nativeEvent}) => {
      setNumberLine(nativeEvent.lines.length);
      let text = '';
      const newMaxLine = maxLine - 3;
      for (let i = 0; i < newMaxLine; i++) {
        if (nativeEvent.lines[i]) {
          text += nativeEvent.lines[i].text;
        }
        // text += nativeEvent.lines[i].text;
      }
      if (text.length > 0 && nativeEvent.lines.length >= newMaxLine) {
        return setAmountCut(text.length - 20);
      }
      return setAmountCut(text.length);

      // if (maxLine > 0) {
      //   for (let i = 0; i <= newMaxLine; i++) {
      //     if (nativeEvent.lines[i]) {
      //       if (i == newMaxLine) {
      //         text2.push(nativeEvent.lines[i].text.substring(0, 30));
      //       } else {
      //         text2.push(nativeEvent.lines[i].text);
      //       }
      //     }
      //   }
      //   text = text2.join(' ');
      //   // setCutText(text);
      //   console.log({hasMoreText, message, newMaxLine, length: nativeEvent.lines.length}, 'sio');

      //   if (newMaxLine < nativeEvent.lines.length) {
      //     setHasMoreText(true);
      //   }
      // }
    };

    // const linePerCharacter = screenWidth / textWidth;
    console.log(
      {maxLine, screenWidth, numberLine, amountCut, message, length: message.length},
      'angkah1'
    );
    return (
      <View testID="postTypePoll" style={[styles.containerText, handleContainerText()]}>
        {amountCut <= 0 ? (
          <Text
            onTextLayout={handleTextLayout}
            numberOfLines={maxLine}
            // numberOfLines={Platform.OS === 'ios' ? 0 : maxLine}
            onLayout={handleTextLine}
            style={handleStyleFont()}>
            {getCaptionWithTopicStyle(
              route?.params?.id,
              message,
              navigation,
              null,
              item?.topics,
              item
            )}
            {/* {numberLine > maxLine ? <Text style={{color: 'red'}}>More..</Text> : null} */}
          </Text>
        ) : (
          <Text style={handleStyleFont()}>
            {getCaptionWithTopicStyle(
              route?.params?.id,
              message.substring(0, amountCut),
              navigation,
              null,
              item?.topics,
              item
            )}{' '}
            {/* {amountCut > maxLine ? <Text style={styles.seemore}>More..</Text> : null} */}
          </Text>
        )}

        {/* {!cutText ? (
          <Text
            onTextLayout={handleTextLayout}
            numberOfLines={maxLine}
            onLayout={handleTextLine}
            style={handleStyleFont()}>
            {getCaptionWithTopicStyle(
              route?.params?.id,
              message,
              navigation,
              null,
              item?.topics,
              item
            )}
          </Text>
        ) : (
          <>
            <Text style={handleStyleFont()}>
              {getCaptionWithTopicStyle(
                route?.params?.id,
                cutText,
                navigation,
                null,
                item?.topics,
                item
              )}{' '}
              {hasMoreText ? <Text style={styles.seemore}>More...</Text> : null}
            </Text>
          </>
        )} */}
      </View>
    );
  };

  const handleContainerText = () => {
    if (
      message?.length < 125 &&
      item.post_type !== POST_TYPE_POLL &&
      item.post_type !== POST_TYPE_LINK &&
      images_url.length <= 0
    ) {
      return styles.centerVertical;
    }
    return {};
  };

  const hanldeHeightContainer = ({nativeEvent}) => {
    if (!layoutHeight || layoutHeight <= 0) {
      setLayoutHeight(nativeEvent.layout.height);
    }
  };
  return (
    <Pressable
      onLayout={hanldeHeightContainer}
      onPress={onPress}
      style={[styles.contentFeed, style]}>
      {message?.length > 0 ? (
        <View>
          <View style={[styles.containerMainText, handleContainerText()]}>
            {renderHandleTextContent()}
          </View>
        </View>
      ) : null}

      {item && item.post_type === POST_TYPE_POLL ? (
        <View style={styles.containerMainText}>
          <ContentPoll
            message={item.message}
            images_url={item.images_url}
            polls={item.pollOptions}
            // onPress={() => onPress(item, index)}
            item={item}
            pollexpiredat={item.polls_expired_at}
            multiplechoice={item.multiplechoice}
            isAlreadyPolling={item.isalreadypolling}
            onnewpollfetched={onNewPollFetched}
            voteCount={item.voteCount}
            topics={item?.topics}
          />
        </View>
      ) : null}
      {images_url.length > 0 && (
        <View style={styles.containerImage}>
          <ImageLayouter images={images_url} onimageclick={onImageClickedByIndex} />
        </View>
      )}

      <TopicsChip topics={topics} fontSize={normalizeFontSize(14)} text={message} />
    </Pressable>
  );
};

Content.propTypes = {
  message: PropTypes.string,
  images_url: PropTypes.array,
  style: PropTypes.object,
  onPress: PropTypes.func,
  topics: PropTypes.arrayOf(PropTypes.string)
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
    fontSize: normalizeFontSize(14),
    color: colors.black,
    lineHeight: 24,
    flex: 1,
    flexWrap: 'wrap'
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

  feedUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: normalizeFontSize(14),
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
    marginTop: 0
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
  textContainer: {},
  containerMainText: {
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  containerText: {
    flexDirection: 'row'
  },
  centerVertical: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }
});
