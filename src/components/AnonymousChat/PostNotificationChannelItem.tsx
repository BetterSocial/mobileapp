import * as React from 'react';

import BaseChannelItem from './BaseChannelItem';
import useChannelHook from '../../hooks/screen/useChannelHook';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import {
  Comment,
  PostNotificationChannelList,
  Reaction
} from '../../../types/database/schema/PostNotificationChannelList.types';
import {MessageChannelItemProps} from '../../../types/component/AnonymousChat/MessageChannelItem.types';
import {calculateTime} from '../../utils/time';
import {capitalizeFirstText} from '../../utils/string/StringUtils';

const PostNotificationChannelItem: (props: MessageChannelItemProps) => React.ReactElement = ({
  item,
  onChannelPressed
}) => {
  // TODO: Change this into useUserAuthHook
  const {anonProfileId, signedProfileId} = useProfileHook();

  const postNotifItem = item as PostNotificationChannelList;
  let commenterName = '';
  let postNotificationMessageText = '';
  let postNotificationPicture = null;
  let anonymousPostNotificationUserInfo = null;
  let firstComment: Comment = null;

  let level1FirstComment: Reaction = null;
  let level2FirstComment: Reaction = null;

  const helperDetermineCommenterName = () => {
    const anonymousCommenterName = firstComment?.reaction?.data?.anon_user_info_emoji_name;
    const firstCommenterId = firstComment?.reaction?.user_id;
    const isFirstCommenterMe =
      firstCommenterId === signedProfileId || firstCommenterId === anonProfileId;

    if (firstComment?.reaction?.isOwningReaction) {
      commenterName = 'You';
      postNotificationPicture = firstComment?.reaction?.user?.data?.profile_pic_url;
    } else if (anonymousCommenterName) {
      commenterName = `Anonymous ${capitalizeFirstText(anonymousCommenterName)}`;
    } else {
      commenterName = firstComment?.reaction?.user?.data?.username;
      postNotificationPicture = firstComment?.reaction?.user?.data?.profile_pic_url;
    }

    if (isFirstCommenterMe) commenterName = 'You';

    return commenterName;
  };

  if (postNotifItem?.rawJson?.comments?.length > 0) {
    firstComment = postNotifItem?.rawJson?.comments[0];
    anonymousPostNotificationUserInfo = {...firstComment?.reaction?.data};

    helperDetermineCommenterName();

    if (postNotifItem?.rawJson?.comments[0]?.reaction?.latest_children?.comment?.length > 0) {
      const level1 = postNotifItem?.rawJson?.comments[0]?.reaction?.latest_children?.comment[0];
      level1FirstComment = level1;
      commenterName = level1?.user?.data?.username;

      if (level1?.latest_children?.comment?.length > 0) {
        level2FirstComment = level1?.latest_children?.comment[0];
        commenterName = level1?.user?.data?.username;
      }
    }

    postNotificationMessageText =
      level2FirstComment?.data?.text ||
      level1FirstComment?.data?.text ||
      firstComment?.reaction?.data?.text;
  }

  const postMaker = postNotifItem?.rawJson?.postMaker;
  const isOwnPost = postNotifItem?.rawJson?.isOwnPost;
  const isOwnSignedPost = item?.rawJson?.isOwnSignedPost;

  const {determinePostType} = useChannelHook();
  const type = determinePostType(postNotifItem);

  return (
    <BaseChannelItem
      type={type}
      anonPostNotificationUserInfo={anonymousPostNotificationUserInfo}
      block={item?.rawJson?.block}
      comments={item?.rawJson?.comments?.length}
      downvote={item?.rawJson?.downvote}
      isCommentExists={Boolean(firstComment)}
      isMe={item?.user?.isMe || isOwnSignedPost || isOwnPost}
      isOwnSignedPost={isOwnSignedPost}
      message={item?.description}
      name={postMaker?.data?.username}
      onPress={onChannelPressed}
      picture={postMaker?.data?.profile_pic_url}
      postMaker={postMaker?.data}
      postNotificationMessageText={postNotificationMessageText}
      postNotificationMessageUser={commenterName}
      postNotificationPicture={postNotificationPicture}
      time={calculateTime(item?.lastUpdatedAt, true)}
      unreadCount={postNotifItem?.unreadCount}
      upvote={item?.rawJson?.upvote}
    />
  );
};

export default PostNotificationChannelItem;
