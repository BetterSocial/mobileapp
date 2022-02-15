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
  const [statusDownvote, setStatusDowvote] = React.useState(false);

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
    getDomainDetailById(dataDomain.id).then((res) => {
      // console.log(res, dataDomain, 'sabung')
      setItem(res)
    })
  }, [])

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


  const validationStatusVote = () => {
    if (item.reaction_counts !== undefined || null) {
      if (item.latest_reactions.upvotes !== undefined) {
        let upvote = item.latest_reactions.upvotes.filter(
          (vote) => vote.user_id === yourselfId,
        );
        if (upvote !== undefined) {
          setVoteStatus('upvote');
          setStatusUpvote(true);
        }
      }

      if (item.latest_reactions.downvotes !== undefined) {
        let downvotes = item.latest_reactions.downvotes.filter(
          (vote) => vote.user_id === yourselfId,
        );
        if (downvotes !== undefined) {
          setVoteStatus('downvote');
          setStatusDowvote(true);
        }
      }
    }
  };

  React.useEffect(() => {

    if(item) {
      validationStatusVote();
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
    if (typeComment === 'parent') {
      commentParent();
    }
  };

  const commentParent = async () => {
    try {
      if (textComment.trim() !== '') {
        let data = await createCommentParent(textComment, item.id);
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
  const setUpVote = async (post) => {
    upVoteDomain(post);
  };
  const setDownVote = async (post) => {
    downVoteDomain(post);
  };

  const onPressDomain = () => {
    props.navigation.navigate('DomainScreen', {
      item: item,
    });
  };

  console.log(item, 'sentak')

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
                onPressDownVote={() => {
                  setStatusDowvote((prev) => {
                    prev = !prev;
                    setDownVote({
                      activity_id: item.id,
                      status: prev,
                      feed_group: 'domain',
                      domain: item.domain.name,
                    });
                    if (prev) {
                      setVoteStatus('downvote');
                      if (statusUpvote === true) {
                        setTotalVote((p) => p - 2);
                      } else {
                        setTotalVote((p) => p - 1);
                      }
                      setStatusUpvote(false);
                    } else {
                      setVoteStatus('none');
                      setTotalVote((p) => p + 1);
                    }
                    return prev;
                  });
                }}
                onPressUpvote={() => {
                  setStatusUpvote((prev) => {
                    prev = !prev;
                    setUpVote({
                      activity_id: item.id,
                      status: prev,
                      feed_group: 'domain',
                      domain: item.domain.name,
                    });
                    if (prev) {
                      setVoteStatus('upvote');
                      if (statusDownvote === true) {
                        setTotalVote((p) => p + 2);
                      } else {
                        setTotalVote((p) => p + 1);
                      }
                      setStatusDowvote(false);
                    } else {
                      setVoteStatus('none');
                      setTotalVote((p) => p - 1);
                    }
                    return prev;
                  });
                }}
              />
            </View>
          </View>
        </View>
        {isReaction && (
          <DetailDomainScreenContainerComment
            comments={item.latest_reactions.comment}
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
