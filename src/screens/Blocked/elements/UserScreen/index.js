import PropTypes from 'prop-types';
import React from 'react';
import {FlatList} from 'react-native';

import BlockedList from '../RenderList';
import useBlockedUser from './hooks/useBlockedUser';
import {COLORS} from '../../../../utils/theme';

const BlockedUserList = (props) => {
  const {navigation} = props;
  const {
    listBlockedUser,
    isLoading,
    userId,
    handleFetchData,
    handleBlockUser,
    handleUnblockUser,
    handleTabbarName
  } = useBlockedUser({navigation});

  const goToDetailUser = (value) => {
    const data = {
      user_id: userId,
      other_id: value.user_id_followed,
      username: value.user.username
    };

    navigation.navigate('OtherProfile', {data});
  };

  React.useEffect(() => {
    handleFetchData();
  }, []);

  React.useEffect(() => {
    handleTabbarName();
  }, [listBlockedUser]);
  return (
    <FlatList
      data={listBlockedUser}
      renderItem={({item}) => (
        <BlockedList
          handleSetBlock={() => handleBlockUser(item)}
          handleSetUnblock={() => handleUnblockUser(item)}
          onPressBody={() => goToDetailUser(item)}
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

BlockedUserList.propTypes = {
  navigation: PropTypes.object
};

export default React.memo(BlockedUserList);
