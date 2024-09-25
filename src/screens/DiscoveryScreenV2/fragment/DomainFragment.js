import * as React from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import PropTypes from 'prop-types';
import {FlatList, Keyboard, RefreshControl, StyleSheet, Text, View} from 'react-native';
/* eslint-disable no-underscore-dangle */
import {useNavigation} from '@react-navigation/native';

import DiscoveryAction from '../../../context/actions/discoveryAction';
import DiscoveryTitleSeparator from '../elements/DiscoveryTitleSeparator';
import DomainList from '../elements/DiscoveryItemList';
import FollowingAction from '../../../context/actions/following';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import MemoDomainProfilePictureEmptyState from '../../../assets/icon/DomainProfilePictureEmptyState';
import RecentSearch from '../elements/RecentSearch';
import dimen from '../../../utils/dimen';
import useDiscovery from '../hooks/useDiscovery';
import useDiscoveryScreenAnalyticsHook from '../../../libraries/analytics/useDiscoveryScreenAnalyticsHook';
import useIsReady from '../../../hooks/useIsReady';
import {COLORS} from '../../../utils/theme';
import {Context} from '../../../context/Store';
import {addIFollowByID, setIFollow} from '../../../context/actions/news';
import {followDomain, unfollowDomain} from '../../../service/domain';
import {fonts} from '../../../utils/fonts';

const FROM_FOLLOWED_DOMAIN = 'fromfolloweddomains';
const FROM_FOLLOWED_DOMAIN_INITIAL = 'fromfolloweddomainsinitial';
const FROM_UNFOLLOWED_DOMAIN = 'fromunfolloweddomains';

const SECTIONS = [
  {
    title: 'First',
    content: 'Lorem ipsum...'
  }
];

const AccordionView = ({data, renderItem, setActiveSections, activeSections}) => {
  const renderSectionTitle = () => {
    return <View style={styles.content}></View>;
  };

  const renderHeader = (_, index) => {
    return (
      <DiscoveryTitleSeparator
        withBorderBottom={true}
        key="user-title-separator"
        text="Domains you follow"
        showArrow
        rotateArrow={activeSections?.some((actived) => actived === index)}
      />
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.content}>{data?.map((item, index) => renderItem({index, item}))}</View>
    );
  };

  const updateSections = (activeSectionsParams) => {
    setActiveSections(activeSectionsParams);
  };

  return (
    <Accordion
      sections={SECTIONS}
      activeSections={activeSections}
      renderSectionTitle={renderSectionTitle}
      renderHeader={renderHeader}
      renderContent={renderContent}
      onChange={updateSections}
    />
  );
};

