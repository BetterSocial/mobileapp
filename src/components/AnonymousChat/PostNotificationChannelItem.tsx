import * as React from 'react';

import BaseChannelItem from './BaseChannelItem';
import useChannelHook from '../../hooks/screen/useChannelHook';
import {COLORS} from '../../utils/theme';
import {
  Comment,
  PostNotificationChannelList,
  Reaction
} from '../../../types/database/schema/PostNotificationChannelList.types';
import {MessageChannelItemProps} from '../../../types/component/AnonymousChat/MessageChannelItem.types';
import {calculateTime} from '../../utils/time';
import {getOfficialAnonUsername} from '../../utils/string/StringUtils';

const PostNotificationChannelItem: (props: MessageChannelItemProps) => React.ReactElement = ({
  item,
  onChannelPressed
}) => {
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

    if (firstComment?.reaction?.isOwningReaction) {
      commenterName = 'You';
      postNotificationPicture = firstComment?.reaction?.user?.data?.profile_pic_url;
    } else if (anonymousCommenterName) {
      commenterName = getOfficialAnonUsername(firstComment?.reaction?.data);
    } else {
      commenterName = firstComment?.reaction?.user?.data?.username;
      postNotificationPicture = firstComment?.reaction?.user?.data?.profile_pic_url;
    }

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
  const isOwnSignedPost = item?.rawJson?.isOwnSignedPost;

  const {determinePostType} = useChannelHook();
  const type = determinePostType(postNotifItem);

  const getIsMe = () => {
    if (item?.channelType === 'ANON_POST_NOTIFICATION')
      return postNotifItem?.rawJson?.isOwnAnonymousPost;
    if (item?.channelType === 'POST_NOTIFICATION') return postNotifItem?.rawJson?.isOwnSignedPost;

    return false;
  };

  const postMakerAnonUserInfo = {
    anon_user_info_emoji_name: postMaker?.data?.emoji_name,
    anon_user_info_color_name: postMaker?.data?.color_name,
    anon_user_info_emoji_code: postMaker?.data?.emoji_code,
    anon_user_info_color_code: postMaker?.data?.color_code
  };

  const anonUsername = postMaker?.data?.emoji_name
    ? getOfficialAnonUsername(postMakerAnonUserInfo)
    : postMaker?.data?.username;

  return (
    <BaseChannelItem
      type={type}
      anonPostNotificationUserInfo={anonymousPostNotificationUserInfo}
      block={item?.rawJson?.block}
      comments={item?.rawJson?.comments?.length}
      downvote={item?.rawJson?.downvote}
      isCommentExists={Boolean(firstComment)}
      isMe={getIsMe()}
      isOwnSignedPost={isOwnSignedPost}
      message={item?.description}
      name={anonUsername}
      onPress={onChannelPressed}
      picture={postMaker?.data?.profile_pic_url}
      postMaker={postMaker?.data}
      postNotificationMessageText={postNotificationMessageText}
      postNotificationMessageUser={commenterName}
      postNotificationPicture={postNotificationPicture}
      time={calculateTime(item?.lastUpdatedAt, true)}
      unreadCount={postNotifItem?.unreadCount}
      upvote={item?.rawJson?.upvote}
      channelType={item?.channelType}
      dbAnonUserInfo={{
        anon_user_info_color_code: item?.anon_user_info_color_code,
        anon_user_info_color_name: item?.anon_user_info_color_name,
        anon_user_info_emoji_code: item?.anon_user_info_emoji_code,
        anon_user_info_emoji_name: item?.anon_user_info_emoji_name
      }}
      postNotificationIsMediaOnly={item?.rawJson?.isMediaOnlyMessage}
      containerBackgroundColor={
        item?.channelType === 'POST_NOTIFICATION'
          ? COLORS.signedPostNotificationChannel
          : COLORS.anonPostNotificationChannel
      }
    />
  );
};

const isEqual = (prevProps, nextProps) => {
  return nextProps.item === prevProps.item;
};

export default React.memo(PostNotificationChannelItem, isEqual);
