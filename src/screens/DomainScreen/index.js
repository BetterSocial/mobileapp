import * as React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import {useRoute} from '@react-navigation/native';

import Loading from '../Loading';
import Gap from '../../components/Gap';
import Header from './elements/Header';
import Navigation from './elements/Navigation';
import RenderItem from './elements/RenderItem';
import {getDetailDomains, getProfileDomain} from '../../service/domain';

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
      let res = await getDetailDomains(item.og.domain);
      if (res.code === 200) {
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
      <Gap style={styles.height(16)} />

      <FlatList
        data={data}
        renderItem={({item, index}) => {
          if (item.content) {
            return (
              <RenderItem key={index} domain={item} image={profile.logo} />
            );
          }
        }}
        style={styles.list}
        keyExtractor={(i) => i.id}
      />

      <Loading visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {flex: 1},
  container: {
    flex: 1,
    paddingTop: 8,
    backgroundColor: 'white',
  },
  height: (height) => ({
    height: height,
  }),
});

export default DomainScreen;
