import * as React from 'react';
import {StatusBar, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import BlockComponent from '../../components/BlockComponent';
import ButtonAddPostTopic from '../../components/Button/ButtonAddPostTopic';
import MemoizedListComponent from './MemoizedListComponent';
import Navigation from './elements/Navigation';
import TiktokScroll from '../../components/TiktokScroll';
import dimen from '../../utils/dimen';
import removePrefixTopic from '../../utils/topics/removePrefixTopic';
import useChatClientHook from '../../utils/getstream/useChatClientHook';
import {Context} from '../../context';
import {TOPIC_LIST} from '../../utils/cache/constant';
import {downVote, upVote} from '../../service/vote';
import {getFeedDetail} from '../../service/post';
import {getSpecificCache, saveToCache} from '../../utils/cache';
import {getTopicPages} from '../../service/topicPages';
import {getUserId} from '../../utils/users';
import {getUserTopic} from '../../service/topics';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {setTopicFeedByIndex, setTopicFeeds, setFeedByIndex} from '../../context/actions/feeds';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import ShareUtils from '../../utils/share';

const TopicPageScreen = (props) => {
  const route = useRoute();
  const {params} = route;
  const [topicName, setTopicName] = React.useState(route?.params?.id);
  const [loading, setLoading] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [userId, setUserId] = React.useState('');
  const [topicId, setTopicId] = React.useState('');
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const feeds = feedsContext.topicFeeds;
  const mainFeeds = feedsContext.feeds;
  const [isFollow, setIsFollow] = React.useState(false);
  const [userTopicName, setUserTopicName] = React.useState('');
  const [tempResponse, setTempResponse] = React.useState({});
  const [offset, setOffset] = React.useState(0);
  const [client] = React.useContext(Context).client;
  const navigation = useNavigation();
  const refBlockComponent = React.useRef();
  const topicWithPrefix = route.params.id;
  const id = removePrefixTopic(topicWithPrefix);
  const {followTopic} = useChatClientHook();

  const initData = async () => {
    try {
      setIsInitialLoading(true);
      // setLoading(true)

      const idLower = id.toLowerCase();
      setTopicName(idLower);
      setUserTopicName(idLower);
      const query = `?name=${idLower}`;
      setTopicId(idLower);
      // eslint-disable-next-line no-underscore-dangle
      // const _resultGetTopicPages = await getTopicPages(id);

      await getSpecificCache(`${TOPIC_LIST}_${id}`, async (cacheTopic) => {
        if (!cacheTopic || cacheTopic?.length === 0) {
          const resultGetTopicPages = await getTopicPages(id);
          saveToCache(`${TOPIC_LIST}_${id}`, resultGetTopicPages);
          setTempResponse(resultGetTopicPages);
          setTopicFeeds(resultGetTopicPages.data, dispatch);
          setOffset(resultGetTopicPages.offset);
          setIsInitialLoading(false);
        } else {
          setTempResponse(cacheTopic);
          setTopicFeeds(cacheTopic.data, dispatch);
          setOffset(cacheTopic.offset);
          setIsInitialLoading(false);
        }
      });

      // eslint-disable-next-line no-underscore-dangle
      const _resultGetUserTopic = await getUserTopic(query);
      if (_resultGetUserTopic.data) {
        setIsFollow(true);
      }

      // setLoading(false)
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
      // setLoading(false);
    }
  };

  React.useEffect(() => {
    if (feeds && Object.keys(tempResponse).length > 0) {
      getSpecificCache(`${TOPIC_LIST}_${id}`, (cache) => {
        const newData = {...cache, data: feeds};
        if (Array.isArray(feeds) && feeds.length > 0) {
          saveToCache(`${TOPIC_LIST}_${id}`, newData);
        }
      });
    }
  }, [JSON.stringify(feeds)]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      initData();
    });

    return unsubscribe;
  }, [navigation]);

  React.useEffect(() => {
    const parseToken = async () => {
      const idUser = await getUserId();
      if (idUser) {
        setUserId(idUser);
      }
    };

    parseToken();
    initData();
    updateCount();
  }, []);

  const markRead = async () => {
    const filter = {type: 'topics', members: {$in: [userId]}, id: route.params.id};
    const sort = [{last_message_at: -1}];
    const thisChannel = await client.client.queryChannels(filter, sort);
    const countRead = await thisChannel[0]?.markRead();
    return countRead;
  };

  React.useEffect(() => {
    if (userId !== '') {
      markRead();
    }
  }, [userId]);

  const updateCount = () => {
    if (params.refreshList && typeof params.refreshList === 'function') {
      params.refreshList();
    }
  };

  const refreshingData = async (offsetParam = offset) => {
    if (offsetParam >= 0) {
      try {
        setLoading(true);
        const result = await getTopicPages(topicId, offsetParam);
        const {data} = result;
        setOffset(result.offset);
        if (result.code === 200) {
          if (offsetParam === 0) {
            saveToCache(`${TOPIC_LIST}_${id}`, result);
            setTopicFeeds(data, dispatch);
          } else {
            const joinData = [...feeds, ...data];
            const newResult = {...result, data: joinData};
            saveToCache(`${TOPIC_LIST}_${id}`, newResult);
            setTopicFeeds(joinData, dispatch);
          }
        }
      } catch (error) {
        if (__DEV__) {
          console.log(error);
        }
        setLoading(false);
      }
    }
    setLoading(false);
  };

  const onDeleteBlockedPostCompleted = async (postId) => {
    const postIndex = feeds.findIndex((item) => item.id === postId);
    const clonedFeeds = [...feeds];
    clonedFeeds.splice(postIndex, 1);
    setTopicFeeds(clonedFeeds, dispatch);
  };

  const onBlockCompleted = async (postId) => {
    onDeleteBlockedPostCompleted(postId);

    await refreshingData(0);
  };

  const handleFollowTopic = async () => {
    try {
      setLoading(true);
      const followed = await followTopic(userTopicName);
      setIsFollow(followed);
      setLoading(false);
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  const onNewPollFetched = (newPolls, index) => {
    setTopicFeedByIndex(
      {
        index,
        singleFeed: newPolls
      },
      dispatch
    );
  };

  const onPressDomain = (item) => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id
    );
    props.navigation.navigate('DomainScreen', param);
  };

  const onEndReach = () => {
    refreshingData(offset);
  };

  const onPress = (item) => {
    setTopicFeeds([], dispatch);
    props.navigation.navigate('PostDetailPage', {
      feedId: item.id,
      isalreadypolling: item.isalreadypolling
    });
  };

  const onPressComment = (item) => {
    props.navigation.navigate('PostDetailPage', {
      feedId: item.id,
      isalreadypolling: item.isalreadypolling
    });
  };

  const onPressBlock = (value) => {
    refBlockComponent.current.openBlockComponent(value);
  };

  const onRefresh = () => {
    refreshingData(0);
  };

  const setUpVote = async (post, index) => {
    const processVote = await upVote(post);
    updateFeed(post, index);
    return processVote;
  };
  const setDownVote = async (post, index) => {
    const processVote = await downVote(post);
    updateFeed(post, index);
    return processVote;
  };

  const onShareCommunity = () => {
    ShareUtils.shareCommunity(topicName);
  };

  const updateFeed = async (post, index) => {
    try {
      const data = await getFeedDetail(post.activity_id);
      if (data) {
        const feedIndex = mainFeeds.findIndex((feed) => feed.id === post.activity_id);
        setTopicFeedByIndex(
          {
            singleFeed: data.data,
            index
          },
          dispatch
        );
        setFeedByIndex(
          {
            singleFeed: data.data,
            index: feedIndex
          },
          dispatch
        );
      }
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
    }
  };

  const renderItem = ({item, index}) => (
    <MemoizedListComponent
      item={item}
      onNewPollFetched={onNewPollFetched}
      index={index}
      onPressDomain={onPressDomain}
      onPress={() => onPress(item, index)}
      onPressComment={() => onPressComment(item)}
      onPressBlock={() => onPressBlock(item)}
      onPressUpvote={(post) => setUpVote(post, index)}
      userId={userId}
      onPressDownVote={(post) => setDownVote(post, index)}
      loading={loading}
      selfUserId={userId}
    />
  );

  if (isInitialLoading) return null;
  return (
    <View
      style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
      <StatusBar barStyle="dark-content" translucent={false} />
      <Navigation
        domain={topicName}
        onShareCommunity={onShareCommunity}
        onPress={() => handleFollowTopic()}
        isFollow={isFollow}
      />
      <View style={{flex: 1}}>
        <TiktokScroll
          contentHeight={dimen.size.TOPIC_CURRENT_ITEM_HEIGHT}
          data={feeds}
          onEndReach={onEndReach}
          onRefresh={onRefresh}
          refreshing={loading}
          renderItem={renderItem}
        />
      </View>
      <ButtonAddPostTopic topicName={topicName} />
      <BlockComponent
        ref={refBlockComponent}
        refresh={onBlockCompleted}
        refreshAnonymous={onDeleteBlockedPostCompleted}
        screen="topic_screen"
      />
      <ButtonAddPostTopic topicName={topicName} />
    </View>
  );
};
export default withInteractionsManaged(TopicPageScreen);
