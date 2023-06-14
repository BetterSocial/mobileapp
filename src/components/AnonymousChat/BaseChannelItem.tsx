import * as React from 'react';
import FastImage from 'react-native-fast-image';
import {Image, StyleSheet, Text, View} from 'react-native';

import ChannelImage from './child/ChannelImage';
import ChannelPostNotificationMessage from './child/ChannelPostNotificationMessage';
import ChannelPostNotificationStats from './child/ChannelPostNotificationStats';
import ChannelTitle from './child/ChannelTitle';
import CustomPressable from '../CustomPressable';
import styles from './BaseChannelItemStyles';
import {BaseChannelItemProps} from '../../../types/component/AnonymousChat/BaseChannelItem.types';

export const BaseChannelItemType = {
  ANON_PM: 'ANON_PM',
  ANON_POST_NOTIFICATION: 'ANON_POST_NOTIFICATION',
  MY_ANON_POST_NOTIFICATION: 'MY_ANON_POST_NOTIFICATION',
  ANON_POST_NOTIFICATION_I_COMMENTED: 'ANON_POST_NOTIFICATION_I_COMMENTED'
};

const BaseChannelItem: (props: BaseChannelItemProps) => React.ReactElement = ({
  picture = 'https://fastly.picsum.photos/id/173/400/400.jpg?hmac=TU_DMkn7FSRRwiEpVveLvmyATg-y4hNrNKT-Cs4VQ1M',
  postNotificationPicture = 'https://fastly.picsum.photos/id/912/400/400.jpg?hmac=Wg3Y7jTiQxHr_NpRsTrHG58kBfZQGNeH2tCl5u2Ipr0',
  name = 'Amanda Amanda Amanda Amanda Amanda Amanda',
  message = 'How have you been? Do you want to meet up sometime?',
  // postNotificationMessageText = 'Help all of us to bring good food to more people in the villages, we will hold a party for tonight',
  postNotificationMessageText = '',
  postNotificationMessageUser = null,
  unreadCount = 1,
  time = '12:00 PM',
  upvote = 15,
  downvote = 3,
  comments = 155,
  block = 11,
  type = BaseChannelItemType.ANON_PM,
  onPress = function () {
    console.log('onPress');
  }
}) => {
  return (
    <CustomPressable onPress={onPress}>
      <View style={styles.chatContainer}>
        <ChannelImage
          mainPicture={picture}
          postNotificationPicture={postNotificationPicture}
          type={type}
        />

        <View style={styles.chatContentContainer}>
          <ChannelTitle
            name={name}
            time={time}
            type={type}
            message={message}
            unreadCount={unreadCount}
          />

          <View style={styles.chatContentSection}>
            {/* Post Notification Message */}
            <ChannelPostNotificationMessage
              type={type}
              commenterId={''}
              commenterName={postNotificationMessageUser}
              message={postNotificationMessageText}
            />
          </View>

          {/* Post Stats */}
          <View style={styles.chatContentSection}>
            <ChannelPostNotificationStats
              type={type}
              block={block}
              upvote={upvote}
              downvote={downvote}
              comments={comments}
            />
          </View>
        </View>
      </View>
    </CustomPressable>
  );
};

export default BaseChannelItem;
