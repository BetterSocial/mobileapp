import * as React from 'react';
import {View, StyleSheet, BackHandler, Platform, SafeAreaView} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Tabbar from '../../components/Tabbar';
import BlockedUserList from './elements/UserScreen';
import BlockedDomainList from './elements/DomainScreen';
import {showHeaderProfile} from '../../context/actions/setMyProfileAction';
import {Context} from '../../context';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import Header from '../../components/Header';
import {COLORS} from '../../utils/theme';

const styles = StyleSheet.create({
  containerTab: {
    flex: 1
  }
});

const Blocked = ({navigation}) => {
  const TAB_BLOCKED_USER = 'tabBlockedUser';
  const TAB_BLOCKED_DOMAIN = 'tabBlockedDomain';
  const Tabs = createMaterialTopTabNavigator();
  const [profileState, dispatchNavbar] = React.useContext(Context).profile;
  const myTabbar = (tabbarProps) => <Tabbar {...tabbarProps} />;

  const headerBlocked = () => {
    if ((Platform.OS === 'ios' && profileState.isShowHeader) || Platform.OS === 'android') {
      return (
        <Header
          title={'Blocked'}
          // containerStyle={styles.header}
          titleStyle={styles.title}
          onPress={() => navigation.goBack()}
          isCenter
        />
      );
    }

    return null;
  };

  const settingBackhandleAndroid = () => {
    BackHandler.addEventListener('hardwareBackPress', backPress);
  };

  const removeBackHandleAndroid = () => {
    BackHandler.removeEventListener('hardwareBackPress', backPress);
  };

  const backPress = () => {
    navigation.goBack();
    return true;
  };

  React.useEffect(() => {
    const unsubscribeFocusListener = navigation.addListener('focus', () => {
      showHeaderProfile(true, dispatchNavbar);
    });
    const unsubscribeBlurListener = navigation.addListener('blur', () => {
      showHeaderProfile(false, dispatchNavbar);
    });

    settingBackhandleAndroid();

    return () => {
      removeBackHandleAndroid();
      unsubscribeFocusListener();
      unsubscribeBlurListener();
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.almostBlack}}>
      <View style={styles.containerTab}>
        {headerBlocked()}
        {/*
          TODO: Garry ganti seperti ini:
          indicator active signed primary, inactive gray200
          text active white, inactive gray400
        */}
        <Tabs.Navigator initialRouteName={TAB_BLOCKED_USER} tabBar={myTabbar}>
          <Tabs.Screen
            name={TAB_BLOCKED_USER}
            component={BlockedUserList}
            options={{
              title: 'User'
            }}
          />
          <Tabs.Screen
            name={TAB_BLOCKED_DOMAIN}
            component={BlockedDomainList}
            options={{
              title: 'Domain'
            }}
          />
          {/* <Tabs.Screen
            name={TAB_BLOCKED_TOPIC}
            component={BlockedTopicList}
            options={{
                title: 'Topic',
              }}
            /> */}
        </Tabs.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default withInteractionsManaged(Blocked);
