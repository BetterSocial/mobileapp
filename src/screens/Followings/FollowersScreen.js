import * as React from 'react';
import {BackHandler, Platform, StatusBar, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import Followings from '.';
import {Context} from '../../context';
import {setNavbarTitle, showHeaderProfile} from '../../context/actions/setMyProfileAction';
import {withInteractionsManagedNoStatusBar} from '../../components/WithInteractionManaged';
import Search from '../DiscoveryScreenV2/elements/Search';
import {getFollower} from '../../service/profile';
import {Header} from '../../components';
import {fonts} from '../../utils/fonts';

function FollowersScreen() {
  const navigation = useNavigation();
  const [profileState, dispatchNavbar] = React.useContext(Context).profile;

  const isAndroid = Platform.OS === 'android';

  const [isLoading, setIsLoading] = React.useState(false);
  const [dataFollower, setDataFollower] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');

  const fetchFollower = async (withLoading, text) => {
    if (withLoading) setIsLoading(true);
    const result = await getFollower(text);
    if (result.code === 200) {
      const newData = result.data.map((data) => ({
        ...data,
        name: data.user.username,
        image: data.user.profile_pic_path,
        description: null
      }));
      setDataFollower(newData);
      if (withLoading) setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (searchText.length === 0) {
      fetchFollower(true, searchText);
    }
  }, [searchText]);

  React.useEffect(() => {
    setNavbarTitle('Search Users', dispatchNavbar);
  }, []);

  const followingHeader = () => {
    if ((Platform.OS === 'ios' && profileState.isShowHeader) || Platform.OS === 'android') {
      return (
        <Header
          title="Who is following you"
          // containerStyle={styles.header}
          titleStyle={styles.headerTitle}
          onPress={() => navigation.goBack()}
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
      />

      <Followings
        isLoading={isLoading}
        dataFollower={dataFollower}
        setDataFollower={setDataFollower}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerTitle: {fontSize: 16, fontFamily: fonts.inter[600], textAlign: 'center'}
});

export default withInteractionsManagedNoStatusBar(FollowersScreen);
