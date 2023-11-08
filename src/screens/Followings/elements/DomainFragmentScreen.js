import * as React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {followDomain, getFollowedDomain, unfollowDomain} from '../../../service/domain';
import {linkContextScreenParamBuilder} from '../../../utils/navigation/paramBuilder';
import DomainList from '../../DiscoveryScreenV2/elements/DiscoveryItemList';

const styles = StyleSheet.create({
  mainContainser: {
    flexDirection: 'column'
  },
  containerStyle: {
    flex: 1,
    backgroundColor: 'white'
  }
});

const DomainFragmentScreen = ({navigation}) => {
  const [listFollowDomain, setListFollowDomain] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const getDomainData = async () => {
    setLoading(true);
    const getDomain = await getFollowedDomain();
    if (getDomain.status === 200 && Array.isArray(getDomain.data.data)) {
      const newData = getDomain.data.data.map((domain) => ({
        image: domain.logo,
        name: domain.domain_name,
        description: domain.description,
        domainId: domain.domain_page_id,
        source: 'domain_profile_page'
      }));
      setListFollowDomain(newData);
      return setLoading(false);
    }
    return setLoading(false);
  };

  const handleFollowDomain = async (data) => {
    await followDomain(data);
  };

  const handleUnfollowDomain = async (data) => {
    await unfollowDomain(data);
  };

  const handleUnfollow = (index, data) => {
    const mappingData = listFollowDomain.map((list, listIndex) => {
      if (index === listIndex) {
        return {...list, isunfollowed: true};
      }
      return {...list};
    });
    setListFollowDomain(mappingData);
    handleUnfollowDomain(data);
  };

  const handleFollow = (index, data) => {
    const mappingData = listFollowDomain.map((list, listIndex) => {
      if (index === listIndex) {
        return {...list, isunfollowed: false};
      }
      return {...list};
    });
    setListFollowDomain(mappingData);
    handleFollowDomain(data);
  };

  React.useEffect(() => {
    getDomainData();
  }, []);

  React.useEffect(() => {
    let title = 'Domains';
    if (listFollowDomain.length === 1) {
      title += ` (${listFollowDomain.length})`;
    }
    if (listFollowDomain.length > 1) {
      title = `Domains (${listFollowDomain.length})`;
    }
    navigation.setOptions({
      title
    });
  }, [listFollowDomain.length]);

  const goToDomainPage = (item) => {
    item = {
      ...item,
      og: {
        ...item,
        domain: item.name,
        domain_page_id: item.isunfollowed ? null : item.domainId
      }
    };
    const param = linkContextScreenParamBuilder(item, item.name, item.image, item.domainId);
    navigation.navigate('DomainScreen', param);
  };

  return (
    <FlatList
      data={listFollowDomain}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => (
        <DomainList
          onPressBody={goToDomainPage}
          handleSetFollow={() => handleFollow(index, item)}
          handleSetUnFollow={() => handleUnfollow(index, item)}
          item={item}
        />
      )}
      refreshing={loading}
      onRefresh={getDomainData}
      style={styles.containerStyle}
    />
  );
};

DomainFragmentScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    setOptions: PropTypes.func.isRequired
  }).isRequired
};

export default DomainFragmentScreen;
