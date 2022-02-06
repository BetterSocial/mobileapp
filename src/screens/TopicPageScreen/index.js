import * as  React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import BlockComponent from '../../components/BlockComponent';
import BlockDomain from '../../components/Blocking/BlockDomain';
import Empty from './elements/Empty';
import MemoizedListComponent from './MemoizedListComponent';
import Navigation from './elements/Navigation';
import ReportDomain from '../../components/Blocking/ReportDomain';
import TiktokScroll from '../../components/TiktokScroll/index';
import dimen from '../../utils/dimen';
import { Context } from '../../context';
import { Gap } from '../../components';
import { capitalizeFirstText, convertString } from '../../utils/string/StringUtils';
import { downVote, upVote } from '../../service/vote';
import { getFeedDetail } from '../../service/post';
import { getTopicPages } from '../../service/topicPages';
import { getUserId } from '../../utils/users';
import { getUserTopic, putUserTopic } from '../../service/topics';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import { setFeedByIndex, setMainFeeds } from '../../context/actions/feeds';

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

  const refBlockComponent = React.useRef();
  const refBlockDomain = React.useRef();
  const refReportDomain = React.useRef();


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
        console.log('id: ', id);
        let topicName = convertString(id, '-', ' ')
        setTopicName(topicName);
        console.log('topicName: ', topicName);

        let name = capitalizeFirstText(id);
        let newName = convertString(name, '-', ' ');
        console.log('new Name: ', newName);
        setUserTopicName(newName);
        let query = `?name=${convertString(topicName, '-', ' ')}`;
        let [
          _resultGetTopicPages,
          _resultGetUserTopic,
        ] = await Promise.all([
          getTopicPages(topicName),
          getUserTopic(query)
        ]
        )
        setTopicId(id);
        setMainFeeds(_resultGetTopicPages.data, dispatch);
        console.log(_resultGetUserTopic);
        if (_resultGetUserTopic.data) {
          setIsFollow(true);
        }

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

  // React.useEffect(() => {
  //   const init = async () => {
  //     let id = convertString(route.params.id, 'topic_', '');

  //     let name = capitalizeFirstText(id);
  //     let newName = convertString(name, '-', ' ');
  //     setUserTopicName(newName);
  //     let query = `?name=${convertString(newName, '-', ' ')}`;
  //     let result = await getUserTopic(query);

  //     if (result.data) {
  //       setIsFollow(true);
  //     }
  //   }
  //   init()
  // }, [])


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
    refBlockComponent.current.openBlockComponent(value)
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


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" translucent={false} />
      <Navigation domain={capitalizeFirstText(topicName)} onPress={() => handleFollowTopic()} isFollow={isFollow} />
      <View style={{ flex: 1 }}>
        <TiktokScroll
          contentHeight={dimen.size.TOPIC_CURRENT_ITEM_HEIGHT}
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
      <BlockComponent ref={refBlockComponent} refresh={refreshingData} screen="topic_screen" />
    </View>
  );
};
export default TopicPageScreen;
