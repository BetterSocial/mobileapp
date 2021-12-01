import * as React from 'react';
import {Text, FlatList} from 'react-native';
import Container from '../../../components/Container';
import { getFollowingTopic } from '../../../service/topics';
import DomainList from './RenderList';

const TopicFragmentScreen = ({navigation}) => {
  const [listTopics, setListTopics] = React.useState([])

  const handleGetTopic = async () => {
    const response = await getFollowingTopic()
    if(response.code == 200) {
      if(Array.isArray(response.data)) {
        const newData = response.data.map((topic) => ({name: topic.name, description: null, image: null}))
        setListTopics(newData)
      }
    }
  }

  React.useEffect(() => {
    navigation.setOptions({
      title: `Topics (${listTopics.length})`,
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
        renderItem={({item}) => <DomainList isHashtag item={item} />}
      />
    </Container>
  ) ;
};

export default TopicFragmentScreen;
