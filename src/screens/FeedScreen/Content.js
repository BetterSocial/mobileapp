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
import {POST_TYPE_LINK, POST_TYPE_POLL} from '../../utils/constants';
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
  const maxFontSize = normalizeFontSizeByWidth(40);
  const minFontSize = normalizeFontSizeByWidth(18);
  const {handleCalculation} = useCalculationContent();
  const [amountCut, setAmountCut] = React.useState(0);
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
  const renderHandleTextContent = () => {
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

    const handleTextLayout = ({nativeEvent}) => {
      let text = '';
      const newMaxLine = Platform.OS === 'ios' ? calculateMaxLine() - 1 : calculateMaxLine();
      for (let i = 0; i < newMaxLine; i++) {
        if (nativeEvent.lines[i]) {
          text += nativeEvent.lines[i].text;
        }
      }
      if (text.length > 0 && message.length > text.length) {
        return setAmountCut(text.length - 10);
      }
      return setAmountCut(text.length);
    };

    return (
      <View testID="postTypePoll" style={[styles.containerText, handleContainerText()]}>
        {amountCut <= 0 ? (
          <Text
            onTextLayout={handleTextLayout}
            numberOfLines={calculateMaxLine()}
            onLayout={handleTextLine}
            style={handleStyleFont()}>
            {message.replace(/\n/g, ' ')}
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
            )}
            {''}
            {amountCut < message.length ? <Text style={styles.seemore}> More..</Text> : null}
          </Text>
        )}
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
  containerMainText: {
    paddingHorizontal: 16,
    paddingTop: 10
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
