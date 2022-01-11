import * as React from 'react';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';
import { StackActions } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { useNavigation } from '@react-navigation/core';

import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import ItemUser from './elements/ItemUser';
import Label from './elements/Label';
import Loading from '../Loading';
import { Button } from '../../components/Button';
import { Context } from '../../context';
import { ProgressBar } from '../../components/ProgressBar';
import { colors } from '../../utils/colors';
import { get } from '../../api/server';
import { registerUser } from '../../service/users';
import { setAccessToken, setRefreshToken, setToken } from '../../utils/token';
import { useClientGetstream } from '../../utils/getstream/ClientGetStram';

const width = Dimensions.get('screen').width;

const VIEW_TYPE_LABEL = 1;
const VIEW_TYPE_DATA = 2;

const WhotoFollow = () => {
  const [users, setUsers] = React.useState([]);
  const [followed, setFollowed] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [fetchRegister, setFetchRegister] = React.useState(false);
  const [topics] = React.useContext(Context).topics;
  const [localCommunity] = React.useContext(Context).localCommunity;
  const [usersState] = React.useContext(Context).users;
  const [dataProvider, setDataProvider] = React.useState(null);
  const [isRecyclerViewShown, setIsRecyclerViewShown] = React.useState(false);
  const [layoutProvider, setLayoutProvider] = React.useState(() => { });
  const create = useClientGetstream();

  const navigation = useNavigation();

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'WhotoFollow',
      screen_name: 'onb_select_follows',
    });
    setIsLoading(true);

    let getWhoToFollowListUrl = `/who-to-follow/list?topics=${encodeURI(
      JSON.stringify(topics.topics),
    )}&locations=${encodeURI(JSON.stringify(localCommunity.local_community))}`;
    console.log('topics.topics');
    console.log(getWhoToFollowListUrl);

    get({ url: getWhoToFollowListUrl })
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200) {
          setUsers(res.data.body);
        }
      })
      .catch((err) => {
        crashlytics().recordError(new Error(err));
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    if (users.length > 0) {
      let dProvider = new DataProvider((row1, row2) => row1 !== row2);
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
                dim.height = 76;
                break;

              default:
                dim.width = width;
                dim.height = 40;
            }
          },
        ),
      );
      setDataProvider(dProvider.cloneWithRows(users));
    }
  }, [users]);

  React.useEffect(() => {
    if (dataProvider) {
      setIsRecyclerViewShown(true);
    }
  }, [dataProvider]);

  const renderHeader = () => {
    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback
          onPress={() => navigation.goBack()}
          background={TouchableNativeFeedback.Ripple(colors.gray1, true, 20)}>
          <ArrowLeftIcon width={20} height={12} fill="#000" />
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableHighlight onPress={() => navigation.goBack()}>
          <ArrowLeftIcon width={20} height={12} fill="#000" />
        </TouchableHighlight>
      );
    }
  };

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    get({ url: '/who-to-follow/list' })
      .then((res) => {
        setRefreshing(false);
        if (res.status === 200) {
          setUsers(res.data.body);
        }
      })
      .catch((err) => {
        crashlytics().recordError(new Error(err));
        setRefreshing(false);
      });
  }, []);

  const register = () => {
    setFetchRegister(true);
    analytics().logEvent('onb_select_follows_btn_add', {
      onb_whofollow_users_selected: followed,
    });
    const data = {
      users: {
        username: usersState.username,
        human_id: usersState.userId,
        human_id: 'TVGBYD1BI9YMXMAA6CQS',
        country_code: usersState.countryCode,
        country_code: 'ID',
        profile_pic_path: usersState.photo,
        status: 'A',
      },
      local_community: localCommunity.local_community,
      topics: topics.topics,
      follows: followed,
      follow_source: 'onboarding',
    };

    registerUser(data)
      .then((res) => {
        setFetchRegister(false);
        if (res.code === 200) {
          setToken(res.token);
          setAccessToken(res.token);
          setRefreshToken(res.refresh_token);
          showMessage({
            message: 'Welcome to Better Social',
            type: 'success',
            backgroundColor: colors.holytosca,
          });
          setTimeout(() => {
            create();
            navigation.dispatch(StackActions.replace('HomeTabs'));
          }, 2000);
        } else {
          crashlytics().recordError(new Error(res));
          if (typeof res.message === 'object') {
            showMessage({
              message: res.message[0].message,
              type: 'danger',
            });
          } else if (typeof res.message === 'string') {
            showMessage({
              message: res.message,
              type: 'danger',
            });
          } else {
            showMessage({
              message: 'please complete the data',
              type: 'danger',
              backgroundColor: colors.red,
            });
          }
        }
      })
      .catch((error) => {
        crashlytics().recordError(new Error(error.response));
        setFetchRegister(false);
        showMessage({
          message: 'please complete the data',
          type: 'danger',
          backgroundColor: colors.red,
        });
      });
  };

  const rowRenderer = (type, item, index, extendedState) => {
    switch (type) {
      case VIEW_TYPE_LABEL:
        return <Label label={item.name} />;
      case VIEW_TYPE_DATA:
        return (
          <ItemUser
            photo={item.profile_pic_path}
            bio={item.bio}
            username={item.username}
            followed={extendedState.followed}
            userid={item.user_id}
            onPress={() => handleSelected(item.user_id)}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapperHeader}>{renderHeader()}</View>
      <View style={styles.containerProgress}>
        <ProgressBar isStatic={true} value={100} />
      </View>
      <View style={styles.content}>
        <Text style={styles.textWhoToFollow}>Who to follow</Text>
        <Text style={styles.textDescription}>
          Interesting people to follow. You can edit this anytime, and others
          cannot see who you follow.
        </Text>
      </View>
      {isLoading ? <ActivityIndicator size="small" color="#0000ff" /> : null}
      {isRecyclerViewShown ? (
        <RecyclerListView
          style={styles.recyclerview}
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          extendedState={{
            followed,
          }}
          rowRenderer={rowRenderer}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ),
          }}
        />
      ) : (
        <></>
      )}
      <View style={styles.footer}>
        <Button onPress={() => register()}>FINISH</Button>
      </View>
      <Loading visible={fetchRegister} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  recyclerview: {
    marginBottom: 90,
  },
  content: {
    padding: 22,
  },
  wrapperHeader: {
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 22,
  },

  containerProgress: {
    marginTop: 36,
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 22,
  },
  textWhoToFollow: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 36,
    lineHeight: 44,
    color: '#11243D',
  },
  textDescription: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 20,
    color: '#828282',
    marginTop: 20,
    opacity: 0.84,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: 90,
    width: width,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  containerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 4,
    marginBottom: 8,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRounded: {
    fontFamily: 'Inter-Black',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 24,
    color: '#FFFFFF',
  },
  containerTextCard: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 8,
  },

  button: {
    height: 36,
    backgroundColor: '#11516F',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textStyling: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  textFullName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
    lineHeight: 21,
    alignSelf: 'flex-start',
  },
  textUsername: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#000000',
    lineHeight: 15,
    alignSelf: 'flex-start',
  },
  headerList: {
    height: 40,
    paddingLeft: 22,
    paddingRight: 22,
    backgroundColor: '#F2F2F2',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 12,
  },
  titleHeader: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 18,
    color: '#4F4F4F',
  },
  flatList: {
    paddingLeft: 22,
    paddingRight: 22,
  },
  tinyLogo: {
    width: 48,
    height: 48,
    borderRadius: 48,
  },
  containerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBold: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 18,
    color: '#4F4F4F',
    textTransform: 'capitalize',
  },
  followAction: (awidth, height) => ({
    height,
    width: awidth,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  listUser: {
    marginBottom: 90,
  },
});
export default WhotoFollow;
