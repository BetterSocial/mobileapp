import * as  React from 'react';
import { View, Text } from 'react-native';
import Navigation from './elements/Navigation';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getTopicPages } from '../../service/topicPages';
import { convertString, capitalizeFirstText } from '../../utils/string/StringUtils';

const TopicPageScreen = () => {
  const route = useRoute();
  console.log(route.params.id);
  const [topicPages, setTopicPages] = React.useState([]);
  const [idLt, setIdLt] = React.useState('');
  const [topicName, setTopicName] = React.useState('');


  const removeTopic = () => {

  }

  React.useEffect(() => {
    const initData = async () => {
      try {
        let id = convertString(route.params.id, 'topic_', '');
        setTopicName(convertString(id, '-', ' '));
        const result = await getTopicPages(id);
        console.log(result.data);
        setTopicPages(result.data);
      } catch (error) {
        console.log(error);
      }
    }

    initData();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Navigation domain={capitalizeFirstText(topicName)} />
      <View style={{ flex: 1 }}>
        <Text>Not implement, in progress</Text>
      </View>
    </View>
  );
};
export default TopicPageScreen;
