import * as  React from 'react';
import { View, Text } from 'react-native';
import Navigation from './elements/Navigation';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getTopicPages } from '../../service/topicPages';
import { convertString, capitalizeFirstText } from '../../utils/string/StringUtils';
import { setFeedByIndex, setMainFeeds } from '../../context/actions/feeds';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import { Context } from '../../context';
import { Gap } from '../../components';
import MemoizedListComponent from './MemoizedListComponent';
import { getUserTopic, putUserTopic } from '../../service/topics';
import { getUserId } from '../../utils/users';
import { downVote, upVote } from '../../service/vote';
import { getFeedDetail } from '../../service/post';
import BlockPostAnonymous from '../../components/Blocking/BlockPostAnonymous';
import BlockUser from '../../components/Blocking/BlockUser';
import BlockDomain from '../../components/Blocking/BlockDomain';
import ReportUser from '../../components/Blocking/ReportUser';
import ReportPostAnonymous from '../../components/Blocking/ReportPostAnonymous';
import ReportDomain from '../../components/Blocking/ReportDomain';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import { blockAnonymous, blockUser } from '../../service/blocking';
import TiktokScroll from './TiktokScroll';

const TopicPageScreen = (props) => {
  const route = useRoute();
  const [idLt, setIdLt] = React.useState('');
  const [topicName, setTopicName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [userId, setUserId] = React.useState('');
  const [topicId, setTopicId] = React.useState('');
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  let { feeds } = feedsContext;
  const [isFollow, setIsFollow] = React.useState(false);
  const [userTopicName, setUserTopicName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [postId, setPostId] = React.useState('');


  const refBlockUser = React.useRef();
  const refBlockDomain = React.useRef();
  const refReportUser = React.useRef();
  const refReportDomain = React.useRef();
  const refSpecificIssue = React.useRef();
  const refBlockPostAnonymous = React.useRef();
  const refReportPostAnonymous = React.useRef();


  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setUserId(id);
      }
    };
    parseToken();
  }, []);

  React.useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true)
        let id = convertString(route.params.id, 'topic_', '');
        let name = convertString(id, '-', ' ')
        setTopicName(name);
        console.log(name);
        const result = await getTopicPages(name);
        setTopicId(id);
        setMainFeeds(result.data, dispatch);

        setLoading(false)
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    initData();
  }, []);

  const refreshingData = async () => {
    try {
      setLoading(true);
      const result = await getTopicPages(topicId);
      let data = result.data;
      setMainFeeds([...feeds, ...data], dispatch);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  React.useEffect(() => {
    const init = async () => {
      let id = convertString(route.params.id, 'topic_', '');

      let name = capitalizeFirstText(id);
      let newName = convertString(name, '-', ' ');
      setUserTopicName(newName);
      let query = `?name=${convertString(newName, '-', ' ')}`;
      let result = await getUserTopic(query);

      if (result.data) {
        setIsFollow(true);
      }
    }
    init()
  }, [])


  const handleFollowTopic = async () => {
    try {
      setLoading(true);
      let data = {
        name: userTopicName
      }
      let result = await putUserTopic(data);
      setIsFollow(result.data);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }


  let onNewPollFetched = (newPolls, index) => {
    setFeedByIndex(
      {
        index: index,
        singleFeed: newPolls,
      },
      dispatch,
    );
  };

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
    refreshingData(feeds[feeds.length - 1].id);
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
    if (value.actor.id === userId) {
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
    refreshingData();
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


  const updateFeed = async (post, index) => {
    try {
      let data = await getFeedDetail(post.activity_id);
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


  const onNextQuestion = (v) => {
    setReportOption(v);
    refReportUser.current.close();
    refSpecificIssue.current.open();
  };


  const onSkipOnlyBlock = () => {
    refReportUser.current.close();
    userBlock();
  };


  const onIssue = (v) => {
    refSpecificIssue.current.close();
    setMessageReport(v);
    setTimeout(() => {
      userBlock();
    }, 500);
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


  const onSelectBlockingPostAnonymous = (v) => {
    if (v !== 1) {
      refReportPostAnonymous.current.open();
    } else {
      blockPostAnonymous();
    }
    refBlockPostAnonymous.current.close();
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <Gap height={8} />
      <Navigation domain={capitalizeFirstText(topicName)} onPress={() => handleFollowTopic()} isFollow={isFollow} />
      <View style={{ flex: 1 }}>
        <TiktokScroll
          data={feeds}
          onEndReach={onEndReach}
          onRefresh={onRefresh}
          refreshing={loading}>
          {({ item, index }) => (
            <MemoizedListComponent
              item={item}
              onNewPollFetched={onNewPollFetched}
              index={index}
              onPressDomain={onPressDomain}
              onPress={() => onPress(item, index)}
              onPressComment={() => onPressComment(index)}
              onPressBlock={() => onPressBlock(item)}
              onPressUpvote={(post) => setUpVote(post, index)}
              userId={userId}
              onPressDownVote={(post) => setDownVote(post, index)}
              loading={loading}
            />
          )}
        </TiktokScroll>
      </View>
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
        onSelect={() => { }}
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
export default TopicPageScreen;
