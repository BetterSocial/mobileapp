import React from 'react';
import {
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Text,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import {
  Activity,
  Avatar,
  LikeButton,
  ReactionIcon,
  FollowButton,
  CommentItem,
} from 'react-native-activity-feed';
import moment from 'moment';
import ElipsisIcon from '../../assets/icons/images/elipsis.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import SeeMore from 'react-native-see-more-inline';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';

import ReplyIcon from '../../../assets/icons/reply/reply.png';
import AnonymousProfile from '../../assets/images/AnonymousProfile.png';

const {width: screenWidth} = Dimensions.get('window');

const _renderItem = ({item, index}, parallaxProps) => {
  return (
    <View key={index} style={styles.item}>
      <ParallaxImage
        source={{uri: item}}
        containerStyle={styles.imageContainer}
        style={styles.image}
        parallaxFactor={0.4}
        {...parallaxProps}
      />
    </View>
  );
};

const Content = (item) => {
  console.log(item.props.message);
  return (
    <View style={styles.contentFeed}>
      <SeeMore numberOfLines={4} linkStyle={styles.textContentFeed}>
        {item.props.message}
      </SeeMore>
      {item.props.image !== null ? (
        item.props.images_url.length > 0 ? (
          <Carousel
            sliderWidth={screenWidth}
            sliderHeight={screenWidth}
            itemWidth={screenWidth - 20}
            data={item.props.images_url}
            renderItem={_renderItem}
            hasParallaxImages={true}
          />
        ) : null
      ) : null}
    </View>
  );
};

export default Content;

const styles = StyleSheet.create({
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
    marginTop: 12,
    flexDirection: 'column',
  },
  textContentFeed: {
    fontFamily: fonts.inter[400],
    fontSize: 14,
    lineHeight: 24,
    color: colors.black,
  },
  textComment: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: colors.gray,
  },
  usernameComment: {
    fontFamily: fonts.inter[500],
    fontWeight: '900',
    fontSize: 12,
    lineHeight: 24,
    color: colors.black,
  },
  usernameTextComment: {
    fontFamily: fonts.inter[500],
    fontSize: 12,
    lineHeight: 24,
    color: colors.gray,
  },
  item: {
    width: screenWidth - 20,
    height: screenWidth - 20,
    marginTop: 10,
    marginLeft: -20,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    aspectRatio: 1.5,
    resizeMode: 'contain',
  },
  imageAnonimity: {
    marginRight: 8,
    width: 32,
    height: 32,
  },
});
