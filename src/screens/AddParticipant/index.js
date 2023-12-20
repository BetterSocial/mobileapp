import * as React from 'react';
import moment from 'moment';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import {Dimensions, SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';

import HeaderContact from '../../components/Header/HeaderContact';
import Label from '../ContactScreen/elements/Label';
import Memo_ic_info from '../../assets/icons/ic_info';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {Loading} from '../../components';
import {ProfileContact} from '../../components/Items';
import {SearchContact} from '../../components/Search';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {userPopulate} from '../../service/users';

const {width} = Dimensions.get('screen');
const VIEW_TYPE_LABEL = 1;
const VIEW_TYPE_DATA = 2;

const AddParticipant = ({navigation, route}) => {
  const [channel] = React.useContext(Context).channel;
  const [isRecyclerViewShown, setIsRecyclerViewShown] = React.useState(false);
  const [followed, setFollowed] = React.useState([]);
  const [followedName, setFollowedName] = React.useState([]);
  const [layoutProvider, setLayoutProvider] = React.useState(() => {});
  const [dataProvider, setDataProvider] = React.useState(null);
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [groupChatState] = React.useContext(Context).groupChat;
  const {participants} = groupChatState;
  const [filterParams, setFilterParams] = React.useState('');
  const [cacheUser, setCacheUser] = React.useState([]);
  const [profile] = React.useContext(Context).profile;

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
    }
  };
  const filterDataUser = (dataUsers) => {
    return dataUsers.filter((itm1) => {
      return !participants.some((itm2) => {
        return itm1.user_id === itm2.user_id;
      });
    });
  };

  React.useEffect(() => {
    if (users.length > 0) {
      const dProvider = new DataProvider((row1, row2) => row1 !== row2);
      setLayoutProvider(
        new LayoutProvider(
          (index) => {
            if (users.length < 1) return 0;
            if (users[index]?.viewtype === 'label') return VIEW_TYPE_LABEL;

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
                dim.height = 0;
            }
          }
        )
      );
      setDataProvider(dProvider.cloneWithRows(users));
    }
  }, [users]);

  const handleSelected = (value) => {
    const copyFollowed = [...followed];
    const index = followed.indexOf(value);
    if (index > -1) {
      copyFollowed.splice(index, 1);
    } else {
      copyFollowed.push(value);
    }
    setFollowed(copyFollowed);
  };

  const handleSelectedName = (value) => {
    const copyFollowed = [...followedName];
    const index = followedName.indexOf(value);
    if (index > -1) {
      copyFollowed.splice(index, 1);
    } else {
      copyFollowed.push(value);
    }
    setFollowedName(copyFollowed);
  };

  const updateChannel = async () => {
    if (followed.length !== 0 && channel.channel) {
      try {
        setLoading(true);
        const followedWithRoles = followed.map((item) => {
          return {
            user_id: item,
            channel_role: 'channel_moderator'
          };
        });

        await channel.channel.addMembers(followedWithRoles);
        followedName.forEach(async (name) => {
          await channel.channel.sendMessage(
            {
              text: `${name} was added to this group by ${profile.myProfile.username}`,
              isRemoveMember: true,
              silent: true
            },
            {skip_push: true}
          );
        });
        if (route.params?.refresh && typeof route.params.refresh === 'function') {
          route.params.refresh();
        }
        const previousChannelMembers = channel?.channel?.data?.name?.split(',');
        if (previousChannelMembers.length > 1) {
          await channel?.channel?.update({
            name: [...previousChannelMembers, ...followedName].join(', ')
          });
        }
        setLoading(false);
        navigation.navigate('GroupInfo', {
          from: 'AddParticipant',
          timestamp: moment().unix()
        });
      } catch (error) {
        setLoading(false);
      }
    }
  };

  const filterText = (text) => {
    setFilterParams(text);
    if (text) {
      const dataFilter = users.filter((item) => {
        return item?.username?.toLowerCase()?.includes(text?.toLowerCase());
      });
      if (dataFilter.length < 1) {
        setUsers([{viewtype: 'label', label: 'No users found'}]);
      } else {
        setUsers(dataFilter);
      }
    } else {
      setUsers(cacheUser);
    }
  };

  const onUserSelected = (item) => {
    handleSelected(item.user_id);
    handleSelectedName(item.username);
  };

  const rowRenderer = (type, item, index, extendedState) => {
    switch (type) {
      case VIEW_TYPE_LABEL:
        return <Label containerBgColor="#FFF" label={item?.label} />;
      default:
        return (
          <ProfileContact
            select={extendedState.followed.includes(item.user_id)}
            fullname={item.username}
            onPress={() => onUserSelected(item)}
            photo={item.profile_pic_path}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent={false} />
      <View style={styles.container}>
        <HeaderContact
          title={'Add new participant'}
          containerStyle={styles.containerHeader}
          subTitle={'Next'}
          subtitleStyle={styles.subtitleStyle(followed.length !== 0)}
          onPressSub={() => updateChannel()}
          onPress={() => navigation.goBack()}
        />
        <SearchContact setText={filterText} text={filterParams} />
        <View style={styles.newParticipantWarningContainer}>
          <Memo_ic_info style={styles.newParticipantIcon} />
          <Text style={styles.newParticipantWarningText}>
            New participants will be able to see chat history
          </Text>
        </View>
        {isRecyclerViewShown && (
          <RecyclerListView
            layoutProvider={layoutProvider}
            dataProvider={dataProvider}
            extendedState={{
              followed
            }}
            rowRenderer={rowRenderer}
          />
        )}
        <Loading visible={loading} />
      </View>
    </SafeAreaView>
  );
};

export default AddParticipant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  containerHeader: {marginHorizontal: 22},
  newParticipantWarningContainer: {
    backgroundColor: 'rgba(47,128,237,0.2)',
    borderRadius: 4,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 12,
    paddingLeft: 14,
    paddingRight: 11,
    paddingBottom: 11,
    display: 'flex',
    flexDirection: 'row'
  },
  newParticipantWarningText: {
    color: COLORS.blue,
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
    marginLeft: 12,
    flex: 1,
    paddingTop: 13
  },
  newParticipantIcon: {
    marginTop: 16
  },
  subtitleStyle: (isIsset) => ({
    color: isIsset ? COLORS.holyTosca : COLORS.gray1
  })
});
