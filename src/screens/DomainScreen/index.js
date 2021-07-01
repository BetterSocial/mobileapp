import * as React from 'react';
import {View, StyleSheet, Dimensions, FlatList} from 'react-native';

import JWTDecode from 'jwt-decode';
import {useRoute, useNavigation} from '@react-navigation/native';

import {upVote, downVote} from '../../service/vote';
import {getAccessToken} from '../../utils/token';

import Gap from '../../components/Gap';
import {getDetailDomains, getProfileDomain} from '../../service/domain';
import Loading from '../Loading';

import Header from './elements/Header';
import Navigation from './elements/Navigation';
import RenderItem from './elements/RenderItem';
import {SIZES} from '../../utils/theme';

const {width, height} = Dimensions.get('window');

const DomainScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [item, setItem] = React.useState(route.params.item);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [domain, setDomain] = React.useState(route.params.item.og.domain);
  const [idFromToken, setIdFromToken] = React.useState('');

  React.useEffect(() => {
    const parseToken = async () => {
      const value = await getAccessToken();
      if (value) {
        const decoded = await JWTDecode(value);
        setIdFromToken(decoded.user_id);
      }
    };
    parseToken();
  }, []);

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

  const handleOnPressComment = (item) => {
    navigation.navigate('DetailDomainScreen', {item: item});
  };

  const upvoteNews = async (news) => {
    // console.log(news);
    upVote(news);
    // if (result.code === 200) {
    //   Toast.show('up vote was successful', Toast.LONG);
    // } else {
    //   Toast.show('up vote failed', Toast.LONG);
    // }
  };

  const downvoteNews = async (news) => {
    console.log(news);
    downVote(news);
    // if (result.code === 200) {
    //   Toast.show('down vote success', Toast.LONG);
    // } else {
    //   Toast.show('down vote failed', Toast.LONG);
    // }
  };

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

      <Gap height={SIZES.base} />

      <FlatList
        data={data}
        renderItem={({item, index}) => {
          if (item.content) {
            return (
              <RenderItem
                key={index}
                item={item}
                image={profile.logo}
                onPressComment={(item) => handleOnPressComment(item)}
                onPressUpvote={(news) => upvoteNews(news)}
                onPressDownVote={(news) => downvoteNews(news)}
                selfUserId={idFromToken}
              />
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
