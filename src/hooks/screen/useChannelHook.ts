import {BaseChannelItemTypeProps} from '../../../types/component/AnonymousChat/BaseChannelItem.types';
import {PostNotificationChannelList} from '../../../types/database/schema/PostNotificationChannelList.types';

function useChannelHook() {
  const determinePostType = (data: PostNotificationChannelList): BaseChannelItemTypeProps => {
    const isOwnSignedPost =
      data?.rawJson?.isOwnSignedPost && data?.channelType === 'POST_NOTIFICATION';
    const isOwnAnonymousPost =
      data?.rawJson?.isOwnAnonymousPost && data?.channelType === 'ANON_POST_NOTIFICATION';
    const isAnonymousPost = data?.rawJson?.isAnonym;

    const firstComment = data?.rawJson?.comments[0];
    const hasComment = data?.rawJson?.comments.length > 0;
    const isOwningComment = firstComment?.reaction?.isOwningReaction;
    const isAnonymousComment = firstComment?.reaction?.data?.is_anonymous;

    if (isOwnAnonymousPost && isAnonymousPost && isOwningComment && isAnonymousComment)
      return BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY;

    if (isOwnAnonymousPost && isAnonymousPost && isOwningComment)
      return BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_I_COMMENTED;

    if (isOwnAnonymousPost && isAnonymousPost && isAnonymousComment)
      return BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_COMMENTED_ANONYMOUSLY;

    if (isOwnAnonymousPost && isAnonymousPost && hasComment)
      return BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_COMMENTED;

    if (isOwnAnonymousPost && isAnonymousPost)
      return BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION;

    if (isOwnSignedPost && isOwningComment && isAnonymousComment)
      return BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY;

    if (isOwnSignedPost && isOwningComment)
      return BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION_COMMENTED;

    if (isOwnSignedPost && isAnonymousComment)
      return BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION_COMMENTED_ANONYMOUSLY;

    if (isOwnSignedPost && hasComment)
      return BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION_COMMENTED;

    if (isOwnSignedPost) return BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION;

    if (isAnonymousPost && isOwningComment && isAnonymousComment)
      return BaseChannelItemTypeProps.ANON_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY;

    if (isAnonymousPost && isOwningComment)
      return BaseChannelItemTypeProps.ANON_POST_NOTIFICATION_I_COMMENTED;

    if (isAnonymousPost) return BaseChannelItemTypeProps.ANON_POST_NOTIFICATION;

    if (isOwningComment && isAnonymousComment)
      return BaseChannelItemTypeProps.SIGNED_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY;

    if (isOwningComment) return BaseChannelItemTypeProps.SIGNED_POST_NOTIFICATION_I_COMMENTED;

    return BaseChannelItemTypeProps.SIGNED_POST_NOTIFICATION;
  };

  return {
    determinePostType
  };
}

export default useChannelHook;
