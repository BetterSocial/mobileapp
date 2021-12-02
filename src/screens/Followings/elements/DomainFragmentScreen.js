import * as React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import Container from '../../../components/Container';
import { getFollowedDomain } from '../../../service/domain';
import DomainList from './RenderList';

const styles = StyleSheet.create({
  mainContainser: {
    flexDirection: 'column',
  }
})

const DomainFragmentScreen = ({navigation}) => {

  const [listFollowDomain, setListFollowDomain] = React.useState([])

  const getDomainData = async () => {
    const getDomain = await getFollowedDomain()
    if(getDomain.status == 200 && Array.isArray(getDomain.data.data)) {
      const newData = getDomain.data.data.map((domain) => ({image: domain.logo, name: domain.domain_name, description: domain.description}))
      setListFollowDomain(newData)
    }
  }

  React.useEffect(() => {
    getDomainData()
  }, []);

  React.useEffect(() => {
    let title = "Domain"
    if(listFollowDomain.length === 1) {
      title += ` (${listFollowDomain.length})`
    }
    if(listFollowDomain.length > 1) {
      title = `Domains (${listFollowDomain.length})`
    }
    navigation.setOptions({
      title,
    });
  }, [listFollowDomain.length])

  return (
    <Container>
      <FlatList 
      data={listFollowDomain}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => <DomainList item={item} />}
      />

     
    </Container>
  )
};

export default DomainFragmentScreen;
