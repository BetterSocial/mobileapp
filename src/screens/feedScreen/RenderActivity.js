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

const RenderActivity = (props) => {
  const activity = props.activity;
  let {anonimity} = activity;
  let {profile_pic_path, real_name} = JSON.parse(activity.object);

  const getTime = (time) => {
    let date = new Date(time);
    return date.toLocaleDateString();
  };
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
  const _renderAnonimity = () => (
    <View style={styles.rowSpaceBeetwen}>
      <View style={styles.rowCenter}>
        <Image
          source={AnonymousProfile}
          width={32}
          height={32}
          style={styles.imageAnonimity}
        />
        <View style={styles.containerFeedProfile}>
          <Text style={styles.feedUsername}>Anonymous</Text>
          <View style={styles.containerFeedText}>
            <Text style={styles.feedDate}>{getTime(activity.time)}</Text>
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
  );

  const _renderProfileNormal = () => (
    <View style={styles.rowSpaceBeetwen}>
      <View style={styles.rowCenter}>
        <Avatar
          source={
            profile_pic_path
              ? profile_pic_path
              : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png'
          }
          size={48}
          noShadow
        />
        <View style={styles.containerFeedProfile}>
          <Text style={styles.feedUsername}>
            {real_name ? real_name : 'no name specifics'}
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
  );
  console.log('err fedd', props.activity.images_url);
  if (props) {
    return (
      <Activity
        {...props}
        Header={
          anonimity === true ? _renderAnonimity() : _renderProfileNormal()
        }
        Content={
          <View style={styles.contentFeed}>
            <SeeMore numberOfLines={4} linkStyle={styles.textContentFeed}>
              {props.activity.message}
            </SeeMore>
            {props.activity.images_url !== undefined &&
            props.activity.images_url.length > 0 ? (
              <Carousel
                sliderWidth={screenWidth}
                sliderHeight={screenWidth}
                itemWidth={screenWidth - 20}
                data={props.activity.images_url}
                renderItem={_renderItem}
                hasParallaxImages={true}
              />
            ) : null}
          </View>
        }
        Footer={
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <LikeButton {...props} />
            <ReactionIcon
              icon={ReplyIcon}
              labelSingle="comment"
              labelPlural="comments"
              counts={activity.reaction_counts}
              kind="comment"
            />
          </View>
        }
      />
    );
  }
  return <View />;
};

export default RenderActivity;

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
