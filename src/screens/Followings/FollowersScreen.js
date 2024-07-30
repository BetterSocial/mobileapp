import * as React from 'react';
import {BackHandler, Platform, StatusBar, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';

import DiscoveryAction from '../../context/actions/discoveryAction';
import Followings from '.';
import Search from '../DiscoveryScreenV2/elements/Search';
import useFollowerScreenAnalyticsHook from '../../libraries/analytics/useFollowerScreenAnalyticsHook';
import {Context} from '../../context';
import {Header} from '../../components';
import {fonts} from '../../utils/fonts';
import {getFollower} from '../../service/profile';
import {setNavbarTitle, showHeaderProfile} from '../../context/actions/setMyProfileAction';
import {withInteractionsManagedNoStatusBar} from '../../components/WithInteractionManaged';

function FollowersScreen() {
  const route = useRoute();
  const {params} = route;
  const navigation = useNavigation();
  const [profileState, dispatchNavbar] = React.useContext(Context).profile;
  const {
    onSearchBarClicked,
    onBackButtonClicked,
    onDeleteSearchClicked,
    onUserItemClicked,
    onUserItemFollow,
    onUserItemUnfollow
  } = useFollowerScreenAnalyticsHook();
  const [discovery, discoveryDispatch] = React.useContext(Context).discovery;

  const isAndroid = Platform.OS === 'android';

  const [isLoading, setIsLoading] = React.useState(false);
  const [dataFollower, setDataFollower] = React.useState(params?.params?.initialData || []);
  const [searchText, setSearchText] = React.useState('');
  const [isFirstTimeOpen, setIsFirstTimeOpen] = React.useState(true);

  const fetchFollower = async (withLoading, text) => {
    const result = await getFollower(text);
    if (result.code === 200) {
      const newData = result.data.map((data) => ({
        ...data,
        name: data.user.username,
        image: data.user.profile_pic_path,
        description: null
      }));
      setDataFollower(newData);

      const followedUsers = newData.filter((item) => item.user.following);
      const unfollowedUsers = newData.filter((item) => !item.user.following);
      DiscoveryAction.setNewFollowedUsers(followedUsers, discoveryDispatch);
      DiscoveryAction.setNewUnfollowedUsers(unfollowedUsers, discoveryDispatch);
      if (withLoading) setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!isFirstTimeOpen && searchText.length > 0) {
      fetchFollower(true, searchText);
    }
  }, [searchText]);

  React.useEffect(() => {
    if (isFirstTimeOpen && !params?.params?.initialData) {
      fetchFollower(true, '');
    }
    setIsFirstTimeOpen(false);
    setNavbarTitle('Search Users', dispatchNavbar);
  }, []);

  const followingHeader = () => {
    if ((Platform.OS === 'ios' && profileState.isShowHeader) || Platform.OS === 'android') {
      return (
        <Header
          title="Who is following you"
          titleStyle={styles.headerTitle}
          onPress={() => {
            onBackButtonClicked();
            navigation.goBack();
          }}
          isCenter
        />
      );
    }

    return null;
  };

  const backPress = () => {
    return false;
  };

  const settingBackhandleAndroid = () => {
    BackHandler.addEventListener('hardwareBackPress', backPress);
  };

  const removeBackHandleAndroid = () => {
    BackHandler.removeEventListener('hardwareBackPress', backPress);
  };

  React.useEffect(() => {
    const unsubFocusListener = navigation.addListener('focus', () => {
      showHeaderProfile(true, dispatchNavbar);
    });
    const unsubBlurListener = navigation.addListener('blur', () => {
      showHeaderProfile(false, dispatchNavbar);
    });
    settingBackhandleAndroid();
    return () => {
      removeBackHandleAndroid();
      unsubBlurListener();
      unsubFocusListener();
    };
  }, []);

  const followedUsers = dataFollower.filter((item) => item.user.following);
  const unfollowedUsers = dataFollower.filter((item) => !item.user.following);

  return (
    <View style={{flex: 1}}>
      {isAndroid ? <StatusBar translucent={false} barStyle={'light-content'} /> : null}
      {followingHeader()}

      <Search
        searchText={searchText}
        setSearchText={setSearchText}
        fetchData={fetchFollower}
        placeholderText={profileState.navbarTitle}
        hideBackIcon
        eventTrack={{
          onSearchBarClicked,
          onBackButtonPressed: () => {},
          onTextCleared: onDeleteSearchClicked
        }}
      />

      <Followings
        isLoading={isLoading}
        dataFollower={
          discovery?.followedUsers?.length > 0 ? discovery?.followedUsers : followedUsers
        }
        dataUnfollowed={
          discovery?.unfollowedUsers?.length > 0 ? discovery?.unfollowedUsers : unfollowedUsers
        }
        setDataFollower={setDataFollower}
        eventTrack={{
          common: {
            onCommonClearRecentSearch: () => {},
            onCommonRecentItemClicked: () => {}
          },
          user: {
            onUserPageOpened: () => onUserItemClicked(),
            onUserPageFollowButtonClicked: () => onUserItemFollow(),
            onUserPageUnfollowButtonClicked: () => onUserItemUnfollow()
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {fontSize: 16, fontFamily: fonts.inter[600], textAlign: 'center'}
});

export default withInteractionsManagedNoStatusBar(FollowersScreen);
