import React from 'react';
import {View, Text, StyleSheet, TouchableNativeFeedback} from 'react-native';
import SeeMore from 'react-native-see-more-inline';
import {Activity, Avatar} from 'react-native-activity-feed';
import moment from 'moment';
import ShareIcon from '../../assets/icons/images/share.svg';
import ElipsisIcon from '../../assets/icons/images/elipsis.svg';
import ArrowUpIcon from '../../assets/icons/images/arrow-up.svg';
import ArrowDownRedIcon from '../../assets/icons/images/arrow-down-red.svg';
import CommentIcon from '../../assets/icons/images/comment.svg';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const renderActivity = (props) => {
  return (
    <Activity
      {...props}
      Header={
        <View style={styles.rowSpaceBeetwen}>
          <View style={styles.rowCenter}>
            <Avatar
              source="https://avatars.githubusercontent.com/u/811536?s=400&u=32007a4167b7250b321e81ab182116018fbee7b6&v=4"
              size={48}
              noShadow
            />
            <View style={styles.containerFeedProfile}>
              <Text style={styles.feedUsername}>{props.activity.actor.id}</Text>
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
          <SeeMore numberOfLines={3} linkStyle={styles.textContentFeed}>
            {props.activity.object}
          </SeeMore>
          <View style={{...styles.rowSpaceBeetwen, marginTop: 23}}>
            <View style={{...styles.rowSpaceBeetwen, width: 70}}>
              <ArrowUpIcon width={20} height={16} fill={colors.black} />
              <ArrowDownRedIcon width={20} height={16} fill="#FF2E63" />
            </View>
            <View style={{...styles.rowSpaceBeetwen, width: 70}}>
              <CommentIcon width={20} height={18} fill={colors.black} />
              <ShareIcon width={20} height={20} fill={colors.black} />
            </View>
          </View>
        </View>
      }
      Footer={
        <View style={{flexDirection: 'column'}}>
          <View style={{marginTop: 10}}>
            <Text style={styles.textComment}>View all 3 comment</Text>
          </View>
          <View>
            <Text style={styles.usernameComment}>
              @geoffsmith{' '}
              <Text style={styles.usernameTextComment}>
                i don’t know about that
              </Text>
            </Text>
          </View>
        </View>
      }
    />
  );
};

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
});
export default renderActivity;
