import {BaseChannelItemTypeProps} from '../../../types/component/AnonymousChat/BaseChannelItem.types';
import {PostNotificationChannelList} from '../../../types/database/schema/PostNotificationChannelList.types';

function useChannelHook() {
  const determinePostType = (data: PostNotificationChannelList): BaseChannelItemTypeProps => {
    const isOwningPost = data?.rawJson?.isOwnPost;
    const isAnonymousPost = data?.rawJson?.isAnonym;

    const firstComment = data?.rawJson?.comments[0];
    const hasComment = data?.rawJson?.comments.length > 0;
    const isOwningComment = firstComment?.reaction?.isOwningReaction;
    const isAnonymousComment = firstComment?.reaction?.data?.is_anonymous;

    if (isOwningPost && isAnonymousPost && isOwningComment && isAnonymousComment)
      return BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY;

    if (isOwningPost && isAnonymousPost && isOwningComment)
      return BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_I_COMMENTED;

    if (isOwningPost && isAnonymousPost && isAnonymousComment)
      return BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_COMMENTED_ANONYMOUSLY;

    if (isOwningPost && isAnonymousPost && hasComment)
      return BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION_COMMENTED;

    if (isOwningPost && isAnonymousPost) return BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION;

    if (isOwningPost && isOwningComment && isAnonymousComment)
      return BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY;

    if (isOwningPost && isOwningComment)
      return BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION_COMMENTED;

    if (isOwningPost && isAnonymousComment)
      return BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION_COMMENTED_ANONYMOUSLY;

    if (isOwningPost && hasComment)
      return BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION_COMMENTED;

    if (isOwningPost) return BaseChannelItemTypeProps.MY_SIGNED_POST_NOTIFICATION;

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
