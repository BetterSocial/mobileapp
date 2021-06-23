import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
  Dimensions,
  Platform,
} from 'react-native';

import moment from 'moment';
import SeeMore from 'react-native-see-more-inline';
import {Activity, Avatar} from 'react-native-activity-feed';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';

import ShareIcon from '../../assets/icons/images/share.svg';
import ElipsisIcon from '../../assets/icons/images/elipsis.svg';
import CommentIcon from '../../assets/icons/images/comment.svg';
import ArrowUpIcon from '../../assets/icons/images/arrow-up.svg';
import ArrowDownRedIcon from '../../assets/icons/images/arrow-down-red.svg';
import {fonts} from '../../utils/fonts';
import {colors} from '../../utils/colors';
import {POST_VERB_POLL} from '../../utils/constants';
import PollOptions from '../../components/PollOptions';

const {width: screenWidth} = Dimensions.get('window');

const renderActivity = (props, data) => {
  console.log(props);
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

  const _renderPollOptions = () => {
    if (!props.verb === POST_VERB_POLL) {
      return <View />;
    } else {
      return (
        <View style={styles.containerPoll}>
          {props.polls.map((item, index) => (
            <PollOptions item={item} index={index} total={0} />
          ))}
        </View>
      );
    }
  };

  return (
    <Activity
      {...props}
      Header={
        <View style={styles.rowSpaceBeetwen}>
          <View style={styles.rowCenter}>
            <Avatar
              source={
                data.profile_pic_path
                  ? data.profile_pic_path
                  : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png'
              }
              size={48}
              noShadow
            />
            <View style={styles.containerFeedProfile}>
              <Text style={styles.feedUsername}>
                {data.username ? data.username : 'no name specifics'}
              </Text>
              <View style={styles.containerFeedText}>
                <Text style={styles.feedDate}>20 Feb 2021</Text>
                <View style={styles.point} />
                <Text style={styles.feedDate}>
                  {moment.utc(props.activity.time).local().fromNow()}
                </Text>
              </View>
            </View>
          </View>
          <TouchableNativeFeedback>
            <ElipsisIcon width={18} height={3.94} fill={colors.black} />
          </TouchableNativeFeedback>
        </View>
      }
      Content={
        <View style={styles.contentFeed}>
          <SeeMore numberOfLines={4} linkStyle={styles.textContentFeed}>
            {props.activity.message}
          </SeeMore>
          {/* {_renderPollOptions()} */}
          {props.activity.images_url.length > 0 ? (
            <Carousel
              sliderWidth={screenWidth}
              sliderHeight={screenWidth}
              itemWidth={screenWidth - 20}
              data={props.activity.images_url}
              renderItem={_renderItem}
              hasParallaxImages={true}
            />
          ) : null}
          <View style={styles.rowSpaceBeetwen(0, 23)}>
            <View style={styles.rowSpaceBeetwen(70, 0)}>
              <ArrowUpIcon width={20} height={16} fill={colors.black} />
              <ArrowDownRedIcon width={20} height={16} fill="#FF2E63" />
            </View>
            <View style={styles.rowSpaceBeetwen(70, 0)}>
              <CommentIcon width={20} height={18} fill={colors.black} />
              <ShareIcon width={20} height={20} fill={colors.black} />
            </View>
          </View>
        </View>
      }
      // Footer={
      //   <View style={{flexDirection: 'column'}}>
      //     <View style={{marginTop: 10}}>
      //       <Text style={styles.textComment}>View all 3 comment</Text>
      //     </View>
      //     <View>
      //       <Text style={styles.usernameComment}>
      //         @geoffsmith{' '}
      //         <Text style={styles.usernameTextComment}>
      //           i don’t know about that
      //         </Text>
      //       </Text>
      //     </View>
      //   </View>
      // }
    />
  );
};

const styles = StyleSheet.create({
  containerPoll: {
    display: 'flex',
    backgroundColor: 'red',
  },
  rowSpaceBeetwen: (width, marginTop) => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width,
    marginTop,
  }),
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
});
export default renderActivity;
