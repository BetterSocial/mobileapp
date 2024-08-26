import * as React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
import {Dimensions, Share, StatusBar, StyleSheet, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import BlockDomainComponent from '../../components/BlockDomain';
import Header from './elements/Header';
import LoadingWithoutModal from '../../components/LoadingWithoutModal';
import Navigation from './elements/Navigation';
import ProfileTiktokScroll from '../ProfileScreen/elements/ProfileTiktokScroll';
import RenderItem from './elements/RenderItem';
import ShareUtils from '../../utils/share';
import dimen from '../../utils/dimen';
import useViewPostTimeHook from '../FeedScreen/hooks/useViewPostTimeHook';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../libraries/analytics/analyticsEventTracking';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {addIFollowByID, setIFollow} from '../../context/actions/news';
import {
  checkBlockDomainPage,
  followDomain,
  getDetailDomains,
  getDomainIdIFollow,
  getProfileDomain,
  unfollowDomain
} from '../../service/domain';
import {downVoteDomain, upVoteDomain} from '../../service/vote';
import {getUserId} from '../../utils/users';
import {
  setDomainData,
  setProfileDomain,
  setSelectedLastDomain
} from '../../context/actions/domainAction';
import {unblokDomain} from '../../service/blocking';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';

const {height} = Dimensions.get('screen');

const DomainScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const refBlockDomainComponent = React.useRef(null);
  const [dataDomain] = React.useState(route.params.item);
  const [data] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const [domain] = React.useState(route.params.item.og.domain);
  const [idFromToken, setIdFromToken] = React.useState('');
  const [domainFollowers, setDomainFollowers] = React.useState(0);
  const [isBlocked, setIsBlocked] = React.useState(false);
  const [follow, setFollow] = React.useState(false);
  const [domainStore, dispatchDomain] = React.useContext(Context).domains;
  const [postOffset, setPostOffset] = React.useState(0);
  const [postIndex, setPostIndex] = React.useState(0);

  const tiktokScrollRef = React.useRef(null);
  const [headerHeightRef, setHeaderHeightRef] = React.useState(0);

  const {onWillSendViewPostTime} = useViewPostTimeHook(null, null, postIndex, (newIndex) => {
    if (newIndex - 1 < 0) return;
    setPostIndex(newIndex - 1);
  });

  const iddomain = dataDomain.content.domain_page_id;
  const [dataFollow] = React.useState({
    domainId: iddomain,
    source: 'domain_page'
  });

  const [news, dispatch] = React.useContext(Context).news;
  const {ifollow} = news;

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
    checkBlockDomain();
  }, []);

  const checkBlockDomain = async () => {
    const processCheckBlock = await checkBlockDomainPage(iddomain);
    if (processCheckBlock.data) {
      setIsBlocked(true);
    } else {
      setIsBlocked(false);
    }
  };

  const getIFollow = async () => {
    const isFollow = JSON.stringify(ifollow.map((i) => i.domain_id_followed)).includes(iddomain);
    if (!isFollow) {
      const res = await getDomainIdIFollow();
      setIFollow(res.data, dispatch);
    } else {
      setFollow(isFollow);
    }
  };

  const init = async (withLoading = false) => {
    const domainName = dataDomain.og.domain;
    if (withLoading) {
      setLoading(true);
    }
    if (domainName !== domainStore.selectedLastDomain) {
      const result = await getProfileDomain(domain);
      if (result.code === 200) {
        setProfile(result.data);
        setProfileDomain(result.data, dispatchDomain);
      } else {
        Toast.show('Domain Not Found', Toast.LONG);
        navigation.goBack();
      }

      await getDomainFeed(postOffset);
    } else {
      await getDomainFeed(postOffset);
    }

    if (withLoading) {
      setLoading(false);
    }
  };

  const getDomainFeed = async (offset) => {
    const res = await getDetailDomains(`${dataDomain.og.domain}?offset=${postOffset}`);

    if (res.code === 200) {
      setDomainFollowers(res.followers);
      if (offset === 0) setDomainData([...res.data, {dummy: true}], dispatchDomain);
      else if (offset > 0) {
        const clonedFeeds = [...domainStore?.domains];
        clonedFeeds.splice(domainStore?.domains?.length - 1, 0, ...data);
        setDomainData(clonedFeeds, dispatchDomain);
      }
      setSelectedLastDomain(dataDomain.og.domain, dispatchDomain);
      setLoading(false);
    }

    setPostOffset(parseInt(postOffset, 10) + 10);
  };

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
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.DOMAIN_PAGE_POST_REPLY_BUTTON_CLICKED
    );
    navigation.navigate('DetailDomainScreen', {
      item: {
        ...itemNews,
        score: dataDomain?.domain?.credderScore,
        follower: domainFollowers
      }
    });
  };

  const upvoteNews = async (newsParam) => {
    upVoteDomain(newsParam);
  };

  const downvoteNews = async (newsParam) => {
    downVoteDomain(newsParam);
  };
  const onReaction = async () => {
    refBlockDomainComponent.current.openBlockDomain();
  };

  const domainImage = dataDomain.domain ? dataDomain.domain.image : dataDomain.og.domainImage;

  const handleFollow = async (event = AnalyticsEventTracking.UNDEFINED_EVENT) => {
    setFollow(true);

    const newDomainFollowers = domainFollowers + 1;
    setDomainFollowers(newDomainFollowers);
    const res = await followDomain(dataFollow);
    if (res.code === 200) {
      AnalyticsEventTracking.eventTrack(event);
      addIFollowByID(
        {
          domain_id_followed: iddomain
        },
        dispatch
      );
      init();
    } else {
      setDomainFollowers(domainFollowers);
    }
  };

  const handleUnfollow = async (event = AnalyticsEventTracking.UNDEFINED_EVENT) => {
    setFollow(false);

    const newDomainFollowers = domainFollowers - 1;
    setDomainFollowers(newDomainFollowers);
    const res = await unfollowDomain(dataFollow);
    if (res.code === 200) {
      AnalyticsEventTracking.eventTrack(event);
      const newListFollow = ifollow.filter((obj) => obj.domain_id_followed !== iddomain);

      setIFollow(newListFollow, dispatch);
      init();
    } else {
      setDomainFollowers(domainFollowers);
    }
  };

  const checkBlock = (dataParam) => {
    if (!dataParam) {
      setIsBlocked(false);
    } else {
      setIsBlocked(true);
    }
  };

  const onUnblockDomain = async () => {
    await unblokDomain({domain_page_id: iddomain}).then(() => {
      checkBlockDomain();
    });
  };

  const handleOnEndReached = () => {
    getDomainFeed(postOffset);
  };

  const handleOnPressShare = (item) => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.DOMAIN_PAGE_POST_SHARE_BUTTON_CLICKED
    );

    ShareUtils.shareDomain(item);
  };

  const onCloseBlockDomain = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.DOMAIN_PAGE_BLOCK_DOMAIN_BOTTOM_SHEET_CLOSED
    );
  };

  const onBlockAndReportDomain = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.DOMAIN_PAGE_BLOCK_DOMAIN_BLOCK_AND_REPORT_CLICKED
    );
  };

  const onBlockDomainIndefinitely = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.DOMAIN_PAGE_BLOCK_DOMAIN_BLOCK_INDEFINITELY_CLICKED
    );
  };

  const onSkipOnlyBlock = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.DOMAIN_PAGE_BLOCK_DOMAIN_REPORT_INFO_SKIPPED
    );
  };

  const onReportInfoSubmitted = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.DOMAIN_PAGE_BLOCK_DOMAIN_REPORT_INFO_SUBMITTED
    );
  };

  const onReasonsSubmitted = (v) => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.DOMAIN_PAGE_BLOCK_DOMAIN_BLOCK_AND_REPORT_REASON,
      v
    );
  };

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <LoadingWithoutModal visible={loading} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar translucent={false} barStyle={'light-content'} />
      <Navigation domain={dataDomain.og.domain} />
      <ProfileTiktokScroll
        ref={tiktokScrollRef}
        data={domainStore.domains}
        onEndReach={handleOnEndReached}
        onMomentumScrollEnd={(momentumEvent) => {
          onWillSendViewPostTime(momentumEvent, domainStore.domains, {
            scrollEventName: BetterSocialEventTracking.DOMAIN_PAGE_POST_SCROLLED,
            scrollEventItemName: BetterSocialEventTracking.DOMAIN_PAGE_POST_PROPERTIES
          });
        }}
        snapToOffsets={(() => {
          const posts = domainStore.domains.map(
            (item, index) => headerHeightRef + index * dimen.size.DOMAIN_CURRENT_HEIGHT
          );
          return [headerHeightRef, ...posts];
        })()}
        ListHeaderComponent={
          <View
            style={{backgroundColor: COLORS.transparent}}
            onLayout={(event) => {
              const headerHeightLayout = event.nativeEvent.layout.height;
              setHeaderHeightRef(headerHeightLayout);
            }}>
            <Header
              image={domainImage}
              description={domainStore.profileDomain.short_description}
              domain={dataDomain.og.domain}
              followers={domainFollowers}
              onPressBlock={onReaction}
              onPressUnblock={onUnblockDomain}
              follow={follow}
              handleFollow={() =>
                handleFollow(BetterSocialEventTracking.DOMAIN_PAGE_FOLLOW_BUTTON_CLICKED)
              }
              handleUnfollow={() =>
                handleUnfollow(BetterSocialEventTracking.DOMAIN_PAGE_UNFOLLOW_BUTTON_CLICKED)
              }
              isBlocked={isBlocked}
              item={dataDomain}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)']}
              style={styles.linearGradient}
            />
          </View>
        }>
        {({item, index}) => {
          const dummyItemHeight =
            height - dimen.size.DOMAIN_CURRENT_HEIGHT - 44 - 18 - StatusBar.currentHeight;
          if (item.dummy) return <View style={styles.dummyItem(dummyItemHeight)}></View>;
          return (
            <RenderItem
              key={index}
              item={item}
              score={dataDomain.domain.credderScore}
              image={profile.logo}
              onPressComment={(itemNews) => handleOnPressComment(itemNews)}
              onPressUpvote={(newsParam) => upvoteNews(newsParam)}
              onPressDownVote={(newsParam) => downvoteNews(newsParam)}
              selfUserId={idFromToken}
              onPressBlock={onReaction}
              follow={follow}
              follower={domainFollowers}
              handleFollow={() =>
                handleFollow(BetterSocialEventTracking.DOMAIN_PAGE_POST_FOLLOW_BUTTON_CLICKED)
              }
              handleUnfollow={() =>
                handleUnfollow(BetterSocialEventTracking.DOMAIN_PAGE_POST_UNFOLLOW_BUTTON_CLICKED)
              }
              onPressShare={handleOnPressShare}
            />
          );
        }}
      </ProfileTiktokScroll>

      <BlockDomainComponent
        ref={refBlockDomainComponent}
        domain={domain}
        domainId={dataDomain.content.domain_page_id}
        screen="domain_screen"
        getValueBlock={(dataParam) => checkBlock(dataParam)}
        onCloseBlockDomain={onCloseBlockDomain}
        onBlockAndReportDomain={onBlockAndReportDomain}
        onBlockDomainIndefinitely={onBlockDomainIndefinitely}
        onSkipOnlyBlock={onSkipOnlyBlock}
        onReportInfoSubmitted={onReportInfoSubmitted}
        onReasonsSubmitted={onReasonsSubmitted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {flex: 1},
  dummyItem: (heightParam) => ({
    height: heightParam,
    backgroundColor: COLORS.gray110
  }),
  container: {
    flex: 1,
    // backgroundColor: COLORS.gray110,
    backgroundColor: COLORS.almostBlack
  },
  height: (h) => ({
    height: h
  }),
  linearGradient: {
    height: 8
  },
  containerLoading: {flex: 1, justifyContent: 'center', alignItems: 'center'}
});

export default withInteractionsManaged(DomainScreen);
// export default DomainScreen;
