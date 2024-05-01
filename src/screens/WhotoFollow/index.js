import * as React from 'react';
import JwtDecode from 'jwt-decode';
import crashlytics from '@react-native-firebase/crashlytics';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/core';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSetRecoilState} from 'recoil';

import ImageUtils from '../../utils/image';
import ItemUser from './elements/ItemUser';
import Label from './elements/Label';
import Loading from '../Loading';
import TokenStorage from '../../utils/storage/custom/tokenStorage';
import dimen from '../../utils/dimen';
import useUserAuthHook from '../../hooks/core/auth/useUserAuthHook';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../libraries/analytics/analyticsEventTracking';
import {Analytics} from '../../libraries/analytics/firebaseAnalytics';
import {Button} from '../../components/Button';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {Header} from '../../components';
import {InitialStartupAtom} from '../../service/initialStartup';
import {ProgressBar} from '../../components/ProgressBar';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {getWhoToFollowList} from '../../service/topics';
import {registerUser} from '../../service/users';
import {setImage} from '../../context/actions/users';
import {setToken} from '../../utils/token';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';

const {width} = Dimensions.get('screen');

const WhotoFollow = () => {
  const {setAuth} = useUserAuthHook();

  const [users, setUsers] = React.useState([]);
  const [followed, setFollowed] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fetchRegister, setFetchRegister] = React.useState(false);
  const [topics] = React.useContext(Context).topics;
  const [localCommunity] = React.useContext(Context).localCommunity;
  const [usersState, usersDispatch] = React.useContext(Context).users;

  const setInitialValue = useSetRecoilState(InitialStartupAtom);
  const create = useClientGetstream();

  const navigation = useNavigation();
  const {top} = useSafeAreaInsets();

  const onLoad = async () => {
    try {
      setIsLoading(true);

      const resultList = await getWhoToFollowList(topics.topics, localCommunity.local_community);
      if (resultList.length > 0) {
        setUsers(
          resultList.map((i) => ({
            ...i,
            page: 1,
            isLoadingMore: false,
            isLastPage: i.users.length < 7
          }))
        );
      }
      setIsLoading(false);
    } catch (err) {
      crashlytics().recordError(new Error(err));
      setIsLoading(false);
    }
  };

  const onNextPage = async (sectionId) => {
    const checkSectionId = (item) => {
      return sectionId === 'other'
        ? item.viewtype === 'labelothers'
        : item.id === sectionId || item.location_id === sectionId;
    };
    const indexSectionId = users.findIndex((i) => checkSectionId(i));

    try {
      const copyUsers = [...users];
      if (copyUsers[indexSectionId]) {
        copyUsers[indexSectionId].isLoadingMore = true;
        setUsers(copyUsers);
      }

      const resultList = await getWhoToFollowList(
        topics.topics,
        localCommunity.local_community,
        users[indexSectionId].page + 1
      );
      const copyUsers2 = [...users];
      if (copyUsers2[indexSectionId]) {
        const newUsers = resultList.find((i) => checkSectionId(i))?.users || [];
        copyUsers2[indexSectionId].users = [...copyUsers2[indexSectionId].users, ...newUsers];
        copyUsers2[indexSectionId].page += 1;
        copyUsers2[indexSectionId].isLoadingMore = false;
        copyUsers2[indexSectionId].isLastPage = newUsers.length <= 0;
        setUsers(copyUsers2);
      }
    } catch (err) {
      crashlytics().recordError(new Error(err));
      const copyUsers = [...users];
      if (copyUsers[indexSectionId]) {
        copyUsers[indexSectionId].isLoadingMore = false;
        setUsers(copyUsers);
      }
    }
  };

  React.useEffect(() => {
    onLoad();
  }, []);

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

  const register = async () => {
    setFetchRegister(true);
    Analytics.logEvent('onb_select_follows_btn_add', {
      onb_whofollow_users_selected: followed
    });
    AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.ONBOARDING_TOPICS_TOTAL_FOLLOWING, {
      total: followed?.length
    });
    const data = {
      users: {
        username: usersState.username,
        human_id: usersState.userId,
        country_code: usersState.countryCode,
        profile_pic_path: usersState.photoUrl,
        status: 'A'
      },
      local_community: localCommunity.local_community,
      topics: topics.topics,
      follows: followed,
      follow_source: 'onboarding'
    };

    const profilePic = usersState?.photoUrl;
    if (profilePic && profilePic !== DEFAULT_PROFILE_PIC_PATH) {
      try {
        const uploadedImageUrl = await ImageUtils.uploadImageWithoutAuth(
          data?.users?.profile_pic_path
        );
        AnalyticsEventTracking.eventTrack(
          BetterSocialEventTracking.ONBOARDING_REGISTRATION_UPLOAD_IMAGE_SUCCESS
        );
        data.users.profile_pic_path = uploadedImageUrl?.data?.url;
        console.log('uploadedImageUrl', uploadedImageUrl);
      } catch (e) {
        AnalyticsEventTracking.eventTrack(
          BetterSocialEventTracking.ONBOARDING_REGISTRATION_UPLOAD_IMAGE_FAIL
        );
        console.log('error upload', e);
      }
    }

    registerUser(data)
      .then(async (res) => {
        setFetchRegister(false);
        if (res.code === 200) {
          TokenStorage.set(res);
          setToken(res.token);
          try {
            const userId = await JwtDecode(res.token).user_id;
            const anonymousUserId = await JwtDecode(res.anonymousToken).user_id;
            setAuth({
              anonProfileId: anonymousUserId,
              signedProfileId: userId,
              token: res.token,
              anonymousToken: res.anonymousToken
            });
          } catch (e) {
            crashlytics().recordError(new Error(e));
          }
          AnalyticsEventTracking.eventTrack(
            BetterSocialEventTracking.ONBOARDING_REGISTRATION_SUCCESS
          );
          showMessage({
            message: 'Welcome to Helio',
            type: 'success',
            backgroundColor: COLORS.signed_primary,
            style: top > 55 ? {paddingTop: 50} : undefined
          });
          setTimeout(() => {
            create();
            setImage(null, usersDispatch);
            setInitialValue({id: res.token});
          }, 2000);
        } else {
          crashlytics().recordError(new Error(res));
          AnalyticsEventTracking.eventTrack(
            BetterSocialEventTracking.ONBOARDING_REGISTRATION_FAILED
          );
          showMessage({
            message: 'Cannot connect to server, please try again later',
            type: 'danger',
            backgroundColor: COLORS.redalert
          });
        }
      })
      .catch((error) => {
        crashlytics().recordError(new Error(error.response));
        setFetchRegister(false);
        AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.ONBOARDING_REGISTRATION_FAILED);
        showMessage({
          message: 'Cannot connect to server, please try again later',
          type: 'danger',
          backgroundColor: COLORS.redalert
        });
      });
  };

  const onBack = () => {
    navigation.goBack();
  };

  const renderSectionFooter = (section) => {
    return section.isLoadingMore ? (
      <View style={{marginBottom: dimen.normalizeDimen(24.5)}}>
        <ActivityIndicator color={COLORS.white} />
      </View>
    ) : (
      <>
        {section.isLastPage ? null : (
          <TouchableOpacity
            onPress={() => onNextPage(section.id || section.location_id || 'other')}>
            {section.viewtype !== 'labelothers' ? (
              <Text style={styles.textShowMore}>
                Show more in{' '}
                <Text style={styles.textShowMoreBold}>
                  {section.city || section.state || section.country || `#${section.name}`}
                </Text>
              </Text>
            ) : (
              <Text style={styles.textShowMore}>Show more</Text>
            )}
          </TouchableOpacity>
        )}
      </>
    );
  };

  const renderItem = (item) => {
    return (
      <ItemUser
        photo={item.profile_pic_path}
        bio={item.bio}
        username={item.username}
        followed={followed}
        userid={item.user_id}
        onPress={() => handleSelected(item.user_id)}
        karmaScore={item.karma_score}
      />
    );
  };

  const renderSectionHeader = (section) => {
    switch (section.viewtype) {
      case 'labeltopic':
        return <Label label={`#${section.name}`} />;
      case 'labellocation':
        return <Label label={`${section.city || section.state || section.country || ''}`} />;
      case 'labelothers':
      default:
        return <Label label={section.name} isOriginalText />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header onPress={onBack} />
      <View style={styles.containerProgress}>
        <ProgressBar isStatic={true} value={100} />
      </View>
      <View>
        <Text style={styles.textWhoToFollow}>Who to follow</Text>
        <Text style={styles.textDescription}>
          {'Find interesting people to follow.\nYou can edit this anytime.'}
        </Text>
      </View>
      {isLoading ? <ActivityIndicator size="small" color={COLORS.white} /> : null}
      <SectionList
        sections={users.map((i) => ({
          ...i,
          data: i.users
        }))}
        keyExtractor={(item, index) => item + index}
        ListFooterComponent={<View style={{height: dimen.normalizeDimen(90)}} />}
        renderSectionFooter={({section}) => renderSectionFooter(section)}
        renderItem={({item}) => renderItem(item)}
        renderSectionHeader={({section}) => renderSectionHeader(section)}
      />
      <View style={styles.footer}>
        <View style={styles.textSmallContainer}>
          <Text style={styles.textSmall}>Others cannot see who you’re following.</Text>
        </View>
        <Button onPress={() => register()} disabled={followed.length < 3}>
          {followed.length < 3 ? `CHOOSE ${3 - followed.length} MORE` : 'FINISH'}
        </Button>
      </View>
      <Loading visible={fetchRegister} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack
  },
  recyclerview: (bottom) => ({
    marginBottom: dimen.normalizeDimen(112) - bottom
  }),
  wrapperHeader: {
    paddingHorizontal: dimen.normalizeDimen(22),
    paddingTop: dimen.normalizeDimen(22)
  },
  containerProgress: {
    marginTop: dimen.normalizeDimen(20),
    marginBottom: dimen.normalizeDimen(24),
    paddingHorizontal: dimen.normalizeDimen(20)
  },
  textWhoToFollow: {
    fontFamily: fonts.inter[600],
    fontSize: normalizeFontSize(36),
    lineHeight: normalizeFontSize(43.57),
    color: COLORS.white,
    marginHorizontal: dimen.normalizeDimen(20)
  },
  textDescription: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
    color: COLORS.gray510,
    marginTop: dimen.normalizeDimen(8),
    marginBottom: dimen.normalizeDimen(24),
    paddingHorizontal: dimen.normalizeDimen(20)
  },
  textShowMore: {
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(20),
    color: COLORS.signed_primary,
    marginLeft: dimen.normalizeDimen(20),
    marginBottom: dimen.normalizeDimen(16),
    marginTop: dimen.normalizeDimen(8)
  },
  textShowMoreBold: {
    fontFamily: 'Inter-Bold',
    fontWeight: '700'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: dimen.normalizeDimen(112),
    width,
    paddingHorizontal: dimen.normalizeDimen(20),
    paddingBottom: dimen.normalizeDimen(20),
    backgroundColor: COLORS.almostBlack,
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 1000
  },
  textSmallContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  textSmall: {
    fontSize: normalizeFontSize(10),
    fontFamily: fonts.inter[400],
    textAlign: 'center',
    color: COLORS.gray510
  }
});
export default WhotoFollow;
