import * as React from 'react';
import Toast from 'react-native-simple-toast';
import {Dimensions, SafeAreaView, ScrollView, StatusBar, StyleSheet, View} from 'react-native';

import BlockDomainComponent from '../../components/BlockDomain';
import ContainerComment from '../../components/Comments/ContainerComment';
import DetailDomainScreenContent from './elements/DetailDomainScreenContent';
import DetailDomainScreenHeader from './elements/DetailDomainScreenHeader';
import Loading from '../Loading';
import StringConstant from '../../utils/string/StringConstant';
import WriteComment from '../../components/Comments/WriteComment';
import {Context} from '../../context';
import {Footer} from '../../components';
import {createCommentDomainParentV2} from '../../service/comment';
import {downVoteDomain, upVoteDomain} from '../../service/vote';
import {fonts} from '../../utils/fonts';
import {getCountCommentWithChildInDetailPage} from '../../utils/getstream';
import {getDomainDetailById} from '../../service/domain';
import {getMyProfile} from '../../service/profile';
import {getUserId} from '../../utils/users';
import {updateComment} from '../../context/actions/news';
import { COLORS } from '../../utils/theme';

const {width} = Dimensions.get('window');

const DetailDomainScreen = (props) => {
  const {navigation} = props;
  const dataDomain = props.route.params && props.route.params.item;
  const refreshNews = props.route.params && props.route.params.refreshNews;
  const [, setDataProfile] = React.useState({});
  const [item, setItem] = React.useState(null);
  const [isReaction, setReaction] = React.useState(false);
  const [textComment, setTextComment] = React.useState('');
  const [totalComment, setTotalComment] = React.useState(0);
  const [totalVote, setTotalVote] = React.useState(0);
  const [yourselfId, setYourselfId] = React.useState('');
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote] = React.useState(false);
  const [comments, setComments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const blockRef = React.useRef(null);

  const [, dispatch] = React.useContext(Context).news;

  const initial = () => {
    const reactionCount = item.reaction_counts;
    if (JSON.stringify(reactionCount) !== '{}') {
      let count = 0;
      const {comment} = reactionCount;
      if (comment !== undefined) {
        if (comment > 0) {
          setReaction(true);
          setTotalComment(
            getCountCommentWithChildInDetailPage(props.route.params.item.latest_reactions)
          );
        }
      }
      const upvote = reactionCount.upvotes;
      if (upvote !== undefined) {
        count += upvote;
      }
      const downvote = reactionCount.downvotes;
      if (downvote !== undefined) {
        count -= downvote;
      }
      setTotalVote(count);
    }
  };

  React.useEffect(() => {
    if (item) {
      initial();
    }
  }, [item]);

  const getDomain = (withLoading = true) => {
    if (withLoading) setIsLoading(true);
    const id = dataDomain?.og?.news_feed_id || dataDomain?.id;
    getDomainDetailById(id).then((res) => {
      setItem(res);
      setIsLoading(false);
    });
  };

  React.useEffect(() => {
    fetchMyProfile();
    getDomain();
  }, []);

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setYourselfId(id);
      }
    };
    parseToken();
  }, []);

  const onRefreshNews = () => {
    if (refreshNews && typeof refreshNews === 'function') {
      refreshNews();
    }
  };

  const validationStatusVote = () => {
    if (item.reaction_counts !== undefined || null) {
      if (item.latest_reactions.upvotes !== undefined) {
        const upvote = item.latest_reactions.upvotes.filter((vote) => vote.user_id === yourselfId);
        if (upvote !== undefined) {
          setVoteStatus('upvote');
        }
      }

      if (item.latest_reactions.downvotes !== undefined) {
        const downvotes = item.latest_reactions.downvotes.filter(
          (vote) => vote.user_id === yourselfId
        );
        if (downvotes !== undefined) {
          setVoteStatus('downvote');
        }
      }
    }
  };

  React.useEffect(() => {
    if (item) {
      validationStatusVote();
      setComments(item?.latest_reactions?.comment || []);
    }
  }, [item, yourselfId]);

  const fetchMyProfile = async () => {
    const id = await getUserId();
    if (id) {
      const result = await getMyProfile(id);
      if (result.code === 200) {
        setDataProfile(result.data);
      }
    }
  };

  const commentParent = async (isAnonimity, anonimityData) => {
    try {
      if (textComment.trim() !== '') {
        let sendData = {
          activity_id: item.id,
          message: textComment,
          sendPostNotif: true,
          anonimity: isAnonimity
        };

        const anonUser = {
          emoji_name: anonimityData.emojiName,
          color_name: anonimityData.colorName,
          emoji_code: anonimityData.emojiCode,
          color_code: anonimityData.colorCode,
          is_anonymous: isAnonimity
        };
        if (isAnonimity) {
          sendData = {...sendData, anon_user_info: anonUser};
        }

        const data = await createCommentDomainParentV2(sendData);
        setComments([data?.data, ...comments]);
        if (data?.code === 200) {
          setTextComment('');
          updateComment(data?.data, item?.id, dispatch);
          setTotalComment((prev) => parseInt(prev, 10) + 1);
          getDomain(false);
        } else {
          Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
        }
      }
    } catch (e) {
      console.log(e?.message);
      Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
    }
  };

  const onPressUpvoteNew = async () => {
    await upVoteDomain({
      activity_id: item.id,
      status: !statusUpvote,
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

  const onPressDownVoteHandle = async () => {
    await downVoteDomain({
      activity_id: item.id,
      status: !statusUpvote,
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

  const updateParentPost = (data) => {
    setItem(data);
  };

  const navigateToReplyView = (data) => {
    navigation.navigate('ReplyComment', {
      ...data,
      page: props.route.name,
      dataFeed: data?.item,
      updateParent: updateParentPost
    });
  };

  const blockNews = () => {
    blockRef.current.refBlockDomain.current.open();
  };
  if (isLoading) return <Loading />;
  if (!item?.domain) return <View />;

  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      <SafeAreaView>
        <DetailDomainScreenHeader
          domain={item.domain.name}
          time={item?.content?.created_at}
          image={item.domain.image}
          onFollowDomainPressed={() => {}}
          score={dataDomain?.score}
          follower={dataDomain?.follower}
        />
      </SafeAreaView>

      {item ? (
        <ScrollView showsVerticalScrollIndicator={false} style={{height: '100%'}}>
          <View style={styles.content}>
            <View>
              <DetailDomainScreenContent
                date={item?.content?.created_at}
                description={item?.content?.description}
                domain={item.domain}
                domainImage={item.domain.image}
                image={item?.content?.image}
                title={item?.content?.title}
                url={item?.content?.url}
              />
              <View style={styles.footerWrapper}>
                <Footer
                  disableComment={true}
                  statusVote={voteStatus}
                  totalComment={totalComment}
                  totalVote={totalVote}
                  onPressDownVote={onPressDownVoteHandle}
                  onPressUpvote={onPressUpvoteNew}
                  onPressBlock={blockNews}
                />
              </View>
            </View>
          </View>
          {isReaction && (
            <ContainerComment
              comments={comments}
              refreshComment={getDomain}
              refreshChildComment={getDomain}
              navigateToReplyView={(data) => navigateToReplyView(data)}
              // refreshComment={refreshNews}
            />
          )}
        </ScrollView>
      ) : null}

      {item && (
        <WriteComment
          postId={dataDomain?.id}
          value={textComment}
          username={item.domain.name}
          onChangeText={(value) => setTextComment(value)}
          onPress={commentParent}
        />
      )}
      <BlockDomainComponent
        ref={blockRef}
        domain={item.domain.name}
        domainId={item.domain.domain_page_id}
      />
    </View>
  );
};

export default DetailDomainScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    paddingBottom: 75
    // paddingTop: 8,
  },
  containerText: {
    marginTop: 20,
    marginHorizontal: 22
  },
  textDesc: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    color: COLORS.black
  },
  more: {
    color: COLORS.blueZaffre,
    fontFamily: fonts.inter[400],
    fontSize: 14
  },
  content: {
    width,
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.5,
    backgroundColor: COLORS.white
  },
  gap: {height: 16},
  footerWrapper: {
    height: 52
  }
});
