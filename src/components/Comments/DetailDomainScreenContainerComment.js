import * as React from 'react';
import moment from 'moment';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Comment from './Comment';
import ConnectorWrapper from './ConnectorWrapper';
import DetailDomainScreenCommentItem from './DetailDomainScreenCommentItem';
import StringConstant from '../../utils/string/StringConstant';
import {downVoteDomain, upVoteDomain} from '../../service/vote';
import ButtonHightlight from '../ButtonHighlight';
import {COLORS} from '../../utils/theme';

const DetailDomainScreenContainerComment = ({comments, indexFeed, updateParent, refreshNews}) => {
  const [totalVote, setTotalVote] = React.useState(0);
  const [voteStatus, setVoteStatus] = React.useState('none');
  const navigation = useNavigation();
  const isLast = (index, item) => {
    return index === comments.length - 1 && (item.children_counts.comment || 0) === 0;
  };

  const isLastInParent = (index, item) => {
    return index === comments.length - 1;
  };

  const hideLeftConnector = (index, item) => {
    return index === comments.length - 1;
  };

  const onVoteUp = async (item) => {
    await upVoteDomain({
      activity_id: item.id,
      feed_group: 'domain',
      domain: item.domain.name
    });
    if (voteStatus === 'none') {
      setVoteStatus('upvote');
      setTotalVote((vote) => vote + 1);
    }
    if (voteStatus === 'upvote') {
      setVoteStatus('none');
      setTotalVote((vote) => vote - 1);
    }
    if (voteStatus === 'downvote') {
      setVoteStatus('upvote');
      setTotalVote((vote) => vote + 2);
    }
    onRefreshNews();
  };

  const onVoteDown = async (item) => {
    await downVoteDomain({
      activity_id: item.id,
      // status: !statusUpvote, //TODO: is not defined
      feed_group: 'domain',
      domain: item.domain.name
    });
    if (voteStatus === 'none') {
      setVoteStatus('downvote');
      setTotalVote((vote) => vote - 1);
    }
    if (voteStatus === 'downvote') {
      setVoteStatus('none');
      setTotalVote((vote) => vote + 1);
    }
    if (voteStatus === 'upvote') {
      setVoteStatus('downvote');
      setTotalVote((vote) => vote - 2);
    }
    onRefreshNews();
  };

  const onRefreshNews = () => {
    if (refreshNews && typeof refreshNews === 'function') {
      refreshNews();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.lineBeforeProfile} />
      {comments.map((item, index) => {
        (item.latest_children.comment || []).sort((current, next) => {
          const currentMoment = moment(current.updated_at);
          const nextMoment = moment(next.updated_at);
          return currentMoment.diff(nextMoment);
        });

        return (
          <View key={index}>
            <View key={index}>
              <DetailDomainScreenCommentItem
                key={index}
                comment={item}
                // username={item.user.data.username}
                user={item.user}
                level={0}
                time={item.created_at}
                photo={item.user.data.profile_pic_url}
                isLast={isLast(index, item)}
                isLastInParent={isLastInParent(index, item)}
                onPress={() => {
                  navigation.navigate('ReplyComment', {
                    item,
                    level: 0,
                    indexFeed,
                    updateParent
                  });
                }}
                onVoteDown={() => onVoteDown(item)}
                onVoteUp={() => onVoteUp(item)}
                totalVotes={totalVote}
              />
            </View>
            {item.children_counts.comment > 0 && (
              <ReplyComment
                hideLeftConnector={hideLeftConnector(index, item)}
                data={item.latest_children.comment}
                countComment={item.children_counts.comment}
                navigation={navigation}
                indexFeed={indexFeed}
                updateParent={updateParent}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};
const ReplyComment = ({
  indexFeed,
  data,
  countComment,
  navigation,
  hideLeftConnector,
  updateParent
}) => {
  const isLast = (item, index) => {
    return index === countComment - 1 && (item.children_counts.comment || 0) === 0;
  };

  const isLastInParent = (index) => {
    return index === countComment - 1;
  };

  return (
    <ContainerReply hideLeftConnector={hideLeftConnector}>
      {data.map((item, index) => {
        const showCommentView = () =>
          navigation.navigate('ReplyComment', {
            item,
            level: 1,
            indexFeed,
            updateParent
          });

        const showChildCommentView = () =>
          navigation.navigate('ReplyComment', {
            item,
            level: 2,
            indexFeed,
            updateParent
          });

        return (
          <ConnectorWrapper key={index} index={index}>
            <View key={index} style={styles.levelOneCommentWrapper}>
              <Comment
                key={index}
                comment={item}
                // username={item.user.data.username}
                user={item.user}
                level={1}
                photo={item.user.data.profile_pic_url}
                time={item.created_at}
                onPress={showCommentView}
                isLast={isLast(item, index)}
              />
              {item.children_counts.comment > 0 && (
                <>
                  <View style={styles.seeRepliesContainer(isLastInParent(index))}>
                    <View style={styles.connector} />
                    <ButtonHightlight onPress={showChildCommentView}>
                      <Text style={styles.seeRepliesText}>
                        {StringConstant.postDetailPageSeeReplies(item.children_counts.comment || 0)}
                      </Text>
                    </ButtonHightlight>
                  </View>
                </>
              )}
            </View>
          </ConnectorWrapper>
        );
      })}
    </ContainerReply>
  );
};
const ContainerReply = ({children, isGrandchild, hideLeftConnector}) => {
  return (
    <View
      style={[
        styles.containerReply(hideLeftConnector),
        {borderColor: isGrandchild ? COLORS.white : COLORS.lightgrey}
      ]}>
      {children}
    </View>
  );
};
export default DetailDomainScreenContainerComment;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
    paddingRight: 8
  },
  lineBeforeProfile: {
    height: 8.5,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.lightgrey
  },
  containerReply: (hideLeftConnector) => ({
    borderLeftWidth: 1
  }),
  seeRepliesContainer: (isLast) => ({
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 14,
    borderLeftColor: isLast ? COLORS.transparent : COLORS.lightgrey,
    borderLeftWidth: 1
  }),
  seeRepliesText: {
    color: COLORS.signed_primary
  },
  connector: {
    width: 15,
    height: 10,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 21,
    borderLeftColor: COLORS.lightgrey,
    borderBottomColor: COLORS.lightgrey,
    marginRight: 4,
    marginLeft: -1
  },
  levelOneCommentWrapper: {
    flex: 1,
    marginLeft: 0
  }
});