const DomainFragment = ({
  isLoadingDiscoveryDomain,
  isFirstTimeOpen,
  followedDomains,
  unfollowedDomains,
  setFollowedDomains,
  setUnfollowedDomains,
  setSearchText,
  setIsFirstTimeOpen,
  fetchData = () => {},
  fetchSpecificData = () => {},
  searchText,
  withoutRecent = false
}) => {
  const navigation = useNavigation();
  const [discovery, discoveryDispatch] = React.useContext(Context).discovery;
  const [activeSections, setActiveSections] = React.useState([]);

  const [, followingDispatch] = React.useContext(Context).following;
  const [news, newsDispatch] = React.useContext(Context).news;
  const {ifollow} = news;

  const {
    common: {onCommonClearRecentSearch, onCommonRecentItemClicked},
    domain: {onDomainPageOpened, onDomainPageFollowButtonClicked, onDomainPageUnfollowButtonClicked}
  } = useDiscoveryScreenAnalyticsHook();

  const {isRefreshControlShown, setIsRefreshControlShown} = useDiscovery();

  const isReady = useIsReady();

  React.useEffect(() => {
    if (searchText.length === 0) {
      setActiveSections([]);
    } else if (searchText.length >= 0 && followedDomains.length > 0) {
      setActiveSections([0]);
    } else {
      setActiveSections([]);
    }
  }, [searchText, followedDomains]);

  const domains = React.useMemo(() => {
    return discovery.initialDomains.map((item) => ({
      ...item,
      following: item.following !== undefined ? item.following : item.user_id_follower !== null
    }));
  }, [discovery.initialDomains]);
  const newMapFollowedDomain = React.useMemo(() => {
    return followedDomains.map((item) => ({
      ...item,
      following: item.following !== undefined ? item.following : item.user_id_follower !== null
    }));
  }, [followedDomains]);
  const newMapUnfollowedDomain = React.useMemo(() => {
    return unfollowedDomains.map((item) => ({
      ...item,
      following: item.following !== undefined ? item.following : item.user_id_follower !== null
    }));
  }, [unfollowedDomains]);

  const __handleOnPressDomain = (item, section) => {
    const navigationParam = {
      item: {
        content: {
          domain_page_id: item.domain_page_id
        },
        domain: {
          image: item.logo,
          credderScore: item?.credder_score
        },
        og: {
          domain: item.domain_name,
          domainImage: item.logo
        }
      }
    };

    onDomainPageOpened(section);
    navigation.push('DomainScreen', navigationParam);
  };
  const handleScroll = React.useCallback(() => {
    Keyboard.dismiss();
  });

  const handleDomain = async (from, willFollow, item, index) => {
    if (from === FROM_FOLLOWED_DOMAIN_INITIAL) {
      const newFollowedDomains = [...domains];
      const domainIndex = newFollowedDomains.findIndex(
        (domain) => domain.domain_page_id === item.domain_page_id
      );
      newFollowedDomains[domainIndex].following = !!willFollow;
      // newFollowedDomains[domainIndex].user_id_follower = myId;

      const newDomain = newFollowedDomains[domainIndex];
      const newDomainList = discovery.initialDomains.map((domain) => {
        if (domain.domain_page_id === newDomain.domain_page_id) {
          return newDomain;
        }
        return domain;
      });
      FollowingAction.setFollowingDomain(newDomainList, followingDispatch);
      DiscoveryAction.setDiscoveryInitialDomains(newDomainList, discoveryDispatch);
    }
    if (from === FROM_FOLLOWED_DOMAIN) {
      const newFollowedDomains = [...newMapFollowedDomain];
      const domainIndex = newFollowedDomains.findIndex(
        (domain) => domain.domain_name === item.domain_name
      );
      newFollowedDomains[domainIndex].following = !!willFollow;
      // newFollowedDomains[domainIndex].user_id_follower = myId;

      const newDomain = newFollowedDomains[domainIndex];
      setFollowedDomains(
        followedDomains.map((domain) => {
          if (domain.domain_name === newDomain.domain_name) {
            return newDomain;
          }
          return domain;
        })
      );
    }

    if (from === FROM_UNFOLLOWED_DOMAIN) {
      const newUnfollowedDomains = [...newMapUnfollowedDomain];
      const domainIndex = newUnfollowedDomains.findIndex(
        (domain) => domain.domain_name === item.domain_name
      );
      newUnfollowedDomains[domainIndex].following = !!willFollow;
      // newUnfollowedDomains[domainIndex].user_id_follower = myId;

      const newDomain = newUnfollowedDomains[domainIndex];

      setUnfollowedDomains(
        unfollowedDomains.map((domain) => {
          if (domain.domain_name === newDomain.domain_name) {
            return newDomain;
          }
          return domain;
        })
      );
    }
  };

  const __handleFollow = async (from, willFollow, item, index, section) => {
    handleDomain(from, willFollow, item, index);
    const data = {
      domainId: item.domain_id_followed,
      source: 'discoveryScreen'
    };

    if (willFollow) {
      try {
        addIFollowByID(
          {
            domain_id_followed: item.domain_id_followed
          },
          newsDispatch
        );

        await followDomain(data);
        onDomainPageFollowButtonClicked(section);
      } catch (e) {
        handleDomain(from, !willFollow, item, index);
      }
    } else {
      try {
        const newListFollow = ifollow.filter(
          (obj) => obj.domain_id_followed !== item.domain_id_followed
        );
        setIFollow(newListFollow, newsDispatch);

        await unfollowDomain(data);
        onDomainPageUnfollowButtonClicked(section);
      } catch (e) {
        handleDomain(from, !willFollow, item, index);
      }
    }
    if (searchText.length > 0) fetchData();
  };

  const onFlatListRefreshed = async () => {
    setIsRefreshControlShown(true);
    await fetchSpecificData();
    setIsRefreshControlShown(false);
  };

  const renderDefaultImage = () => {
    return (
      <MemoDomainProfilePictureEmptyState
        width={dimen.normalizeDimen(48)}
        height={dimen.normalizeDimen(48)}
      />
    );
  };

  const renderItem = ({from, item, index, section}) => {
    const isFollow = JSON.stringify(ifollow.map((i) => i.domain_id_followed)).includes(
      item.domain_id_followed
    );
    if (item.separator) {
      return (
        <>
          <DiscoveryTitleSeparator text="Suggested Domains" key="domain-title-separator" />
        </>
      );
    }

    return (
      <>
        <View style={styles.domainContainer}>
          <DomainList
            isDomain={true}
            onPressBody={() => __handleOnPressDomain(item, section)}
            handleSetFollow={() => __handleFollow(from, true, item, index, section)}
            handleSetUnFollow={() => __handleFollow(from, false, item, index, section)}
            DefaultImage={renderDefaultImage}
            item={{
              name: item.domain_name,
              image: item.logo,
              isunfollowed: ifollow.length === 0 ? !item.following : !isFollow,
              description: item.short_description || null
            }}
          />
        </View>
      </>
    );
  };

  const renderItemList = ({index, item}) => {
    let result;

    if (isFirstTimeOpen) {
      result = FROM_FOLLOWED_DOMAIN_INITIAL;
    } else if (index > newMapFollowedDomain.length) {
      result = FROM_UNFOLLOWED_DOMAIN;
    } else {
      result = FROM_FOLLOWED_DOMAIN;
    }
    return renderItem({
      from: result,
      item,
      index,
      section: 'suggested-domain'
    });
  };

  const renderDomainItems = () => {
    const followingDomains = [];
    const unfollowingDomains = [];

    domains.forEach((item) => {
      if (item.user_id_follower) {
        followingDomains.push(item);
      } else {
        unfollowingDomains.push(item);
      }
    });
    const data = isFirstTimeOpen
      ? [
          {separator: true},
          ...unfollowingDomains.map((item) => ({
            ...item,
            user_id_follower: item.user_id_follower
          }))
        ]
      : [{separator: true}, ...newMapUnfollowedDomain];

    const firstData = isFirstTimeOpen
      ? followingDomains.map((item) => ({
          ...item,
          user_id_follower: item.user_id_follower
        }))
      : newMapFollowedDomain;

    return (
      <FlatList
        ListHeaderComponent={() => (
          <>
            <RecentSearch
              shown={!withoutRecent || isFirstTimeOpen}
              setSearchText={setSearchText}
              setIsFirstTimeOpen={setIsFirstTimeOpen}
              eventTrack={{
                onClearRecentSearch: () => onCommonClearRecentSearch('domain'),
                onRecentSearchItemClicked: () => onCommonRecentItemClicked('domain')
              }}
            />
            <AccordionView
              data={firstData}
              renderItem={(props) => renderItem({...props, section: 'your-domain'})}
              activeSections={activeSections}
              setActiveSections={setActiveSections}
            />
          </>
        )}
        onMomentumScrollBegin={handleScroll}
        contentContainerStyle={{paddingBottom: 100}}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={(props) => renderItemList({...props, section: 'suggested-domain'})}
        onEndReached={() => fetchData()}
        onEndReachedThreshold={0.6}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshControlShown}
            onRefresh={onFlatListRefreshed}
            tintColor={COLORS.white}
          />
        }
      />
    );
  };

  if (!isReady) return <></>;

  if (isLoadingDiscoveryDomain)
    return (
      <View style={styles.fragmentContainer}>
        <LoadingWithoutModal />
      </View>
    );
  if (followedDomains.length === 0 && unfollowedDomains.length === 0 && !isFirstTimeOpen)
    return (
      <View style={styles.noDataFoundContainer}>
        <Text style={styles.noDataFoundText}>No Domains found</Text>
      </View>
    );

  return <View>{renderDomainItems()}</View>;
};

const styles = StyleSheet.create({
  domainContainer: {
    // paddingVertical: 16,
  },
  fragmentContainer: {
    flex: 1,
    backgroundColor: COLORS.almostBlack
  },
  noDataFoundContainer: {
    flex: 1,
    backgroundColor: COLORS.almostBlack,
    justifyContent: 'center'
  },
  noDataFoundText: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontFamily: fonts.inter[600],
    color: COLORS.white
  },
  unfollowedHeaderContainer: {
    backgroundColor: COLORS.gray110,
    height: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  unfollowedHeaders: {
    fontFamily: fonts.inter[600],
    marginLeft: 20
  }
});

DomainFragment.propTypes = {
  isLoadingDiscoveryDomain: PropTypes.bool,
  isFirstTimeOpen: PropTypes.bool,
  followedDomains: PropTypes.array,
  unfollowedDomains: PropTypes.array,
  setFollowedDomains: PropTypes.func,
  setUnfollowedDomains: PropTypes.func,
  setSearchText: PropTypes.func,
  setIsFirstTimeOpen: PropTypes.func,
  fetchData: PropTypes.func,
  searchText: PropTypes.string,
  withoutRecent: PropTypes.bool
};

export default DomainFragment;
