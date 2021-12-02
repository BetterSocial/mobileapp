import * as React from 'react';
import {Text, FlatList, StyleSheet} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Container from '../../../../components/Container';
import { getFollowingTopic, putUserTopic } from '../../../../service/topics';
import DomainList from '../RenderList';
import SuggestionTopic from './SuggestionTopic';

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 20
  },
  containerStyle: {
    flex: 1, backgroundColor: 'white'
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

  const handleUnfollow = (index, data) => {
    console.log(data, 'unfollow')
    const mappingData = listTopics.map((list, listIndex) => {
      if(index === listIndex) {
        return {...list, isunfollowed: true}
      } else {
        return {...list}
      }
    })
    setListTopics(mappingData)
    updateFollow(data)
  }

  const handleFollow = (index, data) => {
    console.log(data, 'follow')
    const mappingData = listTopics.map((list, listIndex) => {
      if(index === listIndex) {
        return {...list, isunfollowed: false}
      } else {
        return {...list}
      }
    })
    setListTopics(mappingData)
    updateFollow(data)
  }

  const updateFollow = async (data) => {
    const dataSend = {
      name: data.name
    }
    const response = await putUserTopic(dataSend)
    console.log(response, 'sikatman')
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
      <FlatList 
        data={listTopics}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => <DomainList handleSetFollow={() => handleFollow(index, item)} handleSetUnFollow={() => handleUnfollow(index, item)} isHashtag item={item} />}
        // ListFooterComponent={<SuggestionTopic />}
        contentContainerStyle={styles.flatlistContainer}
        refreshing={loading}
        onRefresh={handleGetTopic}
        style={styles.containerStyle}
      />
  ) ;
};

export default TopicFragmentScreen;
