/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {Context} from '../../context';

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
  time = '12:00 PM',
  type = BaseChannelItemTypeProps.ANON_PM,
  unreadCount = 0,
  upvote = 15,
  hasFollowButton = false,
  handleFollow,
  channelType,
  onPress = () => {
    console.log('onPress');
  }
}) => {
  const [profileContext] = (React.useContext(Context) as unknown as any).profile;
  const [followContext] = (React.useContext(Context) as unknown as any).following;
  const {myProfile} = profileContext;
  let isFollowing = false;
  if (type === BaseChannelItemTypeProps.SIGNED_PM) {
    const members = postMaker?.members || postMaker?.channel?.members;
    const targetUser = members?.find((member) => member?.user_id !== myProfile?.user_id)?.user;
    isFollowing = Boolean(
      followContext?.users?.find((user) => user?.user_id_followed === targetUser?.id)
    );
  }

  const isAnonymousTab: boolean =
    channelType === 'ANON_PM' ||
    channelType === 'ANON_GROUP' ||
    channelType === 'ANON_POST_NOTIFICATION';

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
          isAnonymousTab={isAnonymousTab}
        />

        <View style={styles.chatContentContainer}>
          <ChannelTitle
            type={type}
            name={name}
            message={message}
            time={time}
            unreadCount={unreadCount}
            isMe={isMe}
            hasFollowButton={hasFollowButton}
            isFollowing={isFollowing}
            handleFollow={handleFollow}
            isAnonymousTab={isAnonymousTab}
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
