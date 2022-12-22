import * as React from 'react';
/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigation } from '@react-navigation/native';

import ContentPoll from './ContentPoll';
import ImageLayouter from './elements/ImageLayouter';
import TopicsChip from '../../components/TopicsChip/TopicsChip';
import { COLORS } from '../../utils/theme';
import { POST_TYPE_POLL } from '../../utils/constants';
import { colors } from '../../utils/colors';
import { fonts, normalizeFontSize } from '../../utils/fonts';
import { getCaptionWithTopicStyle } from '../../utils/string/StringUtils';

const { width: screenWidth } = Dimensions.get('window');



const Content = ({ message, images_url = [], style, onPress, topics = [], item, onNewPollFetched }) => {
  const navigation = useNavigation();
  const devHeight = Dimensions.get('screen').height
  const devWidth = Dimensions.get('screen').width
  const medianDimen1 = devWidth/ devHeight
  const substringPostImage = devHeight /2.25 - (40 * 4)
  const substringNoImageNoTopic = devHeight/1.25 - (40 * 4)
  const substringNoImageTopic = devHeight/1.25 - (40 * 7)



  const handleSubstring = () => medianDimen1 * 200

  
  
  const onImageClickedByIndex = (index) => {
    navigation.push('ImageViewer', {
      title: 'Photo',
      index,
      images: images_url.reduce((acc, current) => {
        acc.push({ url: current });
        return acc;
      }, []),
    });
  };

  const renderHandleTextContent = () => {
    if(images_url.length > 0) {
      return (
        <View testID='postTypePoll' style={{ height: '100%', flexDirection: 'row' }}>
 
          <Text  style={styles.textMedia}  >
            {getCaptionWithTopicStyle(message, navigation, substringPostImage, item?.topics)} {message.length > substringPostImage ? <Text style={{color: '#2F80ED'}} >More...</Text>: null}
          </Text>
        </View>
      )
    }
    
    return (
      <View testID='postTypeStatus' style={{flex: 1}} >
        {topics.length > 0 ? <Text style={styles.textMedia} >
            {getCaptionWithTopicStyle(message, navigation, substringNoImageTopic, item?.topics)} {message.length > substringNoImageTopic ? <Text style={{color: '#2F80ED'}} >More...</Text>: null}
          </Text> :  <Text  style={styles.textMedia} >
            {getCaptionWithTopicStyle(message, navigation, substringNoImageNoTopic, item?.topics)} {message.length > substringNoImageNoTopic ? <Text style={{color: '#2F80ED'}} >More...</Text>: null}
          </Text>}
         
      </View>
    )
  }

  return (
    <Pressable onPress={onPress} style={[styles.contentFeed, style]}>
      <View style={styles.container}>
        <View
          style={styles.containerMainText}>
          {renderHandleTextContent()}
        </View>
          
      </View>
      {item && item.post_type === POST_TYPE_POLL ?
           <View style={styles.containerMainText} >
           {message && typeof message === 'string' && message.length > 0 ? <Text style={[styles.textMedia]} >{message.substring(0, handleSubstring())} {message.length > handleSubstring() && <Text style={{color: '#2F80ED'}} >More...</Text>} </Text> : null}

            <ContentPoll
              message={item.message}
              images_url={item.images_url}
              polls={item.pollOptions}
              // onPress={() => onPress(item, index)}
              item={item}
              pollexpiredat={item.polls_expired_at}
              multiplechoice={item.multiplechoice}
              isalreadypolling={item.isalreadypolling}
              onnewpollfetched={onNewPollFetched}
              voteCount={item.voteCount}
              topics={item?.topics}
            /> 
                    </View>

            : null}
       {images_url.length > 0 && <View style={styles.containerImage}>
          <ImageLayouter
            images={images_url}
            onimageclick={onImageClickedByIndex}
          />
        </View>}

              <TopicsChip topics={topics} fontSize={normalizeFontSize(14)} text={message}/>

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
  container: {
    overflow: 'hidden',
    flex: 1,
    paddingVertical: 5
  },
  containerImage: {
    flex: 1,
  },
  imageList: {
    flex: 1,
    width: screenWidth - 32,
    borderRadius: 16,
  },
  textMedia: {
    fontFamily: fonts.inter[400],
    fontWeight: 'normal',
    fontSize: normalizeFontSize(14),
    color: colors.black,
    lineHeight: 24,
    flex: 1,
    flexWrap: 'wrap',
  },

  seemore: {
    color: COLORS.blue,
  },
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
    fontSize: normalizeFontSize(14),
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
    marginTop: 0,
  },
  textContentFeed: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(26),
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
  textContainer: {
  },
  containerMainText: {
    paddingLeft: 16,
    paddingRight: 16,
    height: '100%',
        // backgroundColor: 'red'

    // marginBottom: 7
  }
});
