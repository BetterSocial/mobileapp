/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line no-use-before-define
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
  block = 0,
  comments = 0,
  downvote = 0,
  isCommentExists = false,
  isMe = false,
  message = '',
  name = '',
  picture = 'https://res.cloudinary.com/hpjivutj2/image/upload/v1696816963/anonymous-profile.png',
  postMaker = null,
  postNotificationMessageText = '',
  postNotificationMessageUser = null,
  postNotificationPicture = 'https://res.cloudinary.com/hpjivutj2/image/upload/v1696816963/anonymous-profile.png',
  time = '',
  type = BaseChannelItemTypeProps.ANON_PM,
  unreadCount = 0,
  upvote = 0,
  hasFollowButton = false,
  handleFollow,
  channelType,
  onPress = () => {
    console.log('onPress');
  },
  dbAnonUserInfo = null
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
          dbAnonUserInfo={dbAnonUserInfo}
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
