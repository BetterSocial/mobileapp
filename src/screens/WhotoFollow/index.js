import * as React from 'react';
import JwtDecode from 'jwt-decode';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/core';
import {useSetRecoilState} from 'recoil';

import ItemUser from './elements/ItemUser';
import Label from './elements/Label';
import Loading from '../Loading';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import {Analytics} from '../../libraries/analytics/firebaseAnalytics';
import {Button} from '../../components/Button';
import {Context} from '../../context';
import {Header} from '../../components';
import {InitialStartupAtom} from '../../service/initialStartup';
import {ProgressBar} from '../../components/ProgressBar';
import {colors} from '../../utils/colors';
import {get} from '../../api/server';
import {registerUser} from '../../service/users';
import {setAccessToken, setAnonymousToken, setRefreshToken, setToken} from '../../utils/token';
import {setImage} from '../../context/actions/users';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';
import {COLORS} from '../../utils/theme';

const {width} = Dimensions.get('screen');

const VIEW_TYPE_LABEL_TOPIC = 1;
const VIEW_TYPE_LABEL_LOCATION = 2;
const VIEW_TYPE_DATA = 3;

const WhotoFollow = () => {
  const {setProfileId} = useProfileHook();

  const [users, setUsers] = React.useState([]);
  const [followed, setFollowed] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [fetchRegister, setFetchRegister] = React.useState(false);
  const [topics] = React.useContext(Context).topics;
  const [localCommunity] = React.useContext(Context).localCommunity;
  const [usersState, usersDispatch] = React.useContext(Context).users;
  const [dataProvider, setDataProvider] = React.useState(null);
  const [isRecyclerViewShown, setIsRecyclerViewShown] = React.useState(false);
  const [layoutProvider, setLayoutProvider] = React.useState(() => {});

  const setInitialValue = useSetRecoilState(InitialStartupAtom);
  const create = useClientGetstream();

  const navigation = useNavigation();

  React.useEffect(() => {
    setIsLoading(true);

    const getWhoToFollowListUrl = `/who-to-follow/list?topics=${encodeURI(
      JSON.stringify(topics.topics)
    )}&locations=${encodeURI(JSON.stringify(localCommunity.local_community))}`;

    get({url: getWhoToFollowListUrl})
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
      const dProvider = new DataProvider((row1, row2) => row1 !== row2);
      setLayoutProvider(
        new LayoutProvider(
          (index) => {
            if (users.length < 1) {
              return 0;
            }
            if (users[index].viewtype === 'labeltopic') {
              return VIEW_TYPE_LABEL_TOPIC;
            }
            if (users[index].viewtype === 'labellocation') {
              return VIEW_TYPE_LABEL_LOCATION;
            }
            return VIEW_TYPE_DATA;
          },
          (type, dim) => {
            switch (type) {
              case VIEW_TYPE_DATA:
                dim.width = width;
                dim.height = 76;
                break;

              case VIEW_TYPE_LABEL_TOPIC:
              case VIEW_TYPE_LABEL_LOCATION:
              default:
                dim.width = width;
                dim.height = 40;
                break;
            }
          }
        )
      );
      setDataProvider(dProvider.cloneWithRows(users));
    }
  }, [users]);

  React.useEffect(() => {
    if (dataProvider) {
      setIsRecyclerViewShown(true);
    }
  }, [dataProvider]);

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    get({url: '/who-to-follow/list'})
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
    Analytics.logEvent('onb_select_follows_btn_add', {
      onb_whofollow_users_selected: followed
    });
    const data = {
      users: {
        username: usersState.username,
        human_id: usersState.userId,
        country_code: usersState.countryCode,
        // human_id: randomString(16),
        // country_code: 'US',
        profile_pic_path: usersState.photo,
        status: 'A'
      },
      local_community: localCommunity.local_community,
      topics: topics.topics,
      follows: followed,
      follow_source: 'onboarding'
    };

    registerUser(data)
      .then(async (res) => {
        setFetchRegister(false);
        if (res.code === 200) {
          setToken(res.token);
          setAccessToken(res.token);
          setRefreshToken(res.refresh_token);
          try {
            await setAnonymousToken(res.anonymousToken);
            const userId = await JwtDecode(res.token).user_id;
            const anonymousUserId = await JwtDecode(res.anonymousToken).user_id;
            setProfileId({
              anonProfileId: anonymousUserId,
              signedProfileId: userId
            });
          } catch (e) {
            crashlytics().recordError(new Error(e));
          }
          showMessage({
            message: 'Welcome to Better Social',
            type: 'success',
            backgroundColor: colors.holytosca
          });
          setTimeout(() => {
            create();
            setImage(null, usersDispatch);
            setInitialValue({id: res.token});
          }, 2000);
        } else {
          crashlytics().recordError(new Error(res));
          showMessage({
            message: 'Cannot connect to server, please try again later',
            type: 'danger',
            backgroundColor: colors.red
          });
        }
      })
      .catch((error) => {
        crashlytics().recordError(new Error(error.response));
        setFetchRegister(false);
        showMessage({
          message: 'Cannot connect to server, please try again later',
          type: 'danger',
          backgroundColor: colors.red
        });
      });
  };

  const rowRenderer = (type, item, index, extendedState) => {
    const labelTopicName = item.neighborhood ? item.neighborhood : item.name || '';
    switch (type) {
      case VIEW_TYPE_LABEL_TOPIC:
        return <Label label={`#${labelTopicName}`} />;
      case VIEW_TYPE_LABEL_LOCATION:
        return <Label label={`${item?.city || ''}`} />;
      case VIEW_TYPE_DATA:
      default:
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

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onPress={onBack} />
      {/* <View style={styles.wrapperHeader}>{renderHeader()}</View> */}
      <View style={styles.containerProgress}>
        <ProgressBar isStatic={true} value={100} />
      </View>
      <View>
        <Text style={styles.textWhoToFollow}>Who to follow</Text>
        <Text style={styles.textDescription}>
          {'Find interesting people to follow.\nYou can edit this anytime.'}
        </Text>
      </View>
      {isLoading ? <ActivityIndicator size="small" color="#0000ff" /> : null}
      {isRecyclerViewShown ? (
        <RecyclerListView
          style={styles.recyclerview}
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          extendedState={{
            followed
          }}
          rowRenderer={rowRenderer}
          scrollViewProps={{
            refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }}
        />
      ) : (
        <></>
      )}
      <View style={styles.footer}>
        <Text style={styles.textSmall}>Others cannot see who you’re following.</Text>
        <Button onPress={() => register()}>FINISH</Button>
      </View>
      <Loading visible={fetchRegister} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  recyclerview: {
    marginBottom: 112
  },
  wrapperHeader: {
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 22
  },
  containerProgress: {
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 20
  },
  textWhoToFollow: {
    fontFamily: 'Inter-Bold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 36,
    lineHeight: 43.57,
    color: '#11243D',
    marginHorizontal: 20
  },
  textDescription: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
    color: colors.gray,
    opacity: 0.84,
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 20
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: 112,
    width,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginTop: 'auto',
    zIndex: 1000
  },
  textSmall: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 10,
    textAlign: 'center',
    color: COLORS.blackgrey,
    marginBottom: 12
  },
  containerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 4,
    marginBottom: 8
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textRounded: {
    fontFamily: 'Inter-Black',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 24,
    color: '#FFFFFF'
  },
  containerTextCard: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 8
  },

  button: {
    height: 36,
    backgroundColor: '#11516F',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  textStyling: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
    color: '#FFFFFF'
  },
  textFullName: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000000',
    lineHeight: 21,
    alignSelf: 'flex-start'
  },
  textUsername: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#000000',
    lineHeight: 15,
    alignSelf: 'flex-start'
  },
  headerList: {
    height: 40,
    paddingLeft: 22,
    paddingRight: 22,
    backgroundColor: '#F2F2F2',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 12
  },
  titleHeader: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 18,
    color: '#4F4F4F'
  },
  flatList: {
    paddingLeft: 22,
    paddingRight: 22
  },
  tinyLogo: {
    width: 48,
    height: 48,
    borderRadius: 48
  },
  containerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textBold: {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 18,
    color: '#4F4F4F',
    textTransform: 'capitalize'
  },
  followAction: (awidth, height) => ({
    height,
    width: awidth,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  listUser: {
    marginBottom: 112
  }
});
export default WhotoFollow;
