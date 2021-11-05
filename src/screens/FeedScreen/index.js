import * as React from 'react';
import {View, SafeAreaView, StyleSheet, FlatList} from 'react-native';

import {useNavigation} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import Toast from 'react-native-simple-toast';

import RenderItem from './RenderItem';
import Loading from '../../components/Loading';
import CardStack from '../../components/CardStack';
import {ButtonNewPost} from '../../components/Button';
import BlockUser from '../../components/Blocking/BlockUser';
import BlockDomain from '../../components/Blocking/BlockDomain';
import ReportUser from '../../components/Blocking/ReportUser';
import ReportPostAnonymous from '../../components/Blocking/ReportPostAnonymous';
import ReportDomain from '../../components/Blocking/ReportDomain';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import LoadingWithoutModal from '../../components/LoadingWithoutModal';
import BlockPostAnonymous from '../../components/Blocking/BlockPostAnonymous';
import {downVote, upVote} from '../../service/vote';
import {getFeedDetail, getMainFeed, viewTimePost} from '../../service/post';
import {setFeedByIndex, setMainFeeds} from '../../context/actions/feeds';
import {blockAnonymous, blockUser} from '../../service/blocking';
import {Context} from '../../context';
import {getUserId} from '../../utils/users';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import RenderListFeed from './RenderList';

