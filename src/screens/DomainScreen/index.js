import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import {FlatList, StatusBar, StyleSheet, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import BlockDomainComponent from '../../components/BlockDomain';
import Header from './elements/Header';
import Loading from '../Loading';
import Navigation from './elements/Navigation';
import RenderItem from './elements/RenderItem';
import ShareUtils from '../../utils/share';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {addIFollowByID, setIFollow} from '../../context/actions/news';
import {downVoteDomain, upVoteDomain} from '../../service/vote';
import {
  followDomain,
  getDetailDomains,
  getDomainIdIFollow,
  getProfileDomain,
  unfollowDomain,
} from '../../service/domain';
import {getUserId} from '../../utils/users';

const DomainScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const refBlockDomainComponent = React.useRef(null);
  const [dataDomain, setDataDomain] = React.useState(route.params.item);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [domain, setDomain] = React.useState(route.params.item.og.domain);
  const [idFromToken, setIdFromToken] = React.useState('');
  const [domainFollowers, setDomainFollowers] = React.useState(0);
  const [follow, setFollow] = React.useState(false);
  let iddomain = dataDomain.content.domain_page_id;
  const [dataFollow] = React.useState({
    domainId: iddomain,
    source: 'domain_page',
  });

  const [news, dispatch] = React.useContext(Context).news;
  let {ifollow} = news;

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setIdFromToken(id);
      }
    };
    parseToken();
  }, []);

  React.useEffect(() => {
    getIFollow();
  }, [iddomain, ifollow]);
  const getIFollow = async () => {
    if (ifollow.length === 0) {
      let res = await getDomainIdIFollow();
      setIFollow(res.data, dispatch);
    } else {
      setFollow(JSON.stringify(ifollow).includes(iddomain));
    }
  };

  const init = async (withLoading = false) => {
    if (withLoading) {
      setLoading(true);
    }
    let res = await getDetailDomains(dataDomain.og.domain);
    if (res.code === 200) {
      // console.log('dataDomain.og.domain');
      setDomainFollowers(res.followers);
      setData([{dummy: true}, ...res.data]);
      setLoading(false);
    }
    if (withLoading) {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    init(true);
  }, [dataDomain]);

  React.useEffect(() => {
    const getProfile = async () => {
      console.log('domain');
      console.log(domain);
      let res = await getProfileDomain(domain);
      if (res.code === 200) {
        setProfile(res.data);
      } else {
        Toast.show('Domain Not Found', Toast.LONG);
        navigation.goBack();
      }
    };
    getProfile();
  }, [dataDomain]);

  const handleOnPressComment = (itemNews) => {
    navigation.navigate('DetailDomainScreen', {item: itemNews});
  };

  const upvoteNews = async (news) => {
    upVoteDomain(news);
  };

  const downvoteNews = async (news) => {
    downVoteDomain(news);
  };
  const onReaction = async (v) => {
    refBlockDomainComponent.current.openBlockDomain()
  };

  const domainImage = dataDomain.domain
    ? dataDomain.domain.image
    : dataDomain.og.domainImage;

  const handleFollow = async () => {
    setFollow(true);

    let newDomainFollowers = domainFollowers + 1;
    setDomainFollowers(newDomainFollowers);
    const res = await followDomain(dataFollow);
    if (res.code === 200) {
      addIFollowByID(
        {
          domain_id_followed: iddomain,
        },
        dispatch,
      );
      init();
      console.log('res follow');
    } else {
      setDomainFollowers(domainFollowers);
      console.log('error follow domain');
    }
  };

  const handleUnfollow = async () => {
    setFollow(false);

    let newDomainFollowers = domainFollowers - 1;
    setDomainFollowers(newDomainFollowers);
    const res = await unfollowDomain(dataFollow);
    if (res.code === 200) {
      let newListFollow = await ifollow.filter(function (obj) {
        return obj.domain_id_followed !== iddomain;
      });

      console.log('res unfollow');
      setIFollow(newListFollow, dispatch);
      init();
    } else {
      setDomainFollowers(domainFollowers);
      console.log('error unfollow domain');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      <Navigation domain={dataDomain.og.domain} />
      <FlatList
        data={data}
        renderItem={({item, index}) => {
          if (index === 0) {
            return (
              <View key={index} style={{backgroundColor: 'transparent'}}>
                <Header
                  image={domainImage}
                  description={dataDomain.domain ? dataDomain.domain.info : ''}
                  domain={dataDomain.og.domain}
                  followers={domainFollowers}
                  onPress={onReaction}
                  follow={follow}
                  handleFollow={handleFollow}
                  handleUnfollow={handleUnfollow}
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
                  style={styles.linearGradient}
                />
              </View>
            );
          }

          if (item.content) {
            return (
              <RenderItem
                key={index}
                item={item}
                image={profile.logo}
                onPressComment={(itemNews) => handleOnPressComment(itemNews)}
                onPressUpvote={(news) => upvoteNews(news)}
                onPressDownVote={(news) => downvoteNews(news)}
                selfUserId={idFromToken}
                onPressBlock={() => onReaction(0)}
                follow={follow}
                handleFollow={handleFollow}
                handleUnfollow={handleUnfollow}
                onPressShare={ShareUtils.shareDomain}
              />
            );
          }
        }}
        style={styles.list}
        keyExtractor={(i) => i.id}
      />

      <Loading visible={loading} />
      <BlockDomainComponent 
        ref={refBlockDomainComponent} 
        domain={domain} 
        domainId={dataDomain.content.domain_page_id}
        screen="domain_screen" />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {flex: 1},
  container: {
    flex: 1,
    // backgroundColor: COLORS.gray1,
    backgroundColor: COLORS.white,
  },
  height: (h) => ({
    height: h,
  }),
  linearGradient: {
    height: 8,
  },
});

export default DomainScreen;
