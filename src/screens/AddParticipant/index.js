import * as React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import {RecyclerListView, LayoutProvider, DataProvider} from 'recyclerlistview';

import HeaderContact from '../../components/Header/HeaderContact';
import {ProfileContact} from '../../components/Items';
import {userPopulate} from '../../service/users';
import {SearchContact} from '../../components/Search';
import {Loading} from '../../components';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';

const width = Dimensions.get('screen').width;
const VIEW_TYPE_DATA = 2;

const AddParticipant = ({navigation}) => {
  const [channel] = React.useContext(Context).channel;
  const [isRecyclerViewShown, setIsRecyclerViewShown] = React.useState(false);
  const [followed, setFollowed] = React.useState([]);
  const [layoutProvider, setLayoutProvider] = React.useState(() => {});
  const [dataProvider, setDataProvider] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [groupChatState] = React.useContext(Context).groupChat;
  const {participants} = groupChatState;
  const [filterParams, setFilterParams] = React.useState('');
  const [cacheUser, setCacheUser] = React.useState([]);
  React.useEffect(() => {
    if (dataProvider) {
      setIsRecyclerViewShown(true);
    }
  }, [dataProvider]);

  React.useEffect(() => {
    getUserPopulate();
  }, []);
  const getUserPopulate = async () => {
    try {
      setLoading(true);
      const res = await userPopulate();
      const result = await filterDataUser(res);
      setUsers(result);
      setCacheUser(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  const filterDataUser = (dataUsers) => {
    return dataUsers.filter((itm1) => {
      return !Object.keys(participants).some((itm2) => {
        return itm1.user_id === itm2;
      });
    });
  };

  React.useEffect(() => {
    if (users.length > 0) {
      let dProvider = new DataProvider((row1, row2) => row1 !== row2);
      setLayoutProvider(
        new LayoutProvider(
          (index) => {
            if (users.length < 1) {
              return 0;
            }
            return VIEW_TYPE_DATA;
          },
          (type, dim) => {
            switch (type) {
              case VIEW_TYPE_DATA:
                dim.width = width;
                dim.height = 76;
                break;
              default:
                dim.width = width;
                dim.height = 0;
            }
          },
        ),
      );
      setDataProvider(dProvider.cloneWithRows(users));
    }
  }, [users]);

  const handleSelected = (value) => {
    let copyFollowed = [...followed];
    let index = followed.indexOf(value);
    if (index > -1) {
      copyFollowed.splice(index, 1);
    } else {
      copyFollowed.push(value);
    }
    setFollowed(copyFollowed);
  };
  const updateChannel = async () => {
    if (followed.length !== 0 && channel.channel) {
      try {
        setLoading(true);
        await channel.channel.addMembers(followed);
        setLoading(false);
        navigation.goBack();
      } catch (error) {
        console.log('add member ', error);
        setLoading(false);
      }
    }
  };

  const filterText = (text) => {
    setFilterParams(text);
    if (text) {
      let dataFilter = users.filter((item) => {
        return item.username.includes(text);
      });
      setUsers(dataFilter);
    } else {
      setUsers(cacheUser);
    }
  };
  const rowRenderer = (type, item, index, extendedState) => {
    return (
      <ProfileContact
        select={extendedState.followed.includes(item.user_id)}
        fullname={item.username}
        onPress={() => handleSelected(item.user_id)}
        photo={item.profile_pic_path}
      />
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar translucent={false} />
      <SafeAreaView style={styles.container}>
        <HeaderContact
          title={'Add new participant'}
          containerStyle={styles.containerHeader}
          subTitle={'Next'}
          subtitleStyle={styles.subtitleStyle(followed.length !== 0)}
          onPressSub={() => updateChannel()}
          onPress={() => navigation.goBack()}
        />
        <SearchContact setText={filterText} text={filterParams} />
        {isRecyclerViewShown && (
          <RecyclerListView
            layoutProvider={layoutProvider}
            dataProvider={dataProvider}
            extendedState={{
              followed,
            }}
            rowRenderer={rowRenderer}
          />
        )}
        <Loading visible={loading} />
      </SafeAreaView>
    </View>
  );
};

export default AddParticipant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerHeader: {marginHorizontal: 22},
  subtitleStyle: (isIsset) => ({
    color: isIsset ? COLORS.holyTosca : '#C4C4C4',
  }),
});
