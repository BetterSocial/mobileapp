import React, {useContext, useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  Dimensions,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {get} from '../../api/server';
import VirtualizedView from '../../components/VirtualizedView';
import MyStatusBar from '../../components/StatusBar';
import {Button} from '../../components/Button';
import {ProgressBar} from '../../components/ProgressBar';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import CheckIcon from '../../../assets/icons/check.svg';
import AddIcon from '../../../assets/icons/add.svg';
import {Context} from '../../context';
import {registerUser} from '../../service/users';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/core';
import {StackActions} from '@react-navigation/native';
import Loading from '../Loading';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import {
  setAccessToken,
  setRefreshToken,
  setToken,
} from '../../data/local/accessToken';

const width = Dimensions.get('screen').width;

const WhotoFollow = () => {
  const [users, setUsers] = useState([]);
  const [followed, setFollowed] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [fetchRegister, setFetchRegister] = useState(false);
  const [topics] = useContext(Context).topics;
  const [localCommunity] = useContext(Context).localCommunity;
  const [usersState] = useContext(Context).users;

  const navigation = useNavigation();

  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'WhotoFollow',
      screen_name: 'onb_select_follows',
    });
    setIsLoading(true);
    get({url: '/who-to-follow/list'})
      .then((res) => {
        setIsLoading(false);
        if (res.status == 200) {
          setUsers(res.data.body);
        }
      })
      .catch((err) => {
        crashlytics().recordError(new Error(err));
        setIsLoading(false);
      });
  }, []);

  const renderHeader = () => {
    if (Platform.OS === 'android') {
      return (
        <TouchableNativeFeedback>
          <ArrowLeftIcon width={20} height={12} fill="#000" />
        </TouchableNativeFeedback>
      );
    } else {
      return (
        <TouchableHighlight>
          <ArrowLeftIcon width={20} height={12} fill="#000" />
        </TouchableHighlight>
      );
    }
  };

  const handleSelected = (value) => {
    let copyFollowed = [...followed];
    let index = copyFollowed.findIndex((data) => data === value);
    if (index > -1) {
      copyFollowed.splice(index, 1);
    } else {
      copyFollowed.push(value);
    }

    setFollowed(copyFollowed);
    copyFollowed.map((res) => {
      console.log('user', res);
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    get({url: '/who-to-follow/list'})
      .then((res) => {
        setRefreshing(false);
        if (res.status == 200) {
          setUsers(res.data.body);
        }
      })
      .catch((err) => {
        crashlytics().recordError(new Error(err));
        setRefreshing(false);
      });
  }, []);

  const register = () => {
    if (followed.length < 2) {
      showMessage({
        message: 'minimum follow 3 users',
        type: 'danger',
      });
      return null;
    }
    setFetchRegister(true);
    analytics().logEvent('onb_select_follows_btn_add', {
      onb_whofollow_users_selected: followed,
    });
    const data = {
      users: {
        username: usersState.username,
        human_id: usersState.userId,
        country_code: usersState.countryCode,
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
            message: 'Welcome to Ping',
            description: 'Choose where to get started',
            type: 'success',
          });
          setTimeout(() => {
            navigation.dispatch(StackActions.replace('HomeTabs'));
          }, 2000);
        } else {
          crashlytics().recordError(new Error(res));
          showMessage({
            message: 'please complete the data',
            type: 'danger',
          });
        }
      })
      .catch((error) => {
        crashlytics().recordError(new Error(error));
        // console.log(error.response);
        setFetchRegister(false);
        showMessage({
          message: 'please complete the data',
          type: 'danger',
        });
      });
  };

  const renderItem = ({item}) => (
    <View style={styles.containerCard}>
      <View style={styles.cardLeft}>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: item.profile_pic_path,
          }}
        />
        <View style={styles.containerTextCard}>
          <Text style={styles.textFullName}>{item.real_name}</Text>
          <Text style={styles.textUsername}>{item.username}</Text>
        </View>
      </View>
      <TouchableNativeFeedback onPress={() => handleSelected(item.user_id)}>
        <View style={styles.containerButton}>
          {followed.findIndex((data) => data === item.user_id) > -1 ? (
            <CheckIcon width={32} height={32} fill="#23C5B6" />
          ) : (
            <AddIcon width={20} height={20} fill="#000000" />
          )}
        </View>
      </TouchableNativeFeedback>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapperHeader}>{renderHeader()}</View>
      <View style={styles.containerProgress}>
        <ProgressBar isStatic={true} value={100} />
      </View>
      <View style={styles.content}>
        <Text style={styles.textWhoToFollow}>Who to follow</Text>
        <Text style={styles.textDescription}>
          These make it easy for people to find you
        </Text>
      </View>
      {isLoading ? <ActivityIndicator size="small" color="#0000ff" /> : null}
      <VirtualizedView
        style={{marginBottom: 90}}
        onRefresh={onRefresh}
        refreshing={refreshing}>
        {users !== undefined && users.length > 0
          ? users.map((value, index) => {
              if (value.name === 'topic') {
                return (
                  <View key={index}>
                    {value.data.map((val, idx) => {
                      return (
                        <View key={idx}>
                          <View style={styles.headerList}>
                            <Text style={styles.titleHeader}>
                              People in{' '}
                              <Text style={styles.textBold}>{val.name}</Text>{' '}
                              follow...
                            </Text>
                          </View>
                          <FlatList
                            style={styles.flatList}
                            data={val.users}
                            renderItem={renderItem}
                            listKey={(item) => item.user_id + 'topic'}
                            keyExtractor={(item) => item.user_id + 'topic'}
                          />
                        </View>
                      );
                    })}
                  </View>
                );
              } else if (value.name === 'location') {
                return (
                  <View key={index}>
                    {value.data.map((val, idx) => {
                      return (
                        <View key={idx}>
                          <View style={styles.headerList}>
                            <Text style={styles.titleHeader}>
                              People in{' '}
                              <Text style={styles.textBold}>
                                {val.neighborhood}
                              </Text>{' '}
                              follow...
                            </Text>
                          </View>
                          <FlatList
                            style={styles.flatList}
                            data={val.users}
                            renderItem={renderItem}
                            listKey={(item) => item.user_id + 'location'}
                            keyExtractor={(item) => item.user_id + 'location'}
                          />
                        </View>
                      );
                    })}
                  </View>
                );
              } else {
                return null;
              }
              // return (
              //   <View key={index}>
              //     <View style={styles.headerList}>
              //       <Text style={styles.titleHeader}>
              //         People in{' '}
              //         <Text style={styles.textBold}>{value.group_name}</Text>{' '}
              //         follow...
              //       </Text>
              //     </View>
              //     <FlatList
              //       style={styles.flatList}
              //       data={value.data}
              //       renderItem={renderItem}
              //       keyExtractor={(item) => item.user_id}
              //     />
              //   </View>
              // );
            })
          : null}
      </VirtualizedView>
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
    fontSize: 32,
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
    textTransform: 'capitalize',
  },
  textUsername: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: '#000000',
    lineHeight: 15,
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
    textTransform: 'capitalize',
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
});
export default WhotoFollow;
