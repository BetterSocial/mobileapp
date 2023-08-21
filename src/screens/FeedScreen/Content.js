/* eslint-disable no-plusplus */
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
import {POST_TYPE_LINK, POST_TYPE_POLL, POST_TYPE_STANDARD} from '../../utils/constants';
import {colors} from '../../utils/colors';
import {fonts, normalizeFontSize, normalizeFontSizeByWidth} from '../../utils/fonts';
import {getCaptionWithTopicStyle} from '../../utils/string/StringUtils';
import useCalculationContent from './hooks/useCalculationContent';

const {width: screenWidth} = Dimensions.get('window');

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
  const maxFontSize = normalizeFontSizeByWidth(28);
  const minFontSize = normalizeFontSizeByWidth(16);
  const {handleCalculation} = useCalculationContent();
  const [amountCut, setAmountCut] = React.useState(0);
  const [textCut, setTextCunt] = React.useState(null);
  const [arrText] = React.useState([]);
  const isIos = Platform.OS === 'ios';

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
    if (
      item.post_type === POST_TYPE_POLL ||
      item.post_type === POST_TYPE_LINK ||
      images_url.length > 0
    ) {
      return 5;
    }
    return Math.floor(layoutHeight / lineHeight);
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

  const handleLineBreak = (nativeEvent, newMaxLine) => {
    const amountLineBreak = [];
    if (nativeEvent.lines.length > newMaxLine) {
      nativeEvent.lines.forEach((char, index) => {
        if (index <= newMaxLine && char.text.match(/[\r\n]+/g)) {
          amountLineBreak.push(char.text);
        }
      });
    }
    return amountLineBreak;
  };

  const handleTextLayout = ({nativeEvent}) => {
    let text = '';
    let {newMaxLine, countDeviceLine} = handleCountDeviceLine();
    const amountLineBreak = handleLineBreak(nativeEvent, newMaxLine);
    countDeviceLine = newMaxLine - amountLineBreak.length / 2;
    newMaxLine -= amountLineBreak.length / 2;
    if (item.post_type === POST_TYPE_STANDARD && item.images_url.length <= 0) {
      if (topics.length > 0) {
        newMaxLine -= 2;
        countDeviceLine -= 3;
      } else {
        newMaxLine -= 1;
        countDeviceLine -= 2;
      }
    } else {
      countDeviceLine -= 1;
    }
    for (let i = 0; i < newMaxLine; i++) {
      if (nativeEvent.lines[i]) {
        if (i === countDeviceLine) {
          text += nativeEvent.lines[i].text.substring(0, 30);
          arrText.push(nativeEvent.lines[i].text.substring(0, 30));
        } else {
          text += nativeEvent.lines[i].text;
          arrText.push(nativeEvent.lines[i].text);
        }
      }
    }
    setTextCunt(text);
    setAmountCut(text.length);
  };
  const renderHandleTextContent = () => {
    return (
      <View testID="postTypePoll" style={[styles.containerText, handleContainerText()]}>
        {amountCut <= 0 ? (
          <Text
            onTextLayout={handleTextLayout}
            numberOfLines={calculateMaxLine()}
            onLayout={handleTextLine}
            style={[handleStyleFont(), handleContainerText().text]}>
            {message}
          </Text>
        ) : (
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
            {''}
            {amountCut < message.length ? <Text style={styles.seemore}> More..</Text> : null}
          </Text>
        )}
      </View>
    );
  };

  const handleContainerText = () => {
    if (message?.length <= 125 && item.post_type === POST_TYPE_STANDARD && images_url.length <= 0) {
      return {
        container: styles.centerVertical,
        text: styles.centerVerticalText,
        isShort: true
      };
    }
    return {
      container: {},
      text: {},
      isShort: false
    };
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
          <View
            style={[
              styles.containerMainText(handleContainerText().isShort),
              handleContainerText().container
            ]}>
            {renderHandleTextContent()}
          </View>
        </View>
      ) : null}

      {item && item.post_type === POST_TYPE_POLL ? (
        <View style={styles.containerMainText(handleContainerText().isShort)}>
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
    paddingHorizontal: 16,
    paddingVertical: isShort ? 0 : 10
  }),
  containerText: {
    flexDirection: 'row'
  },
  centerVertical: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: '#11468F'
  },
  centerVerticalText: {
    color: 'white'
  }
});
