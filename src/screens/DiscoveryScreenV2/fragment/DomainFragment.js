/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {FlatList, Keyboard, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import PropTypes from 'prop-types';
import DiscoveryTitleSeparator from '../elements/DiscoveryTitleSeparator';
import DomainList from '../elements/DiscoveryItemList';
import FollowingAction from '../../../context/actions/following';
import LoadingWithoutModal from '../../../components/LoadingWithoutModal';
import RecentSearch from '../elements/RecentSearch';
import StringConstant from '../../../utils/string/StringConstant';
import useIsReady from '../../../hooks/useIsReady';
import {COLORS} from '../../../utils/theme';
import {Context} from '../../../context/Store';
import {colors} from '../../../utils/colors';
import {followDomain, unfollowDomain} from '../../../service/domain';
import {fonts} from '../../../utils/fonts';
import {getUserId} from '../../../utils/users';
import DiscoveryAction from '../../../context/actions/discoveryAction';

const FROM_FOLLOWED_DOMAIN = 'fromfolloweddomains';
const FROM_FOLLOWED_DOMAIN_INITIAL = 'fromfolloweddomainsinitial';
const FROM_UNFOLLOWED_DOMAIN = 'fromunfolloweddomains';

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
  searchText,
  withoutRecent = false
}) => {
  const navigation = useNavigation();
  const [myId, setMyId] = React.useState('');
  const [discovery, discoveryDispatch] = React.useContext(Context).discovery;
  const [, followingDispatch] = React.useContext(Context).following;

  const isReady = useIsReady();

  const route = useRoute();

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

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setMyId(id);
      }
    };
    parseToken();
  }, []);

  const __handleOnPressDomain = (item) => {
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

  const __handleFollow = async (from, willFollow, item, index) => {
    handleDomain(from, willFollow, item, index);
    const data = {
      domainId: item.domain_id_followed,
      source: 'discoveryScreen'
    };
    if (willFollow) {
      try {
        await followDomain(data);
      } catch (e) {
        handleDomain(from, !willFollow, item, index);
      }
    } else {
      try {
        await unfollowDomain(data);
      } catch (e) {
        handleDomain(from, !willFollow, item, index);
      }
    }
    if (searchText.length > 0) fetchData();
  };

  const renderRecentSearch = (index) => {
    return (
      index === 0 &&
      !withoutRecent && (
        <RecentSearch
          shown={isFirstTimeOpen}
          setSearchText={setSearchText}
          setIsFirstTimeOpen={setIsFirstTimeOpen}
        />
      )
    );
  };

  const renderItem = ({from, item, index}) => {
    if (item.separator) {
      return (
        <>
          {renderRecentSearch(index)}
          <DiscoveryTitleSeparator text="Suggested Domains" key="domain-title-separator" />
        </>
      );
    }

    return (
      <>
        {renderRecentSearch(index)}
        <View style={styles.domainContainer}>
          {(route.name === 'Followings' && item.user_id_follower !== null) ||
          route.name !== 'Followings' ? (
            <DomainList
              isDomain={true}
              onPressBody={() => __handleOnPressDomain(item)}
              handleSetFollow={() => __handleFollow(from, true, item, index)}
              handleSetUnFollow={() => __handleFollow(from, false, item, index)}
              item={{
                name: item.domain_name,
                image: item.logo,
                isunfollowed: !item.following,
                description: item.short_description || null
              }}
            />
          ) : null}
        </View>
      </>
    );
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
          ...followingDomains.map((item, index) => ({
            ...item,
            user_id_follower: item.user_id_follower
          })),
          {separator: true},
          ...unfollowingDomains.map((item, index) => ({
            ...item,
            user_id_follower: item.user_id_follower
          }))
        ]
      : [...newMapFollowedDomain, {separator: true}, ...newMapUnfollowedDomain];

    return (
      <FlatList
        onMomentumScrollBegin={handleScroll}
        contentContainerStyle={{paddingBottom: 100}}
        data={data}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({index, item}) =>
          renderItem({
            from: isFirstTimeOpen
              ? FROM_FOLLOWED_DOMAIN_INITIAL
              : index > newMapFollowedDomain.length
              ? FROM_UNFOLLOWED_DOMAIN
              : FROM_FOLLOWED_DOMAIN,
            item,
            index
          })
        }
        onEndReached={() => fetchData()}
        onEndReachedThreshold={0.6}
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
    backgroundColor: colors.white
  },
  noDataFoundContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center'
  },
  noDataFoundText: {
    alignSelf: 'center',
    justifyContent: 'center',
    fontFamily: fonts.inter[600]
  },
  unfollowedHeaderContainer: {
    backgroundColor: COLORS.lightgrey,
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
