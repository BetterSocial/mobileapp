/* eslint-disable default-case */
import * as React from 'react';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import {Dimensions, RefreshControl, StyleSheet} from 'react-native';

import ItemUser from './ItemUser';
import Label from './Label';
import {searchChatUsers} from '../../../service/users';

const VIEW_TYPE_LABEL = 1;
const VIEW_TYPE_DATA = 2;
const {width} = Dimensions.get('screen');

const SearchRecyclerView = ({text, onHandleSelected, followed, setLoading}) => {
  /**
   * @type {[import('../../../../types/service/UserService.typedef').DBUsers[], Function]}
   */
  const [users, setUsers] = React.useState([]);

  const [layoutProvider, setLayoutProvider] = React.useState(null);
  const [refreshing] = React.useState(false);
  const [dataProvider, setDataProvider] = React.useState(null);

  React.useEffect(() => {
    if (text.length < 1) return setUsers([]);
    return searchUsers(text);
  }, [text]);

  const searchUsers = async (queryText) => {
    if (queryText.length < 1) return;
    setLoading(true);

    const response = await searchChatUsers(queryText);
    if (response) {
      if (response.followed.length === 0 && response.moreUsers.length === 0) {
        setUsers([{viewtype: 'label', label: 'No users found'}]);
      } else if (response.followed.length === 0) {
        setUsers([{viewtype: 'label', label: "Users you don't follow"}, ...response.moreUsers]);
      } else if (response.moreUsers.length === 0) {
        setUsers([...response.followed]);
      } else {
        setUsers([
          ...response.followed,
          {viewtype: 'label', label: "Users you don't follow"},
          ...response.moreUsers
        ]);
      }
    }

    setLoading(false);
  };

  React.useEffect(() => {
    if (users.length > 0) {
      const dProvider = new DataProvider((row1, row2) => row1 !== row2);
      setLayoutProvider(
        new LayoutProvider(
          (index) => {
            if (users.length < 1) {
              return 0;
            }
            if (users[index].viewtype === 'label') {
              return VIEW_TYPE_LABEL;
            }
            return VIEW_TYPE_DATA;
          },
          (type, dim) => {
            switch (type) {
              case VIEW_TYPE_LABEL:
                dim.width = width;
                dim.height = 40;
                break;

              case VIEW_TYPE_DATA:
                dim.width = width;
                dim.height = 72;
                break;

              default:
                dim.width = width;
                dim.height = 40;
            }
          }
        )
      );
      setDataProvider(dProvider.cloneWithRows(users));
    }
  }, [users]);

  const rowRenderer = (type, item, index, extendedState) => {
    switch (type) {
      case VIEW_TYPE_LABEL:
        return <Label label={item?.label} />;
      case VIEW_TYPE_DATA:
      default:
        return (
          <ItemUser
            photo={item.profile_pic_path}
            bio={item.bio}
            username={item.username}
            followed={extendedState.followed}
            userid={item.user_id}
            onPress={() => handleSelected(item)}
          />
        );
    }
  };

  const handleSelected = (value) => {
    // const copyFollowed = [...followed];
    // const copyUsername = [...usernames];
    // const copyUsers = [...selectedUsers];
    // const index = copyFollowed.indexOf(value.user_id);
    // if (index > -1) {
    //     copyFollowed.splice(index, 1);
    // } else {
    //     copyFollowed.push(value.user_id);
    // }

    // const indexName = copyUsername.indexOf(value.username);
    // if (indexName > -1) {
    //     copyUsername.splice(index, 1);
    // } else {
    //     copyUsername.push(value.username);
    // }

    // const indexSelectedUser = copyUsers.indexOf(value);
    // if (indexSelectedUser > -1) {
    //     copyUsers.splice(indexSelectedUser, 1);
    // } else {
    //     copyUsers.push(value);
    // }

    // setSelectedUsers(copyUsers);
    // setFollowed(copyFollowed);
    // setUsernames(copyUsername);

    onHandleSelected(value, true);
  };

  if (dataProvider !== null && layoutProvider !== null)
    return (
      <RecyclerListView
        style={styles.recyclerview}
        layoutProvider={layoutProvider}
        dataProvider={dataProvider}
        extendedState={{
          followed
        }}
        rowRenderer={rowRenderer}
        scrollViewProps={{
          refreshControl: <RefreshControl refreshing={refreshing} onRefresh={() => {}} />
        }}
      />
    );

  return <></>;
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF'
  },
  recyclerview: {
    // height: height - 180,
    flex: 1
  }
});

export default SearchRecyclerView;
