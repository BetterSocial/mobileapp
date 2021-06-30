import * as React from 'react';
import {View, StyleSheet, Dimensions, FlatList} from 'react-native';

import Gap from '../../components/Gap';
import {useRoute} from '@react-navigation/native';
import {getDetailDomains, getProfileDomain} from '../../service/domain';
import Loading from '../Loading';

import Header from './elements/Header';
import Navigation from './elements/Navigation';
import RenderItem from './elements/RenderItem';

const DomainScreen = () => {
  const route = useRoute();
  const [item, setItem] = React.useState(route.params.item);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [domain, setDomain] = React.useState(route.params.item.og.domain);

  React.useEffect(() => {
    const init = async () => {
      setLoading(true);
      console.log(item.og.domain);
      let res = await getDetailDomains(item.og.domain);
      if (res.code === 200) {
        console.log(res.data);
        setData(res.data);
        setLoading(false);
      }
      setLoading(false);
    };
    init();
  }, [item]);

  React.useEffect(() => {
    const getProfile = async () => {
      let res = await getProfileDomain(domain);
      if (res.code === 200) {
        setProfile(res.data);
      }
    };
    getProfile();
  }, [domain]);

  return (
    <View style={styles.container}>
      <Navigation domain={item.og.domain} />
      <Header
        image={profile.logo}
        description={profile.short_description}
        domain={profile.domain_name}
        followers={10}
        onPress={(v) => {
          console.log(v);
        }}
      />
      <Gap style={{height: 16}} />

      <FlatList
        data={data}
        renderItem={({item, index}) => {
          if (item.content) {
            return (
              <RenderItem key={index} domain={item} image={profile.logo} />
            );
          }
        }}
        style={{flex: 1}}
        keyExtractor={(i) => i.id}
      />

      <Loading visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: 'white',
  },
});

export default DomainScreen;
