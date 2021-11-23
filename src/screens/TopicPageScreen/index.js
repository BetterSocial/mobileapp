import * as  React from 'react';
import { View, Text } from 'react-native';
import Navigation from './elements/Navigation';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getTopicPages } from '../../service/topicPages';
import { convertString, capitalizeFirstText } from '../../utils/string/StringUtils';
import TiktokScroll from '../../components/TiktokScroll';
import { setFeedByIndex, setMainFeeds } from '../../context/actions/feeds';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import { Context } from '../../context';
import useFollow from '../../utils/customHook/useFollow';
import { Gap } from '../../components';
import MemoizedListComponent from './RenderList';
import { getUserTopic, putUserTopic } from '../../service/topics';

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
        setTopicName(convertString(id, '-', ' '));
        const result = await getTopicPages(id);
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

  React.useEffect(() => {
    const init = async () => {

      let name = 'Bali'
      let query = `?name=${name}`;
      let result = await getUserTopic(query);

      if (result.data) {
        setIsFollow(true);
      }
    }
    init()
  }, [])

  const handleFollowTopic = async () => {
    try {
      let data = {
        name: 'Bali'
      }
      let result = await putUserTopic(data);
      console.log(result);
      setIsFollow(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  const refreshingData = async (postId) => {
    try {
      setLoading(true);
      const result = await getTopicPages(id);
      let data = result.data;
      setMainFeeds([...feeds, ...data], dispatch);
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
    // if (value.actor.id === userId) {
    //   Toast.show("Can't Block yourself", Toast.LONG);
    // } else {
    //   setDataToState(value);
    //   if (value.anonimity) {
    //     refBlockPostAnonymous.current.open();
    //   } else {
    //     refBlockUser.current.open();
    //   }
    // }
  };

  const onRefresh = () => {
    refreshingData();
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
    </View>
  );
};
export default TopicPageScreen;
