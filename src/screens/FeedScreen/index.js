import * as React from 'react';
import Toast from 'react-native-simple-toast';
import analytics from '@react-native-firebase/analytics';
import {StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import BlockDomain from '../../components/Blocking/BlockDomain';
import BlockPostAnonymous from '../../components/Blocking/BlockPostAnonymous';
import BlockUser from '../../components/Blocking/BlockUser';
import LoadingWithoutModal from '../../components/LoadingWithoutModal';
import RenderListFeed from './RenderList';
import ReportDomain from '../../components/Blocking/ReportDomain';
import ReportPostAnonymous from '../../components/Blocking/ReportPostAnonymous';
import ReportUser from '../../components/Blocking/ReportUser';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import TiktokScroll from '../../components/TiktokScroll';
import {ButtonNewPost} from '../../components/Button';
import {Context} from '../../context';
import {blockAnonymous, blockUser} from '../../service/blocking';
import {downVote, upVote} from '../../service/vote';
import {getFeedDetail, getMainFeed} from '../../service/post';
import {getUserId} from '../../utils/users';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {setFeedByIndex, setMainFeeds} from '../../context/actions/feeds';

const FeedScreen = (props) => {
  const navigation = useNavigation();
  const flatListRef = React.useRef();
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
      getDataFeeds('');
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
      getDataFeeds('');
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
    setLoading(true);
    try {
      let query = '';
      if (id !== '') {
        query = '?id_lt=' + id;
      }

      const dataFeeds = await getMainFeed(query);
      if (dataFeeds.data.length > 0) {
        let data = dataFeeds.data;
        if (id === '') {
          setMainFeeds(data, dispatch);
        } else {
          setMainFeeds([...feeds, ...data], dispatch);
        }
        setCountStack(data.length);
      }
      setLoading(false);
      setInitialLoading(false);
      setTime(new Date());
      setLoading(false);
    } catch (e) {
      setInitialLoading(false);
      setLoading(false);
    }
  };

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
  }, []);

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
      console.log(data, 'suakik')
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
    const processVote = await upVote(post);
    updateFeed(post, index);
    return processVote;
  };
  const setDownVote = async (post, index) => {
    const processVote = await downVote(post);
    updateFeed(post, index);
    return processVote
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

  const onPressDomain = (item) => {
    let param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    props.navigation.navigate('DomainScreen', param);
  };

  const onEndReach = () => {
    getDataFeeds(feeds[feeds.length - 1].id);
  };

  const onPress = (item, index) => {
    props.navigation.navigate('PostDetailPage', {
      index: index,
      isalreadypolling: item.isalreadypolling,
    });
  };

  const onPressComment = (index) => {
    props.navigation.navigate('PostDetailPage', {
      index: index,
    });
  };

  const onPressBlock = (value) => {
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
  };

  const onRefresh = () => {
    getDataFeeds('');
  };

  return (
      <View style={styles.container} forceInset={{top: 'always'}}>
      <TiktokScroll
        data={feeds}
        onEndReach={onEndReach}
        onRefresh={onRefresh}
        refreshing={loading}>
        {({item, index}) => (
          <RenderListFeed
            item={item}
            onNewPollFetched={onNewPollFetched}
            index={index}
            onPressDomain={onPressDomain}
            onPress={() => onPress(item, index)}
            onPressComment={() => onPressComment(index)}
            onPressBlock={() => onPressBlock(item)}
            onPressUpvote={(post) => setUpVote(post, index)}
            selfUserId={yourselfId}
            onPressDownVote={(post) => setDownVote(post, index)}
            loading={loading}
          />
        )}
      </TiktokScroll>
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
    paddingBottom: 0,
  },
});
