import * as React from 'react';
import {View} from 'react-native';

import ChannelImage from './child/ChannelImage';
import ChannelPostNotificationMessage from './child/ChannelPostNotificationMessage';
import ChannelPostNotificationStats from './child/ChannelPostNotificationStats';
import ChannelTitle from './child/ChannelTitle';
import CustomPressable from '../CustomPressable';
import styles from './BaseChannelItemStyles';
import {
  BaseChannelItemProps,
  BaseChannelItemTypeProps
} from '../../../types/component/AnonymousChat/BaseChannelItem.types';

const BaseChannelItem: (props: BaseChannelItemProps) => React.ReactElement = ({
  anonPostNotificationUserInfo = null,
  block = 11,
  comments = 155,
  downvote = 3,
  isCommentExists = false,
  isMe = false,
  message = 'How have you been? Do you want to meet up sometime?',
  name = 'Amanda Amanda Amanda Amanda Amanda Amanda',
  picture = 'https://fastly.picsum.photos/id/173/400/400.jpg?hmac=TU_DMkn7FSRRwiEpVveLvmyATg-y4hNrNKT-Cs4VQ1M',
  postMaker = null,
  postNotificationMessageText = '',
  postNotificationMessageUser = null,
  postNotificationPicture = 'https://fastly.picsum.photos/id/912/400/400.jpg?hmac=Wg3Y7jTiQxHr_NpRsTrHG58kBfZQGNeH2tCl5u2Ipr0',
  showPostNotificationStats = false,
  time = '12:00 PM',
  type = BaseChannelItemTypeProps.ANON_PM,
  unreadCount = 0,
  upvote = 15,
  onPress = () => {
    console.log('onPress');
  }
}) => {
  // console.log(postMaker);
  return (
    <CustomPressable onPress={onPress}>
      <View style={styles.chatContainer}>
        <ChannelImage
          mainPicture={picture}
          postNotificationPicture={postNotificationPicture}
          type={type}
          anonPostNotificationUserInfo={anonPostNotificationUserInfo}
          isCommentExists={isCommentExists}
          postMaker={postMaker}
        />

        <View style={styles.chatContentContainer}>
          <ChannelTitle
            name={name}
            time={time}
            type={type}
            message={message}
            isMe={isMe}
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
              shown={showPostNotificationStats}
            />
          </View>
        </View>
      </View>
    </CustomPressable>
  );
};

export default BaseChannelItem;
