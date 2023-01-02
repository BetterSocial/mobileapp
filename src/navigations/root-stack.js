import * as React from 'react';
import {
  LogBox,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useLocalChannelsFirst } from 'stream-chat-react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Blocked from '../screens/Blocked';
import ChooseUsername from '../screens/InputUsername';
import CreatePost from '../screens/CreatePost';
import DiscoveryScreenV2 from '../screens/DiscoveryScreenV2';
import DomainScreen from '../screens/DomainScreen';
import FollowingScreen from '../screens/Followings/FollowingScreen';
import Header from '../components/Header';
import HelpCenter from '../screens/WebView/HelpCenter';
import HomeBottomTabs from './HomeBottomTabs';
import ImageViewerScreen from '../screens/ImageViewer';
import LinkContextScreen from '../screens/LinkContextScreen';
import LocalCommunity from '../screens/LocalCommunity';
import NetworkStatusIndicator from '../components/NetworkStatusIndicator';
import OtherProfile from '../screens/OtherProfile';
import OtherProfilePostDetail from '../screens/OtherProfilePostDetail';
import OtherProfileReplyComment from '../screens/OtherProfileReplyComment';
import PostDetailPage from '../screens/PostPageDetail';
import PrivacyPolicies from '../screens/WebView/PrivacyPolicies';
import ProfilePostDetail from '../screens/ProfilePostDetail';
import ProfileReplyComment from '../screens/ProfileReplyComment';
import ReplyComment from '../screens/ReplyComment';
import ReplyCommentLev3 from '../screens/ReplyComment2';
import Settings from '../screens/Settings';
import SignIn from '../screens/SignInV2';
import TermsAndCondition from '../screens/WebView/TermsAndCondition';
import TopicPageScreen from '../screens/TopicPageScreen';
import Topics from '../screens/Topics';
import WhotoFollow from '../screens/WhotoFollow';
import {
  AddParticipant,
  ChannelScreen,
  ChatDetailPage,
  ContactScreen,
  CreateGroupScreen,
  DetailDomainScreen,
  DetailGroupImage,
  GroupInfo,
  GroupMedia,
  GroupSetting,
  ProfileScreen
} from '../screens';
import { Context } from '../context';
import { InitialStartupAtom } from '../service/initialStartup';
import { channelListLocalAtom } from '../service/channelListLocal';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';
import { getAccessToken } from '../utils/token';
import { useClientGetstream } from '../utils/getstream/ClientGetStram';

import { traceMetricScreen } from '../libraries/performance/firebasePerformance';
import { Analytics } from '../libraries/analytics/firebaseAnalytics';

const RootStack = createStackNavigator();

export const RootNavigator = (props) => {
  const initialStartup = useRecoilValue(InitialStartupAtom);
  const setInitialValue = useSetRecoilState(InitialStartupAtom);
  const setLocalChannelData = useSetRecoilState(channelListLocalAtom);
  const [clientState] = React.useContext(Context).client;
  const { client } = clientState;
  const perf = React.useRef(null);

  const create = useClientGetstream();

  const doGetAccessToken = async () => {
    const accessToken = await getAccessToken();
    setInitialValue({ id: accessToken.id })
  }

  React.useEffect(() => {
    // logging section
    traceMetricScreen('loading_splashscreen').then(fnCallback => {
      perf.current = fnCallback;
    });
    Analytics.logEvent('splashscreen');
    LogBox.ignoreAllLogs();

    // statusbar
    StatusBar.setBackgroundColor('#ffffff');
    StatusBar.setBarStyle('dark-content', true);

    doGetAccessToken();
    useLocalChannelsFirst(setLocalChannelData);

    return async () => {
      await client?.disconnectUser();
    };
  }, []);

  React.useEffect(() => {
    if (initialStartup.id !== null) {
      if (initialStartup.id !== '') {
        setTimeout(() => {
          SplashScreen.hide();

          if (perf.current) {
            perf.current.stop();
          }
          create();
        }, 500);
      }
    } else {
      SplashScreen.hide();

      if (perf.current) {
        perf.current.stop();
      }
    }

  }, [initialStartup]);

  // React.useEffect(() => {
  //   if (clientState?.client) {
  //     setTimeout(() => {
  //       SplashScreen.hide();
  //
  //       if (perf.current) {
  //         perf.current.stop();
  //       }
  //     }, 1500)
  //   }
  // }, [clientState]);

  // const hideNetworkStatusIfInOnboarding = initialStartup?.id === null || initialStartup?.id === ''

  return (
    <View
      style={{
        height: '100%',
      }}>
      <NetworkStatusIndicator hide={false} />
      {/* <StatusBar translucent backgroundColor="white" /> */}
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          safeAreaInsets: {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }
          // headerStyle: {
          //   height: Platform.OS === 'ios' ? 64 : 56 + StatusBar.currentHeight,
          //   paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
          // },
        }}>
        {
          initialStartup.id !== null && initialStartup.id !== '' ? (
            <RootStack.Screen
              name="AuthenticatedStack"
              component={AuthenticatedNavigator}
            />
          ) : (
            <RootStack.Screen
              name="UnauthenticatedStack"
              component={UnauthenticatedNavigator}
            />
          )
        }
      </RootStack.Navigator>
    </View>
  );
};

