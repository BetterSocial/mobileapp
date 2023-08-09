import React from 'react';
import {View, TouchableWithoutFeedback} from 'react-native';
import Comment from './Comment';
import {ReplyComment} from './ContainerComment';

const ListComment = ({
  indexFeed,
  index,
  onCommentLongPressed,
  item,
  isLast,
  isLastInParent,
  comments,
  navigateToReplyView,
  findCommentAndUpdate,
  hideLeftConnector,
  navigation,
  updateVote
}) => {
  return (
    <TouchableWithoutFeedback key={index} onLongPress={() => onCommentLongPressed(item, 0)}>
      <View>
        <View key={`p${index}`}>
          {item.user ? (
            <Comment
              indexFeed={indexFeed}
              key={`p${index}`}
              comment={item}
              user={item.user}
              level={0}
              time={item.created_at}
              photo={item.user.data?.profile_pic_url}
              isLast={isLast(index, item, comments)}
              isLastInParent={isLastInParent(index, comments)}
              showLeftConnector={false}
              onPress={() =>
                navigateToReplyView({
                  item,
                  level: 0,
                  indexFeed
                })
              }
              // refreshComment={refreshComment}
              findCommentAndUpdate={findCommentAndUpdate}
              onLongPress={onCommentLongPressed}
              updateVote={updateVote}
            />
          ) : null}
        </View>
        {item?.children_counts?.comment > 0 && (
          <ReplyComment
            hideLeftConnector={hideLeftConnector(index, item, comments)}
            data={item.latest_children.comment}
            countComment={item.children_counts.comment}
            navigation={navigation}
            indexFeed={indexFeed}
            navigateToReplyView={navigateToReplyView}
            // refreshComment={(children) => refreshChildComment({parent: item, children: children.data})}
            findCommentAndUpdate={findCommentAndUpdate}
            onCommentLongPressed={onCommentLongPressed}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default React.memo(ListComment);
