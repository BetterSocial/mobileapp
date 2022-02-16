import * as React from 'react';
import Toast from 'react-native-simple-toast';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import DetailDomainScreenContainerComment from '../../components/Comments/DetailDomainScreenContainerComment';
import DetailDomainScreenContent from './elements/DetailDomainScreenContent';
import DetailDomainScreenHeader from './elements/DetailDomainScreenHeader';
import WriteComment from '../../components/Comments/WriteComment';
import { COLORS, SIZES } from '../../utils/theme';
import { DomainHeader, Footer, Gap } from '../../components';
import { createCommentParent } from '../../service/comment';
import {getDomainDetailById} from '../../service/domain'
import { downVoteDomain, upVoteDomain } from '../../service/vote';
import { fonts } from '../../utils/fonts';
import {
  getCountCommentWithChild,
  getCountCommentWithChildInDetailPage,
} from '../../utils/getstream';
import { getMyProfile } from '../../service/profile';
import { getUserId } from '../../utils/users';

const { width, height } = Dimensions.get('window');

const DetailDomainScreen = (props) => {
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


  const initial = () => {
    let reactionCount = item.reaction_counts;
    if (JSON.stringify(reactionCount) !== '{}') {
      let count = 0;
      let comment = reactionCount.comment;
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
      let upvote = reactionCount.upvotes;
      if (upvote !== undefined) {
        count = count + upvote;
      }
      let downvote = reactionCount.downvotes;
      if (downvote !== undefined) {
        count = count - downvote;
      }
      setTotalVote(count);
    }
  };


  React.useEffect(() => {
   
   if(item) {
    initial();
   }
  }, [item]);

  React.useEffect(() => {
    getDomain()
  }, [])

  const getDomain = () => {
    getDomainDetailById(dataDomain.id).then((res) => {
      // console.log(res, dataDomain, 'sabung')
      setItem(res)
    })
  }

  React.useEffect(() => {
    fetchMyProfile();
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
    if(refreshNews && typeof refreshNews === 'function') {
      refreshNews()
    }
  }


const validationStatusVote = () => {
    if (item.reaction_counts !== undefined || null) {
      if (item.latest_reactions.upvotes !== undefined) {
        let upvote = item.latest_reactions.upvotes.filter(
          (vote) => vote.user_id === yourselfId,
        );
        if (upvote !== undefined) {
          setVoteStatus('upvote');
        }
      }

      if (item.latest_reactions.downvotes !== undefined) {
        let downvotes = item.latest_reactions.downvotes.filter(
          (vote) => vote.user_id === yourselfId,
        );
        if (downvotes !== undefined) {
          setVoteStatus('downvote');
        }
      }
    }
  };

  React.useEffect(() => {

    if(item) {
      validationStatusVote();
      setComments(item.latest_reactions.comment)
    }
  }, [item, yourselfId]);

  const fetchMyProfile = async () => {
    var id = getUserId();
    if (id) {
      const result = await getMyProfile(id);
      if (result.code === 200) {
        setDataProfile(result.data);
        setLoading(false);
      }
      setLoading(false);
    }
  };

  const onComment = () => {
    commentParent();
  };

  const commentParent = async () => {
    try {
      if (textComment.trim() !== '') {
        let data = await createCommentParent(textComment, item.id);
        setComments([...comments, data.data])
        console.log(data, 'siban')
        if (data.code === 200) {
          setTextComment('');
          // Toast.show('Comment successful', Toast.LONG);
        } else {
          Toast.show('Failed Comment', Toast.LONG);
        }
      } else {
        Toast.show('Comments are not empty', Toast.LONG);
      }
    } catch (e) {
      Toast.show('Failed Comment', Toast.LONG);
    }
  };

  console.log(comments, 'suryana')

  const onPressUpvoteNew = async () => {
    await upVoteDomain({
      activity_id: item.id,
      status: !statusUpvote,
      feed_group: 'domain',
      domain: item.domain.name,
    });
    console.log('masumlam1')
    if (voteStatus === 'none') {
      setVoteStatus('upvote');
      setTotalVote((vote) => vote + 1)
    } 
    if(voteStatus === 'upvote') {
      setVoteStatus('none')
      setTotalVote((vote) => vote - 1)
    }
    if(voteStatus === 'downvote') {
      setVoteStatus('upvote')
      setTotalVote((vote) => vote + 2)
    }
    onRefreshNews()

  }

  const onPressDownVoteHandle = async () => {
    console.log('masumkam')
    console.log(item, 'riban')
    await downVoteDomain({
      activity_id: item.id,
      status: !statusUpvote,
      feed_group: 'domain',
      domain: item.domain.name,
    });
    console.log('masumlam1')
    if (voteStatus === 'none') {
      setVoteStatus('downvote');
      setTotalVote((vote) => vote - 1)
    } 
    if(voteStatus === 'downvote') {
      setVoteStatus('none')
      setTotalVote((vote) => vote + 1)
    }
    if(voteStatus === 'upvote') {
      setVoteStatus('downvote')
      setTotalVote((vote) => vote - 2)
    }
    onRefreshNews()

  }

  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      {item ? <ScrollView showsVerticalScrollIndicator={false} style={{ height: '100%' }}>
        
        <View style={styles.content}>
          <View style={{ paddingHorizontal: 0 }}>
            <DetailDomainScreenHeader
              domain={item.domain.name}
              time={item.content.created_at}
              image={item.domain.image}
              onFollowDomainPressed={() => { }}
            />
          </View>

          <View>
            <DetailDomainScreenContent
              date={item.content.created_at}
              description={item.content.description}
              domain={item.domain}
              domainImage={item.domain.image}
              image={item.content.image}
              title={item.content.title}
              url={item.content.url}
            />
            <View style={styles.footerWrapper}>
              <Footer
                disableComment={true}
                statusVote={voteStatus}
                totalComment={totalComment}
                totalVote={totalVote}
                onPressDownVote={onPressDownVoteHandle}
                onPressUpvote={onPressUpvoteNew}
              />
            </View>
          </View>
        </View>
        {isReaction && (
          <DetailDomainScreenContainerComment
            comments={comments}
            updateParent={getDomain}
          />
        )}
      </ScrollView>  : null}
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
    width: width,
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
