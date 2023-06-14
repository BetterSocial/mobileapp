import * as React from 'react';

import BaseChannelItem, {BaseChannelItemType} from './BaseChannelItem';
import {BaseChannelItemTypeProps} from '../../../types/component/AnonymousChat/BaseChannelItem.types';
import {MessageChannelItemProps} from '../../../types/component/AnonymousChat/MessageChannelItem.types';
import {calculateTime} from '../../utils/time';
import {capitalizeFirstText} from '../../utils/string/StringUtils';

const AnonPostNotificationChannelItem: (props: MessageChannelItemProps) => React.ReactElement = ({
  item,
  onChannelPressed
}) => {
  let commenterName = '';
  const anonymousCommenterName =
    item?.rawJson?.comments[0]?.reaction?.data?.anon_user_info_emoji_name;

  if (anonymousCommenterName) {
    commenterName = `Anonymous ${capitalizeFirstText(anonymousCommenterName)}`;
  } else {
    commenterName = item?.rawJson?.comments[0]?.reaction?.user?.username;
  }

  const postMaker = item?.rawJson?.postMaker;
  const isOwnPost = item?.rawJson?.isOwnPost;

  let type = BaseChannelItemTypeProps.ANON_POST_NOTIFICATION;
  if (isOwnPost) type = BaseChannelItemTypeProps.MY_ANON_POST_NOTIFICATION;

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
      postNotificationMessageText={item?.rawJson?.comments[0]?.reaction?.data?.text}
      postNotificationMessageUser={commenterName}
    />
  );
};

export default AnonPostNotificationChannelItem;
