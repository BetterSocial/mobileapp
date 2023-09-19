import * as React from 'react';
import {FlatList, StyleSheet} from 'react-native';

import DomainList from '../RenderList';
import TopicHeader from './TopicHeader';
import useChatClientHook from '../../../../utils/getstream/useChatClientHook';
import {getFollowingTopic} from '../../../../service/topics';
import {Context} from '../../../../context';
import DiscoveryAction from '../../../../context/actions/discoveryAction';

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 20
  },
  containerStyle: {
    flex: 1,
    backgroundColor: 'white'
  }
});

const TopicFragmentScreen = ({navigation}) => {
  const [listTopics, setListTopics] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const {followTopic} = useChatClientHook();
  const [discovery, discoveryDispatch] = React.useContext(Context).discovery;
  const [profile] = React.useContext(Context).profile;

  const handleGetTopic = async () => {
    setLoading(true);
    const response = await getFollowingTopic();
    if (response.code === 200 && Array.isArray(response.data)) {
      const newData = response.data.map((topic) => ({
        name: topic.name,
        description: null,
        image: null
      }));
      setListTopics(newData);
      return setLoading(false);
    }

    return setLoading(false);
  };

  const handleUnfollow = async (index, data) => {
    await updateFollow(data);
    const mappingData = listTopics.map((list, listIndex) => {
      if (index === listIndex) {
        return {...list, isunfollowed: true};
      }
      return {...list};
    });
    setListTopics(mappingData);
    updateDiscoveryData(data, 'unfollow');
  };

  const updateDiscoveryData = (data, type) => {
    const mappingDiscovery = discovery?.initialTopics?.map((discoveryData) => {
      if (data.name === discoveryData?.name) {
        return {
          ...discoveryData,
          user_id_follower: type === 'unfollow' ? null : profile.myProfile?.user_id
        };
      }
      return {
        ...discoveryData
      };
    });
    DiscoveryAction.setDiscoveryInitialTopics(mappingDiscovery, discoveryDispatch);
  };

  const handleFollow = async (index, data) => {
    console.log({discovery}, 'kakak1');
    await updateFollow(data);
    const mappingData = listTopics.map((list, listIndex) => {
      if (index === listIndex) {
        return {...list, isunfollowed: false};
      }
      return {...list};
    });
    setListTopics(mappingData);
    updateDiscoveryData(data, 'follow');
  };

  const updateFollow = async (data) => {
    followTopic(data?.name);
  };

  React.useEffect(() => {
    let title = 'Community';
    if (listTopics.length === 1) {
      title += ` (${listTopics.length})`;
    }
    if (listTopics.length > 1) {
      title = `Communities (${listTopics.length})`;
    }
    navigation.setOptions({
      title
    });
  }, [listTopics.length]);
  React.useEffect(() => {
    handleGetTopic();
  }, []);

  const onPressBody = (item) => {
    navigation.navigate('TopicPageScreen', {id: item.name});
  };

  return (
    <FlatList
      data={listTopics}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => (
        <DomainList
          onPressBody={onPressBody}
          handleSetFollow={() => handleFollow(index, item)}
          handleSetUnFollow={() => handleUnfollow(index, item)}
          isHashtag
          item={item}
        />
      )}
      // ListFooterComponent={<SuggestionTopic />}
      contentContainerStyle={styles.flatlistContainer}
      refreshing={loading}
      onRefresh={handleGetTopic}
      style={styles.containerStyle}
      ListHeaderComponent={<TopicHeader />}
    />
  );
};

export default TopicFragmentScreen;
