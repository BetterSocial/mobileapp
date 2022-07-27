import * as  React from 'react';
import { StatusBar, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import BlockComponent from '../../components/BlockComponent';
import BlockDomain from '../../components/Blocking/BlockDomain';
import Empty from './elements/Empty';
import MemoizedListComponent from './MemoizedListComponent';
import Navigation from './elements/Navigation';
import ProfileTiktokScroll from '../ProfileScreen/elements/ProfileTiktokScroll';
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
import { setTopicFeedByIndex, setTopicFeeds } from '../../context/actions/feeds';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';

const TopicPageScreen = (props) => {
  const route = useRoute();
  const [idLt, setIdLt] = React.useState('');
  const [topicName, setTopicName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [userId, setUserId] = React.useState('');
  const [topicId, setTopicId] = React.useState('');
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const feeds = feedsContext.topicFeeds;
  const [isFollow, setIsFollow] = React.useState(false);
  const [userTopicName, setUserTopicName] = React.useState('');

  const refBlockComponent = React.useRef();
  const refBlockDomain = React.useRef();
  const refReportDomain = React.useRef();
  const [headerHeightRef, setHeaderHeightRef] = React.useState(0)


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
        console.log(route.params.id)
        const id = convertString(route.params.id, 'topic_', '');
        console.log('id: ', id);
        const topicName = convertString(id, '-', ' ')
        setTopicName(topicName);
        console.log('topicName: ', topicName);

        const name = capitalizeFirstText(id);
        const newName = convertString(name, '-', ' ');
        console.log('new Name: ', newName);
        setUserTopicName(newName);
        const query = `?name=${convertString(topicName, '-', ' ')}`;
        const [
          _resultGetTopicPages,
          _resultGetUserTopic,
        ] = await Promise.all([
          getTopicPages(topicName),
          getUserTopic(query)
        ]
        )
        setTopicId(id);
        setTopicFeeds(_resultGetTopicPages.data, dispatch);
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
      const {data} = result;
      setTopicFeeds([...feeds, ...data], dispatch);
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
      const data = {
        name: userTopicName
      }
      const result = await putUserTopic(data);
      setIsFollow(result.data);
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }


  const onNewPollFetched = (newPolls, index) => {
    setTopicFeedByIndex(
      {
        index,
        singleFeed: newPolls,
      },
      dispatch,
    );
  };

  const onPressDomain = (item) => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    props.navigation.navigate('DomainScreen', param);
  };

  const onEndReach = () => {
    refreshingData(feeds[feeds.length - 1]?.id);
  };

  const onPress = (item, index) => {
    props.navigation.navigate('PostDetailPage', {
      index,
      isalreadypolling: item.isalreadypolling,
    });
  };

  const onPressComment = (index) => {
    props.navigation.navigate('PostDetailPage', {
      index,
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
      const data = await getFeedDetail(post.activity_id);
      if (data) {
        setTopicFeedByIndex(
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
      <Navigation domain={topicName} onPress={() => handleFollowTopic()} isFollow={isFollow} />
      <View style={{ flex: 1 }}>
        <ProfileTiktokScroll
          contentHeight={dimen.size.TOPIC_CURRENT_ITEM_HEIGHT}
          data={feeds}
          onEndReach={onEndReach}
          onRefresh={onRefresh}
          refreshing={loading}
          snapToOffsets={(() => {
            const posts = feeds.map((item, index) => headerHeightRef + (index * dimen.size.DOMAIN_CURRENT_HEIGHT))
            // console.log('posts')
            // console.log(posts)
            return [headerHeightRef, ...posts]
          })()}>
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
        </ProfileTiktokScroll>


      </View>
      <BlockComponent ref={refBlockComponent} refresh={refreshingData} screen="topic_screen" />
    </View>
  );
};
export default withInteractionsManaged(TopicPageScreen);
