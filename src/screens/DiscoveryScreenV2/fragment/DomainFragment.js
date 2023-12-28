/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
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

  const handleDomain = async (from, willFollow, item, index) => {
    if (from === FROM_FOLLOWED_DOMAIN_INITIAL) {
      const newFollowedDomains = [...domains];
      newFollowedDomains[index].following = !!willFollow;
      newFollowedDomains[index].user_id_follower = myId;

      const newDomain = newFollowedDomains[index];
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
      newFollowedDomains[index].following = !!willFollow;
      newFollowedDomains[index].user_id_follower = myId;

      const newDomain = newFollowedDomains[index];
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
      newUnfollowedDomains[index].following = !!willFollow;
      newUnfollowedDomains[index].user_id_follower = myId;

      const newDomain = newUnfollowedDomains[index];

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

  const __renderDiscoveryItem = (from, key, item, index) => {
    return (
      <View key={`${key}-${index}`} style={styles.domainContainer}>
        {route.name === 'Followings' && item.user_id_follower !== null && (
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
        )}
        {route.name !== 'Followings' && (
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
        )}
      </View>
    );
  };

  const __renderDomainItems = () => {
    const followingDomains = [];
    const unfollowingDomains = [];

    domains.forEach((item) => {
      if (item.user_id_follower) {
        followingDomains.push(item);
      } else {
        unfollowingDomains.push(item);
      }
    });
    if (isFirstTimeOpen)
      return [
        followingDomains.map((item, index) =>
          __renderDiscoveryItem(
            FROM_FOLLOWED_DOMAIN_INITIAL,
            'followedDomainDiscovery',
            {...item, user_id_follower: item.user_id_follower},
            index
          )
        )
      ]
        .concat([
          route.name !== 'Followings' && (
            <DiscoveryTitleSeparator text="Suggested Domains" key="domain-title-separator" />
          )
        ])
        .concat(
          unfollowingDomains.map((item, index) =>
            __renderDiscoveryItem(
              FROM_FOLLOWED_DOMAIN_INITIAL,
              'followedDomainDiscovery',
              {...item, user_id_follower: item.user_id_follower},
              index + followingDomains.length
            )
          )
        );

    return (
      <>
        {newMapFollowedDomain.map((item, index) =>
          __renderDiscoveryItem(FROM_FOLLOWED_DOMAIN, 'followedDomainDiscovery', item, index)
        )}

        {route.name !== 'Followings' &&
          unfollowedDomains.length > 0 &&
          followedDomains.length > 0 && (
            <View style={styles.unfollowedHeaderContainer}>
              <Text style={styles.unfollowedHeaders}>{StringConstant.discoveryMoreDomains}</Text>
            </View>
          )}
        {route.name !== 'Followings' &&
          newMapUnfollowedDomain.map((item, index) =>
            __renderDiscoveryItem(FROM_UNFOLLOWED_DOMAIN, 'unfollowedDomainDiscovery', item, index)
          )}
      </>
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

  return (
    <View>
      {!withoutRecent && (
        <RecentSearch
          shown={isFirstTimeOpen}
          setSearchText={setSearchText}
          setIsFirstTimeOpen={setIsFirstTimeOpen}
        />
      )}
      {__renderDomainItems()}
    </View>
  );
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
