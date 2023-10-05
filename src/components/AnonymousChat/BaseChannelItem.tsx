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
  block = 0,
  comments = 0,
  downvote = 0,
  isCommentExists = false,
  isMe = false,
  message = '',
  name = '',
  picture = 'https://fastly.picsum.photos/id/173/400/400.jpg?hmac=TU_DMkn7FSRRwiEpVveLvmyATg-y4hNrNKT-Cs4VQ1M',
  postMaker = null,
  postNotificationMessageText = '',
  postNotificationMessageUser = null,
  postNotificationPicture = 'https://fastly.picsum.photos/id/912/400/400.jpg?hmac=Wg3Y7jTiQxHr_NpRsTrHG58kBfZQGNeH2tCl5u2Ipr0',
  time = '12:00 PM',
  type = BaseChannelItemTypeProps.ANON_PM,
  unreadCount = 0,
  upvote = 0,
  onPress = () => {
    console.log('onPress');
  }
}) => {
  return (
    <CustomPressable onPress={onPress}>
      <View style={styles.chatContainer}>
        <ChannelImage
          type={type}
          mainPicture={picture}
          postNotificationPicture={postNotificationPicture}
          anonPostNotificationUserInfo={anonPostNotificationUserInfo}
          isCommentExists={isCommentExists}
          postMaker={postMaker}
        />

        <View style={styles.chatContentContainer}>
          <ChannelTitle
            type={type}
            name={name}
            message={message}
            time={time}
            unreadCount={unreadCount}
            isMe={isMe}
          />

          {/* Post Notification Message */}
          <View style={styles.chatContentSection}>
            <ChannelPostNotificationMessage
              type={type}
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
