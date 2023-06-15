import * as React from 'react';

import BaseChannelItem, {BaseChannelItemType} from './BaseChannelItem';
import {BaseChannelItemTypeProps} from '../../../types/component/AnonymousChat/BaseChannelItem.types';
import {Comment} from '../../../types/repo/AnonymousMessageRepo/AnonymousPostNotificationData';
import {MessageChannelItemProps} from '../../../types/component/AnonymousChat/MessageChannelItem.types';
import {PostNotificationChannelList} from '../../../types/database/schema/PostNotificationChannelList.types';
import {calculateTime} from '../../utils/time';
import {capitalizeFirstText} from '../../utils/string/StringUtils';

const AnonPostNotificationChannelItem: (props: MessageChannelItemProps) => React.ReactElement = ({
  item,
  onChannelPressed
}) => {
  const postNotifItem = item as PostNotificationChannelList;
  let commenterName = '';
  let postNotificationMessageText = '';
  let postNotificationPicture = null;
  let anonymousPostNotificationUserInfo = null;
  let firstComment: Comment = null;

  if (postNotifItem?.rawJson?.comments?.length > 0) {
    firstComment = postNotifItem?.rawJson?.comments[0];
    const anonymousCommenterName = firstComment?.reaction?.data?.anon_user_info_emoji_name;
    anonymousPostNotificationUserInfo = {
      ...firstComment?.reaction?.data
    };

    if (firstComment?.reaction?.isOwningReaction) commenterName = 'You';
    else if (anonymousCommenterName) {
      commenterName = `Anonymous ${capitalizeFirstText(anonymousCommenterName)}`;
    } else {
      commenterName = firstComment?.reaction?.user?.data?.username;
      postNotificationPicture = firstComment?.reaction?.user?.data?.profile_pic_url;
    }

    postNotificationMessageText = firstComment?.reaction?.data?.text;
  }

  const postMaker = postNotifItem?.rawJson?.postMaker;
  const isOwnPost = postNotifItem?.rawJson?.isOwnPost;

  let type = BaseChannelItemTypeProps.ANON_POST_NOTIFICATION;
  if (isOwnPost) type = BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION;
  if (firstComment?.reaction?.isOwningReaction)
    type = BaseChannelItemTypeProps.ANON_POST_NOTIFICATION_I_COMMENTED;

  return (
    <BaseChannelItem
      message={item?.description}
      type={type}
      picture={postMaker?.data?.profile_pic_url}
      name={postMaker?.data?.username}
      time={calculateTime(item?.lastUpdatedAt)}
      onPress={onChannelPressed}
      block={item?.rawJson?.block}
      comments={item?.rawJson?.comments?.length}
      downvote={item?.rawJson?.downvote}
      upvote={item?.rawJson?.upvote}
      postNotificationMessageText={postNotificationMessageText}
      postNotificationMessageUser={commenterName}
      postNotificationPicture={postNotificationPicture}
      anonPostNotificationUserInfo={anonymousPostNotificationUserInfo}
      isCommentExists={!!firstComment}
      unreadCount={postNotifItem?.unreadCount}
    />
  );
};

export default AnonPostNotificationChannelItem;
