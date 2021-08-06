import * as React from 'react';
import {View, StyleSheet, FlatList, Dimensions} from 'react-native';

import JWTDecode from 'jwt-decode';
import {useRoute, useNavigation} from '@react-navigation/native';

import {upVoteDomain, downVoteDomain} from '../../service/vote';
import {getAccessToken} from '../../utils/token';
import Loading from '../Loading';
import Gap from '../../components/Gap';
import Header from './elements/Header';
import Navigation from './elements/Navigation';
import RenderItem from './elements/RenderItem';
import {getDetailDomains, getProfileDomain} from '../../service/domain';
import {COLORS, SIZES} from '../../utils/theme';

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
        setData([{dummy: true}, ...res.data]);
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
    upVoteDomain(news);
    // if (result.code === 200) {
    //   Toast.show('up vote was successful', Toast.LONG);
    // } else {
    //   Toast.show('up vote failed', Toast.LONG);
    // }
  };

  const downvoteNews = async (news) => {
    console.log(news);
    downVoteDomain(news);
    // if (result.code === 200) {
    //   Toast.show('down vote success', Toast.LONG);
    // } else {
    //   Toast.show('down vote failed', Toast.LONG);
    // }
  };

  return (
    <View style={styles.container}>
      <Navigation domain={item.og.domain} />
      <FlatList
        data={data}
        renderItem={({item, index}) => {
          if (index === 0) {
            return (
              <View key={index} style={{backgroundColor: 'transparent'}}>
                <Header
                  image={profile.logo}
                  description={profile.short_description}
                  domain={profile.domain_name}
                  followers={10}
                  onPress={(v) => {
                    console.log(v);
                  }}
                />

                {/* <Gap height={SIZES.base} style={{backgroundColor: COLORS.gray1}}/> */}
              </View>
            );
          }

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
    backgroundColor: 'white',
  },
  height: (height) => ({
    height: height,
  }),
});

export default DomainScreen;
