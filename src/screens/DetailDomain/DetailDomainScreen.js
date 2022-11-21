import * as React from 'react';
import Toast from 'react-native-simple-toast';
import {
  Dimensions,
  InteractionManager,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

import BlockDomainComponent from '../../components/BlockDomain';
import ContainerComment from '../../components/Comments/ContainerComment';
import DetailDomainScreenContent from './elements/DetailDomainScreenContent';
import DetailDomainScreenHeader from './elements/DetailDomainScreenHeader';
import Loading from '../Loading';
import StringConstant from '../../utils/string/StringConstant';
import WriteComment from '../../components/Comments/WriteComment';
import { COLORS } from '../../utils/theme';
import { Footer } from '../../components';
import { createCommentParent } from '../../service/comment';
import { downVoteDomain, upVoteDomain } from '../../service/vote';
import { fonts } from '../../utils/fonts';
import {
  getCountCommentWithChildInDetailPage,
} from '../../utils/getstream';
import { getDomainDetailById } from '../../service/domain'
import { getMyProfile } from '../../service/profile';
import { getUserId } from '../../utils/users';

const { width, height } = Dimensions.get('window');

const DetailDomainScreen = (props) => {
  const { navigation } = props
  const dataDomain = props.route.params && props.route.params.item
  const refreshNews = props.route.params && props.route.params.refreshNews
  const [dataProfile, setDataProfile] = React.useState({});
  const [item, setItem] = React.useState(null);
  const [isReaction, setReaction] = React.useState(false);
  const [textComment, setTextComment] = React.useState('');
  const [typeComment, setTypeComment] = React.useState('parent');
  const [totalComment, setTotalComment] = React.useState(0);
  const [totalVote, setTotalVote] = React.useState(0);
  const [yourselfId, setYourselfId] = React.useState('');
  const [voteStatus, setVoteStatus] = React.useState('none');
  const [statusUpvote, setStatusUpvote] = React.useState(false);
  const [comments, setComments] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const blockRef = React.useRef(null)
  const initial = () => {
    const reactionCount = item.reaction_counts;
    if (JSON.stringify(reactionCount) !== '{}') {
      let count = 0;
      const { comment } = reactionCount;
      if (comment !== undefined) {
        if (comment > 0) {
          setReaction(true);
          setTotalComment(
            getCountCommentWithChildInDetailPage(
              props.route.params.item.latest_reactions,
            ),
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

  const getDomain = () => {
    setIsLoading(true)
    const id = dataDomain?.og?.news_feed_id || dataDomain?.id
    getDomainDetailById(id).then((res) => {
      setItem(res)
      setIsLoading(false)
    })
  }

  React.useEffect(() => {
    fetchMyProfile();
    getDomain()
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
      refreshNews()
    }
  }


  const validationStatusVote = () => {
    if (item.reaction_counts !== undefined || null) {
      if (item.latest_reactions.upvotes !== undefined) {
        const upvote = item.latest_reactions.upvotes.filter(
          (vote) => vote.user_id === yourselfId,
        );
        if (upvote !== undefined) {
          setVoteStatus('upvote');
        }
      }

      if (item.latest_reactions.downvotes !== undefined) {
        const downvotes = item.latest_reactions.downvotes.filter(
          (vote) => vote.user_id === yourselfId,
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
      setComments(item.latest_reactions.comment)
    }
  }, [item, yourselfId]);

  const fetchMyProfile = async () => {
    const id = await getUserId();
    if (id) {
      const result = await getMyProfile(id);
      if (result.code === 200) {
        setDataProfile(result.data);
        // setLoading(false);
      }
      // setLoading(false);
    }
  };

  const onComment = () => {
    commentParent();
  };

  const commentParent = async () => {
    try {
      if (textComment.trim() !== '') {
        const data = await createCommentParent(textComment, item.id, '', false);
        setComments([...comments, data.data])
        if (data.code === 200) {
          setTextComment('');
          // Toast.show('Comment successful', Toast.LONG);
        } else {
          Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
        }
      } else {
        // Toast.show('Comments are not empty', Toast.LONG);
      }
    } catch (e) {
      Toast.show(StringConstant.generalCommentFailed, Toast.LONG);
    }
  };

  const onPressUpvoteNew = async () => {
    await upVoteDomain({
      activity_id: item.id,
      status: !statusUpvote,
      feed_group: 'domain',
      domain: item.domain.name,
    });
    if (voteStatus === 'none') {
      setVoteStatus('upvote');
      setTotalVote((vote) => vote + 1)
    }
    if (voteStatus === 'upvote') {
      setVoteStatus('none')
      setTotalVote((vote) => vote - 1)
    }
    if (voteStatus === 'downvote') {
      setVoteStatus('upvote')
      setTotalVote((vote) => vote + 2)
    }
    onRefreshNews()

  }

  const onPressDownVoteHandle = async () => {
    await downVoteDomain({
      activity_id: item.id,
      status: !statusUpvote,
      feed_group: 'domain',
      domain: item.domain.name,
    });
    if (voteStatus === 'none') {
      setVoteStatus('downvote');
      setTotalVote((vote) => vote - 1)
    }
    if (voteStatus === 'downvote') {
      setVoteStatus('none')
      setTotalVote((vote) => vote + 1)
    }
    if (voteStatus === 'upvote') {
      setVoteStatus('downvote')
      setTotalVote((vote) => vote - 2)
    }
    onRefreshNews()

  }

  const updateParentPost = (data) => {
    setItem(data)
  }

  const navigateToReplyView = (data) => {
    navigation.navigate('ReplyComment', { ...data, page: props.route.name, updateParent: updateParentPost });
  }

  const blockNews = () => {
    blockRef.current.refBlockDomain.current.open()
  };
  if (isLoading) return <Loading />
  if (!item?.domain) return <View />

  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      <SafeAreaView>
        <DetailDomainScreenHeader
          domain={item.domain.name}
          time={item?.content?.created_at}
          image={item.domain.image}
          onFollowDomainPressed={() => { }}
          score={dataDomain?.score}
          follower={dataDomain?.follower}
        />
      </SafeAreaView>

      {item ? <ScrollView showsVerticalScrollIndicator={false} style={{ height: '100%' }}>
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
            navigateToReplyView={(data) => navigateToReplyView(data, updateParentPost)}
          // refreshComment={refreshNews}
          />
        )}
      </ScrollView> : null}

      {item && (
        <WriteComment
          value={textComment}
          username={item.domain.name}
          onChangeText={(value) => setTextComment(value)}
          onPress={() => {
            onComment();
          }}
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
    backgroundColor: '#fff',
    flex: 1,
    paddingBottom: 75,
    // paddingTop: 8,
  },
  containerText: {
    marginTop: 20,
    marginHorizontal: 22,
  },
  textDesc: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    color: '#000',
  },
  more: {
    color: '#0e24b3',
    fontFamily: fonts.inter[400],
    fontSize: 14,
  },
  content: {
    width,
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  gap: { height: 16 },
  footerWrapper: {
    height: 52,
    borderBottomColor: COLORS.gray1,
    borderBottomWidth: 0.5,
    marginBottom: -16,
  },
});
