import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';

import ImageLayouter from './ImageLayouter';
import TopicsChip from '../../TopicsChip/TopicsChip';
import { COLORS } from '../../../utils/theme';
import { Gap } from "../..";
import { colors } from '../../../utils/colors';
import { fonts, normalizeFontSize } from '../../../utils/fonts';
import { getCaptionWithTopicStyle } from '../../../utils/string/StringUtils';
import ContentPoll from '../../../screens/FeedScreen/ContentPoll';
import { POST_TYPE_POLL } from '../../../utils/constants';

const { width: screenWidth } = Dimensions.get('window');

const Content = ({ message, images_url, style, onPress, topics = [], item, onNewPollFetched }) => {
  const navigation = useNavigation();
  const cekImage = () => images_url  && images_url !== '' ;

  const onImageClickedByIndex = (index) => {
    console.log(index);
    navigation.push('ImageViewer', {
      title: 'Photo',
      index,
      images: images_url.reduce((acc, current) => {
        acc.push({ url: current });
        return acc;
      }, []),
    });
  };

  const devHeight = Dimensions.get('screen').height
  const substringNoImageTopic = devHeight / 1.25 - (40 * 7)
  console.log(item?.topics)
  if (!cekImage) return null

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        <View style={[styles.contentFeed]}>
          <Text style={styles.textContentFeed}>{getCaptionWithTopicStyle(message, navigation,  substringNoImageTopic, item?.topics)}</Text>
          {item && item.post_type === POST_TYPE_POLL ?
            <ContentPoll
              message={item.message}
              images_url={item.images_url}
              polls={item.pollOptions}
              item={item}
              pollexpiredat={item.polls_expired_at}
              multiplechoice={item.multiplechoice}
              isalreadypolling={item.isalreadypolling}
              onnewpollfetched={onnewpollfetched}
              voteCount={item.voteCount}
              topics={item?.topics}
            /> : null}

        </View>
        {images_url.length > 0 && <ImageLayouter
          images={images_url || []}
          onimageclick={onImageClickedByIndex}
        />}

      </ScrollView>
      <View style={styles.topicContainer} >
        <TopicsChip isPdp={true} topics={topics} fontSize={normalizeFontSize(14)} text={message} />

      </View>
    </>



  );
};

Content.propTypes = {
  message: PropTypes.string,
  images_url: PropTypes.array,
  style: PropTypes.object,
  onPress: PropTypes.func,
};

export default Content;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
  },
  fletlist: { flex: 1 },
  imageList: {
    flex: 1,
    width: screenWidth - 32,
    borderRadius: 16,
  },
  containerShowMessage: (currentRouteName) => ({
      justifyContent: 'center',
      alignItems: currentRouteName === 'Feed' ? 'center' : 'center',
      flex: 1,
      paddingBottom: 10,
      minHeight: 100,
    }),
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerFeedProfile: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 13,
  },

  feedUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
  containerFeedText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  feedDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.black,
    lineHeight: 18,
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8,
  },
  contentFeed: {
    flex: 1,
    marginTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 80,
    backgroundColor: COLORS.white,
  },
  topicContainer: {
    height: 110,
    backgroundColor: 'transparent',
    marginTop: -110,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    justifyContent: 'flex-end'

  },
  textContentFeed: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: 24,
    color: colors.black,
  },
  textComment: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    lineHeight: 18,
    color: colors.gray,
  },
  usernameComment: {
    fontFamily: fonts.inter[500],
    fontWeight: '900',
    fontSize: normalizeFontSize(12),
    lineHeight: 24,
    color: colors.black,
  },
  usernameTextComment: {
    fontFamily: fonts.inter[500],
    fontSize: normalizeFontSize(12),
    lineHeight: 24,
    color: colors.gray,
  },
  item: {
    width: screenWidth - 20,
    height: screenWidth - 20,
    marginTop: 10,
    marginLeft: -20,
    backgroundColor: 'pink',
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    aspectRatio: 1.5,
    resizeMode: 'cover',
  },
  imageAnonimity: {
    marginRight: 8,
    width: 32,
    height: 32,
  },
});