// region authenticatedStack
const AuthenticatedStack = createStackNavigator();

const AuthenticatedNavigator = () => {
  const [profileState] = React.useContext(Context).profile;
  const isIos = Platform.OS === 'ios';
  return (
    <AuthenticatedStack.Navigator initialRouteName="HomeTabs">
      <AuthenticatedStack.Screen
        name="HomeTabs"
        component={HomeBottomTabs}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="PrivacyPolicies"
        component={PrivacyPolicies}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="HelpCenter"
        component={HelpCenter}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen name="ImageViewer" component={ImageViewerScreen} />
      <AuthenticatedStack.Screen
        name="DomainScreen"
        component={DomainScreen}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="CreateGroupScreen"
        component={CreateGroupScreen}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="ContactScreen"
        component={ContactScreen}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="OtherProfile"
        component={OtherProfile}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="CreatePost"
        component={CreatePost}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="Followings"
        component={FollowingScreen}
        options={{
          headerShown: isIos ? profileState.isShowHeader : true,
          header: ({ navigation }) => (
            <SafeAreaView>
              <Header
                title={profileState.navbarTitle}
                // containerStyle={styles.header}
                titleStyle={styles.title}
                onPress={() => navigation.goBack()}
                isCenter
              />
            </SafeAreaView>

          ),
        }}
      />
      <AuthenticatedStack.Screen
        name="DetailDomainScreen"
        component={DetailDomainScreen}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="LinkContextScreen"
        component={LinkContextScreen}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="TopicPageScreen"
        component={TopicPageScreen}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="DiscoveryScreen"
        component={DiscoveryScreenV2}
        options={{
          headerShown: false,
        }}
      />
      <AuthenticatedStack.Screen
        name='BlockScreen'
        component={Blocked}
        options={{
          headerShown: isIos ? profileState.isShowHeader : true,
          header: ({ navigation }) => (
            <SafeAreaView>
              <Header
                title={'Blocked'}
                // containerStyle={styles.header}
                titleStyle={styles.title}
                onPress={() => navigation.goBack()}
                isCenter
              />
            </SafeAreaView>

          ),
        }}
      />
      <AuthenticatedStack.Screen
        name="GroupSetting"
        component={GroupSetting}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="AddParticipant"
        component={AddParticipant}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="GroupMedia"
        component={GroupMedia}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="GroupInfo"
        component={GroupInfo}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="DetailGroupImage"
        component={DetailGroupImage}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="ChatDetailPage"
        component={ChatDetailPage}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="ReplyComment"
        component={ReplyComment}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name='ReplyCommentLev3'
        component={ReplyCommentLev3}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="ProfileReplyComment"
        component={ProfileReplyComment}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="OtherProfileReplyComment"
        component={OtherProfileReplyComment}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="PostDetailPage"
        component={PostDetailPage}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="ProfilePostDetailPage"
        component={ProfilePostDetail}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="OtherProfilePostDetailPage"
        component={OtherProfilePostDetail}
        options={{ headerShown: false }}
      />
      <AuthenticatedStack.Screen
        name="ChannelScreen"
        component={ChannelScreen}
        options={{ headerShown: false }}
      />
    </AuthenticatedStack.Navigator>
  );
};

// endregion

// region UnauthenticatedStack
const UnauthenticatedStack = createStackNavigator();

const UnauthenticatedNavigator = () => (
  <UnauthenticatedStack.Navigator>
    <UnauthenticatedStack.Screen
      name="SignIn"
      component={SignIn}
      options={{ headerShown: false }}
    />
    <UnauthenticatedStack.Screen
      name="ChooseUsername"
      component={ChooseUsername}
      options={{ headerShown: false }}
    />
    <UnauthenticatedStack.Screen
      name="LocalCommunity"
      component={LocalCommunity}
      options={{ headerShown: false }}
    />
    <UnauthenticatedStack.Screen
      name="WhotoFollow"
      component={WhotoFollow}
      options={{ headerShown: false }}
    />
    <UnauthenticatedStack.Screen
      name="Topics"
      component={Topics}
      options={{ headerShown: false }}
    />
  </UnauthenticatedStack.Navigator>
);

// endregion

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: { fontSize: 16, fontFamily: fonts.inter[600], textAlign: 'center' },
});