const FeedScreen = (props) => {
  const navigation = useNavigation();

  const [initialLoading, setInitialLoading] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [countStack, setCountStack] = React.useState(null);
  const [username, setUsername] = React.useState('');
  const [reportOption, setReportOption] = React.useState([]);
  const [messageReport, setMessageReport] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const [postId, setPostId] = React.useState('');
  const [lastId, setLastId] = React.useState('');
  const [yourselfId, setYourselfId] = React.useState('');
  const [time, setTime] = React.useState(new Date());

  const refBlockUser = React.useRef();
  const refBlockDomain = React.useRef();
  const refReportUser = React.useRef();
  const refReportDomain = React.useRef();
  const refSpecificIssue = React.useRef();
  const refBlockPostAnonymous = React.useRef();
  const refReportPostAnonymous = React.useRef();

  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  let {feeds} = feedsContext;

  React.useEffect(() => {
    let isRefresh = props.route.params?.refresh;
    if (isRefresh) {
      getDataFeeds(lastId);
    }
  }, [props.route.params, lastId]);

  const onSelectBlocking = (v) => {
    if (v !== 1) {
      refReportUser.current.open();
    } else {
      userBlock();
    }
    refBlockUser.current.close();
  };

  const onSelectBlockingPostAnonymous = (v) => {
    if (v !== 1) {
      refReportPostAnonymous.current.open();
    } else {
      blockPostAnonymous();
    }
    refBlockPostAnonymous.current.close();
  };

  const onNextQuestion = (v) => {
    setReportOption(v);
    refReportUser.current.close();
    refSpecificIssue.current.open();
  };

  const userBlock = async () => {
    const data = {
      userId: userId,
      postId: postId,
      source: 'screen_feed',
      reason: reportOption,
      message: messageReport,
    };
    let result = await blockUser(data);
    if (result.code === 200) {
      Toast.show(
        'The user was blocked successfully. \nThanks for making BetterSocial better!',
        Toast.LONG,
      );
    } else {
      Toast.show('Your report was filed & will be investigated', Toast.LONG);
    }
    console.log('result block user ', result);
  };

  const blockPostAnonymous = async () => {
    const data = {
      postId: postId,
      source: 'screen_feed',
      reason: reportOption,
      message: messageReport,
    };
    let result = await blockAnonymous(data);
    if (result.code === 201) {
      Toast.show(
        'The user was blocked successfully. \nThanks for making BetterSocial better!',
        Toast.LONG,
      );
    } else {
      Toast.show('Your report was filed & will be investigated', Toast.LONG);
    }
    console.log('result block user ', result);
  };

  const onIssue = (v) => {
    refSpecificIssue.current.close();
    setMessageReport(v);
    setTimeout(() => {
      userBlock();
    }, 500);
  };
  const onSkipOnlyBlock = () => {
    refReportUser.current.close();
    userBlock();
  };

  const getDataFeeds = async (id = '') => {
    setCountStack(null);
    setInitialLoading(true);
    try {
      let query = '';
      if (id !== '') {
        query = '?id_lt=' + id;
      }
      const dataFeeds = await getMainFeed(query);
      if (dataFeeds.data.length > 0) {
        let data = dataFeeds.data;
        setCountStack(data.length);
        setMainFeeds(data, dispatch);
      }
      setInitialLoading(false);
      setTime(new Date());
    } catch (e) {
      console.log(e);
      setInitialLoading(false);
    }
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getDataFeeds(lastId);
  //   }, [lastId]),
  // );

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'FeedScreen',
      screen_name: 'Feed Screen',
    });
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      getDataFeeds(lastId);
    });

    return unsubscribe;
  }, [navigation, lastId]);

  React.useEffect(() => {
    getDataFeeds(lastId);
  }, [lastId]);

  const setDataToState = (value) => {
    if (value.anonimity === true) {
      setUsername('Anonymous');
      setPostId(value.id);
      setUserId(value.actor.id + '-anonymous');
    } else {
      setUsername(value.actor.data.username);
      setPostId(value.id);
      setUserId(value.actor.id);
    }
  };
  const updateFeed = async (post, index) => {
    try {
      let data = await getFeedDetail(post.activity_id);
      console.log('data.data');
      console.log(data);
      if (data) {
        setFeedByIndex(
          {
            singleFeed: data.data,
            index,
          },
          dispatch,
        );
      }
    } catch (e) {
      console.log(e);
    }
  };
  const setUpVote = async (post, index) => {
    await upVote(post);
    // console.log('post');
    // console.log(post);
    updateFeed(post, index);
  };
  const setDownVote = async (post, index) => {
    await downVote(post);
    // console.log('post');
    // console.log(post);
    updateFeed(post, index);
  };

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setYourselfId(id);
      }
    };
    parseToken();
  }, []);

  let onNewPollFetched = (newPolls, index) => {
    setFeedByIndex(
      {
        index: index,
        singleFeed: newPolls,
      },
      dispatch,
    );
  };

  if (initialLoading === true) {
    return (
      <View style={styles.containerLoading}>
        <LoadingWithoutModal visible={initialLoading} />
      </View>
    );
  }

  const sendViewPost = (id, viewTime) => {
    viewTimePost(id, time);
  };

  const renderList = ({item, index}) => <RenderListFeed item={item} />;

  console.log(feeds, 'jamalu');

  return (
    <View style={styles.container} forceInset={{top: 'always'}}>
      <FlatList
        data={feeds}
        renderItem={renderList}
        keyExtractor={(item, index) => {
          return item.id;
        }}
        showsVerticalScrollIndicator={false}
        snapToInterval={20}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.flatlistContainer}
        style={styles.scrollContainer}
      />
      {/* {feeds.length > 0 && (
        <CardStack
          style={styles.content}
          renderNoMoreCards={() => {
            if (countStack === 0) {
              // let id = mainFeeds[mainFeeds.length - 1].id;
              let id = feeds[feeds.length - 1].id;
              setLastId(id);
            }
          }}
          disableTopSwipe={false}
          disableLeftSwipe={true}
          disableRightSwipe={true}
          verticalSwipe={true}
          verticalThreshold={1}
          horizontalSwipe={false}
          disableBottomSwipe={true}
          onSwipedTop={(index) => {
            setCountStack(countStack - 1);
            let now = new Date();
            let diff = now.getTime() - time.getTime();
            sendViewPost(feeds[index].id, diff);
            setTime(new Date());
          }}>
          {feeds.length > 0
            ? feeds.map((item, index) => (
                <RenderItem
                  index={index}
                  key={`${index}${item?.refreshtoken || new Date().valueOf()}`}
                  item={item}
                  onNewPollFetched={onNewPollFetched}
                  onPress={() => {
                    props.navigation.navigate('PostDetailPage', {
                      index: index,
                      isalreadypolling: item.isalreadypolling,
                    });
                  }}
                  onPressBlock={(value) => {
                    if (value.actor.id === yourselfId) {
                      Toast.show("Can't Block yourself", Toast.LONG);
                    } else {
                      setDataToState(value);
                      if (value.anonimity) {
                        refBlockPostAnonymous.current.open();
                      } else {
                        refBlockUser.current.open();
                      }
                    }
                  }}
                  onPressComment={() => {
                    props.navigation.navigate('PostDetailPage', {
                      index: index,
                    });
                  }}
                  onPressUpvote={(post) => setUpVote(post, index)}
                  onPressDownVote={(post) => setDownVote(post, index)}
                  selfUserId={yourselfId}
                  onPressDomain={() => {
                    let param = linkContextScreenParamBuilder(
                      item,
                      item.og.domain,
                      item.og.domainImage,
                      item.og.domain_page_id,
                    );
                    props.navigation.navigate('DomainScreen', param);
                  }}
                  onCardContentPress={() => {
                    props.navigation.navigate('DetailDomainScreen', {
                      item: {
                        domain: {
                          name: item.og.domain,
                          image: item.og.domainImage,
                        },
                        content: {
                          image: item.og.image,
                          title: item.og.title,
                          url: item.og.url,
                          created_at: item.og.date,
                          description: item.og.description,
                        },
                        reaction_counts: item.reaction_counts,
                        latest_reactions: item.latest_reactions,
                      },
                    });
                  }}
                />
              ))
            : null}
        </CardStack>
      )} */}

      <Loading visible={loading} />
      <ButtonNewPost />
      <BlockPostAnonymous
        refBlockPostAnonymous={refBlockPostAnonymous}
        onSelect={(i) => onSelectBlockingPostAnonymous(i)}
      />

      <BlockUser
        refBlockUser={refBlockUser}
        onSelect={(v) => onSelectBlocking(v)}
        username={username}
      />
      <BlockDomain
        refBlockUser={refBlockDomain}
        domain="guardian.com"
        onSelect={() => {}}
      />
      <ReportUser
        refReportUser={refReportUser}
        onSelect={onNextQuestion}
        onSkip={onSkipOnlyBlock}
      />
      <ReportPostAnonymous
        refReportPostAnonymous={refReportPostAnonymous}
        onSelect={onNextQuestion}
        onSkip={onSkipOnlyBlock}
      />
      <ReportDomain refReportDomain={refReportDomain} />
      <SpecificIssue
        refSpecificIssue={refSpecificIssue}
        onPress={onIssue}
        onSkip={onSkipOnlyBlock}
      />
    </View>
  );
};

export default FeedScreen;
const styles = StyleSheet.create({
  container: {flex: 1},
  content: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlistContainer: {
    paddingBottom: 20,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
});
