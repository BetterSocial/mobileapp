import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {Image, StyleSheet, Text, View} from 'react-native';

import BlockIcon from '../../assets/block.png';
import Imageblock from '../../assets/images/block.png';
import MemoIc_arrow_down_vote_on from '../../assets/arrow/Ic_downvote_on';
import MemoIc_arrow_upvote_on from '../../assets/arrow/Ic_upvote_on';
import MemoIc_block_inactive from '../../assets/block/Ic_block_inactive';
import MemoIc_comment from '../../assets/icons/Ic_comment';
import styles from './BaseChatItemStyles';

const BaseChatItem = ({
  picture = 'https://fastly.picsum.photos/id/173/400/400.jpg?hmac=TU_DMkn7FSRRwiEpVveLvmyATg-y4hNrNKT-Cs4VQ1M',
  postNotificationPicture = 'https://fastly.picsum.photos/id/912/400/400.jpg?hmac=Wg3Y7jTiQxHr_NpRsTrHG58kBfZQGNeH2tCl5u2Ipr0',
  name = 'Amanda Amanda Amanda Amanda Amanda Amanda',
  message = 'How have you been? Do you want to meet up sometime?',
  message2Bold = 'Bayu commented',
  message2 = 'Help all of us to bring good food to more people in the villages, we will hold a party for tonight',
  unreadCount = 1,
  time = '12:00 PM',
  upvote = 15,
  downvote = 3,
  comments = 155,
  block = 11
}) => {
  return (
    <View style={styles.chatContainer}>
      <View>
        {/* Chat Image */}
        <FastImage source={{uri: picture}} style={styles.image} />
        {/* Post Notification Image */}
        <FastImage source={{uri: postNotificationPicture}} style={styles.postNotificationImage} />
      </View>

      <View style={styles.chatContentContainer}>
        <View style={styles.chatContentSection}>
          {/* Name */}
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.chatContentName}>
            {name}
          </Text>
          {/* Time */}
          <Text style={styles.chatContentTime}>{time}</Text>
        </View>

        <View style={styles.chatContentSection}>
          {/* Message */}
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.chatContentMessage}>
            {message}
          </Text>
          {/* Unread Count */}
          <View style={styles.chatContentUnreadCountContainer}>
            <Text style={styles.chatContentUnreadCount}>{unreadCount}</Text>
          </View>
        </View>

        <View style={styles.chatContentSection}>
          {/* Message 2 */}
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.chatContentPostNotificationMessage}>
            <Text style={styles.chatContentPostNotificationMessageBold}>{`${message2Bold}: `}</Text>
            {message2}
          </Text>
        </View>
        <View style={styles.chatContentSection}>
          <View style={styles.descriptionContainer}>
            <View style={styles.iconContainer}>
              <MemoIc_arrow_upvote_on style={styles.iconMargin} width={15} height={15} />
              <Text style={styles.textVoteMargin}>{upvote}</Text>
            </View>
            <View style={styles.iconContainer}>
              <MemoIc_arrow_down_vote_on style={styles.iconMargin} width={15} height={15} />
              <Text style={styles.textVoteMargin}>{downvote}</Text>
            </View>
            <View style={styles.iconContainer}>
              <MemoIc_comment style={styles.iconMargin} width={15} height={15} />
              <Text style={styles.textVoteMargin}>{comments}</Text>
            </View>
            <View style={styles.iconContainer}>
              {Number(block) > 0 ? (
                <Image source={Imageblock} style={styles.iconMargin} width={15} height={15} />
              ) : (
                <MemoIc_block_inactive style={styles.iconMargin} width={15} height={15} />
              )}
              <Text style={styles.textVoteMargin}>{String(block)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default BaseChatItem;
