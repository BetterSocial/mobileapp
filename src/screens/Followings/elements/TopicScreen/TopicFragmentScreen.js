import * as React from 'react';
import {Text, FlatList, StyleSheet} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Container from '../../../../components/Container';
import { getFollowingTopic } from '../../../../service/topics';
import DomainList from '../RenderList';
import SuggestionTopic from './SuggestionTopic';

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 20
  }
})

const TopicFragmentScreen = ({navigation}) => {
  const [listTopics, setListTopics] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const handleGetTopic = async () => {
    setLoading(true)
    const response = await getFollowingTopic()
    if(response.code == 200 && Array.isArray(response.data)) {
      const newData = response.data.map((topic) => ({name: topic.name, description: null, image: null}))
      setListTopics(newData)
      return setLoading(false)
    }
    setLoading(false)
  }

  const handleUnfollow = (index) => {
    const mappingData = listTopics.map((list, listIndex) => {
      if(index === listIndex) {
        return {...list, isunfollowed: true}
      } else {
        return {...list}
      }
    })
    setListTopics(mappingData)
  }

  const handleFollow = (index) => {
    const mappingData = listTopics.map((list, listIndex) => {
      if(index === listIndex) {
        return {...list, isunfollowed: false}
      } else {
        return {...list}
      }
    })
    setListTopics(mappingData)
  }

  React.useEffect(() => {
    let title = "Topic"
    if(listTopics.length === 1) {
      title += ` (${listTopics.length})`
    }
    if(listTopics.length > 1) {
      title = `Topics (${listTopics.length})`
    }
    navigation.setOptions({
      title,
    });
  }, [listTopics.length]);
  React.useEffect(() => {
    handleGetTopic()
  }, [])
  return (
    <Container>
      <FlatList 
        data={listTopics}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => <DomainList handleSetFollow={() => handleFollow(index)} handleSetUnFollow={() => handleUnfollow(index)} isHashtag item={item} />}
        // ListFooterComponent={<SuggestionTopic />}
        contentContainerStyle={styles.flatlistContainer}
        refreshing={loading}
        onRefresh={handleGetTopic}
      />
    </Container>
  ) ;
};

export default TopicFragmentScreen;
