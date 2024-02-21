import React from 'react';
import {FlatList} from 'react-native';

import BlockedList from '../RenderList';
import useDomainBlock from './hooks/useDomainBlock';
import {COLORS} from '../../../../utils/theme';

const BlockedDomainList = (props) => {
  const {navigation} = props;
  const {
    handleBlockDomain,
    handleUnblockDomain,
    handleFetchData,
    handleTabbarName,
    isLoading,
    listBlockedDomaun
  } = useDomainBlock({navigation});

  const goToDetailDomain = (data) => {
    navigation.navigate('DomainScreen', {
      item: {
        domain: {
          ...data
        },
        content: {
          ...data
        },
        og: {
          domain: data.name
        }
      }
    });
  };

  React.useEffect(() => {
    handleFetchData();
  }, []);

  React.useEffect(() => {
    handleTabbarName();
  }, [listBlockedDomaun]);

  return (
    <FlatList
      data={listBlockedDomaun}
      renderItem={({item}) => (
        <BlockedList
          handleSetBlock={() => handleBlockDomain(item)}
          handleSetUnblock={() => handleUnblockDomain(item)}
          onPressBody={() => goToDetailDomain(item)}
          item={item}
        />
      )}
      keyExtractor={(item, index) => index.toString()}
      refreshing={isLoading}
      onRefresh={handleFetchData}
      style={{backgroundColor: COLORS.white}}
    />
  );
};

export default React.memo(BlockedDomainList);
