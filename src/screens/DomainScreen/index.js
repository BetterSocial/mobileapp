import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import { Dimensions, FlatList, StatusBar, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import BlockDomainComponent from '../../components/BlockDomain';
import Header from './elements/Header';
import Loading from '../Loading';
import LoadingWithoutModal from '../../components/LoadingWithoutModal';
import Navigation from './elements/Navigation';
import ProfileTiktokScroll from '../ProfileScreen/elements/ProfileTiktokScroll';
import RenderItem from './elements/RenderItem';
import ShareUtils from '../../utils/share';
import dimen from '../../utils/dimen';
import { COLORS } from '../../utils/theme';
import { Context } from '../../context';
import { addIFollowByID, setIFollow } from '../../context/actions/news';
import {
  checkBlockDomainPage,
  followDomain,
  getDetailDomains,
  getDomainIdIFollow,
  getProfileDomain,
  unfollowDomain,
} from '../../service/domain';
import { colors } from '../../utils/colors';
import { downVoteDomain, upVoteDomain } from '../../service/vote';
import { getUserId } from '../../utils/users';
import { setDomainData, setProfileDomain, setSelectedLastDomain } from '../../context/actions/domainAction';
import { unblokDomain } from '../../service/blocking';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';

const { height, width } = Dimensions.get('screen');
let headerHeight = 0;

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
  const [isBlocked, setIsBlocked] = React.useState(false)
  const [follow, setFollow] = React.useState(false);
  const [domainStore, dispatchDomain] = React.useContext(Context).domains;
  const [postOffset, setPostOffset] = React.useState(0)

  const tiktokScrollRef = React.useRef(null);
  const [headerHeightRef, setHeaderHeightRef] = React.useState(0)

  // console.log(headerHeightRef)

  let iddomain = dataDomain.content.domain_page_id;
  const [dataFollow] = React.useState({
    domainId: iddomain,
    source: 'domain_page',
  });

  const [news, dispatch] = React.useContext(Context).news;
  let { ifollow } = news;

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
  }, []);

  React.useEffect(() => {
    checkBlockDomain()
  }, [])

  const checkBlockDomain = async () => {
    const processCheckBlock = await checkBlockDomainPage(iddomain)
    if (processCheckBlock.data) {
      setIsBlocked(true)
    } else {
      setIsBlocked(false)
    }
  }

  const getIFollow = async () => {
    if (ifollow.length === 0) {
      let res = await getDomainIdIFollow();
      setIFollow(res.data, dispatch);
    } else {
      setFollow(JSON.stringify(ifollow).includes(iddomain));
    }
  };

  const init = async (withLoading = false) => {

    let domainName = dataDomain.og.domain;
    if (domainName != domainStore.selectedLastDomain) {
      if (withLoading) {
        setLoading(true);
      }
      let result = await getProfileDomain(domain);
      if (result.code === 200) {
        setProfile(result.data);
        setProfileDomain(result.data, dispatchDomain);
      } else {
        Toast.show('Domain Not Found', Toast.LONG);
        navigation.goBack();
      }

      await getDomainFeed(postOffset)

      if (withLoading) {
        setLoading(false);
      }
    }

  };

  const getDomainFeed = async (offset) => {
    console.log('postOffset')
    console.log(postOffset)
    let res = await getDetailDomains(`${dataDomain.og.domain}?offset=${postOffset}`);

    console.log('res.data')
    console.log(res.data.length)

    if (res.code === 200) {
      setDomainFollowers(res.followers);
      if(offset === 0) setDomainData([...res.data, {dummy: true}], dispatchDomain)
      else {
        let clonedFeeds = [...feeds]
        clonedFeeds.splice(feeds.length - 1, 0, ...data)
        setDomainData(clonedFeeds, dispatchDomain);
      }
      setSelectedLastDomain(dataDomain.og.domain, dispatchDomain);
      setLoading(false);
    }

    setPostOffset(parseInt(postOffset) + 10)
  }

  React.useEffect(() => {
    init(true);
  }, [dataDomain]);

  // React.useEffect(() => {
  //   const getProfile = async () => {
  //     setProfileDomain({}, dispatchDomain);
  //     let res = await getProfileDomain(domain);
  //     if (res.code === 200) {
  //       setProfile(res.data);
  //       setProfileDomain(res.data, dispatchDomain);
  //     } else {
  //       Toast.show('Domain Not Found', Toast.LONG);
  //       navigation.goBack();
  //     }
  //   };
  //   getProfile();
  // }, [dataDomain]);

  const handleOnPressComment = (itemNews) => {
    navigation.navigate('DetailDomainScreen', { item: itemNews });
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
    } else {
      setDomainFollowers(domainFollowers);
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

      setIFollow(newListFollow, dispatch);
      init();
    } else {
      setDomainFollowers(domainFollowers);
    }
  };

  const checkBlock = (data) => {
    if (!data) {
      setIsBlocked(false)
    } else {
      setIsBlocked(true)
    }
  }

  const onUnblockDomain = async () => {
    await unblokDomain({ domain_page_id: iddomain }).then(() => {
      checkBlockDomain()
    })
  }

  const __handleOnEndReached = () => {
    getDomainFeed(postOffset)
  }

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <LoadingWithoutModal visible={loading} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      <Navigation domain={dataDomain.og.domain} />
      <ProfileTiktokScroll
        ref={tiktokScrollRef}
        data={domainStore.domains}
        onEndReach={__handleOnEndReached}
        snapToOffsets={(() => {
          let posts =  domainStore.domains.map((item, index) => {
            return headerHeightRef + (index * dimen.size.DOMAIN_CURRENT_HEIGHT)
          })
          // console.log('posts')
          // console.log(posts)
          return [headerHeightRef, ...posts]
        })()}
        ListHeaderComponent={
          <View style={{ backgroundColor: 'transparent' }} onLayout={(event) => {
            let headerHeightLayout = event.nativeEvent.layout.height
            setHeaderHeightRef(headerHeightLayout)
          }}>
            <Header
              image={domainImage}
              description={domainStore.profileDomain.short_description}
              domain={dataDomain.og.domain}
              followers={domainFollowers}
              onPressBlock={onReaction}
              onPressUnblock={onUnblockDomain}
              follow={follow}
              handleFollow={handleFollow}
              handleUnfollow={handleUnfollow}
              isBlocked={isBlocked}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
              style={styles.linearGradient}
            />
          </View>
        }>

        {
          ({ item, index }) => {
              let dummyItemHeight = height - dimen.size.DOMAIN_CURRENT_HEIGHT - 44 - 18 - StatusBar.currentHeight;
              if(item.dummy) return <View style={styles.dummyItem(dummyItemHeight)}></View>
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
                follower={domainFollowers}
                handleFollow={handleFollow}
                handleUnfollow={handleUnfollow}
                onPressShare={ShareUtils.shareDomain}
              />
            );
          }}
      </ProfileTiktokScroll>

      {/* <FlatList
        data={data}
        renderItem={({ item, index }) => {
          if (index === 0) {
            return (
              <View key={index} style={{ backgroundColor: 'transparent' }}>
                <Header
                  image={domainImage}
                  description={profile.short_description}
                  domain={dataDomain.og.domain}
                  followers={domainFollowers}
                  onPressBlock={onReaction}
                  onPressUnblock={onUnblockDomain}
                  follow={follow}
                  handleFollow={handleFollow}
                  handleUnfollow={handleUnfollow}
                  isBlocked={isBlocked}
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
      /> */}

      <BlockDomainComponent
        ref={refBlockDomainComponent}
        domain={domain}
        domainId={dataDomain.content.domain_page_id}
        screen="domain_screen"
        getValueBlock={(data) => checkBlock(data)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: { flex: 1 },
  dummyItem : (height) => {
    return {
      height,
      backgroundColor: colors.gray1
    }
  },
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
  containerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

// export default withInteractionsManaged(DomainScreen);
export default DomainScreen;
