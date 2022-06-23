import * as React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Blocked from '../screens/Blocked';
import ChooseUsername from '../screens/InputUsername';
import CreatePost from '../screens/CreatePost';
import DiscoveryScreen from '../screens/DiscoveryScreen';
import DiscoverySearch from '../screens/DiscoveryScreen/elements/Search';
import DomainScreen from '../screens/DomainScreen';
import FollowingScreen from '../screens/Followings/FollowingScreen';
import GeneralComponentAction from '../context/actions/generalComponentAction';
import Header from '../components/Header';
import HelpCenter from '../screens/WebView/HelpCenter';
import HomeBottomTabs from './HomeBottomTabs';
import ImageViewerScreen from '../screens/ImageViewer';
import LinkContextScreen from '../screens/LinkContextScreen';
import LocalComunity from '../screens/LocalComunity';
import OtherProfile from '../screens/OtherProfile';
import OtherProfilePostDetail from '../screens/OtherProfilePostDetail';
import OtherProfileReplyComment from '../screens/OtherProfileReplyComment';
import PostDetailPage from '../screens/PostPageDetail';
import PrivacyPolicies from '../screens/WebView/PrivacyPolicies';
import ProfilePostDetail from '../screens/ProfilePostDetail';
import ProfileReplyComment from '../screens/ProfileReplyComment';
import ReplyComment from '../screens/ReplyComment';
import Settings from '../screens/Settings';
// import SignIn from '../screens/SignIn';
import SignIn from '../screens/SignInV2';
import SplashScreen from '../screens/SplashScreen';
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
  ProfileScreen,
} from '../screens';
import { Context } from '../context';
import { colors } from '../utils/colors';
import { fonts } from '../utils/fonts';

const Stack = createStackNavigator();
const RootStact = () => {
  const [clientState] = React.useContext(Context).client;
  const [profileState] = React.useContext(Context).profile;
  const { client } = clientState;
  const isIos = Platform.OS === 'ios'
  React.useEffect(() => {
    StatusBar.setBackgroundColor('#ffffff');
    StatusBar.setBarStyle('dark-content', true);

    return async () => {
      await client?.disconnectUser();
    };
  }, []);
  // console.log('kurama',profileState)
  return (
    <View
      style={{
        height: '100%',
      }}>
      <StatusBar translucent backgroundColor="white" />
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerStyle: {
            height: Platform.OS === 'ios' ? 64 : 56 + StatusBar.currentHeight,
            paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
          },
        }}>
        <Stack.Screen
          name="GroupSetting"
          component={GroupSetting}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddParticipant"
          component={AddParticipant}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupMedia"
          component={GroupMedia}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GroupInfo"
          component={GroupInfo}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailGroupImage"
          component={DetailGroupImage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatDetailPage"
          component={ChatDetailPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReplyComment"
          component={ReplyComment}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileReplyComment"
          component={ProfileReplyComment}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OtherProfileReplyComment"
          component={OtherProfileReplyComment}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PostDetailPage"
          component={PostDetailPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfilePostDetailPage"
          component={ProfilePostDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OtherProfilePostDetailPage"
          component={OtherProfilePostDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeTabs"
          component={HomeBottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChannelScreen"
          component={ChannelScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChooseUsername"
          component={ChooseUsername}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LocalComunity"
          component={LocalComunity}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Topics"
          component={Topics}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WhotoFollow"
          component={WhotoFollow}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePost}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Followings"
          component={FollowingScreen}
          options={{
            headerShown: isIos ? profileState.isShowHeader : true,
            header: ({ navigation }) => {
              return (
                <SafeAreaView>
                  <Header
                    title={profileState.navbarTitle}
                    // containerStyle={styles.header}
                    titleStyle={styles.title}
                    onPress={() => navigation.goBack()}
                    isCenter
                  />
                </SafeAreaView>

              );
            },
          }}
        />
        <Stack.Screen
          name="OtherProfile"
          component={OtherProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TermsAndCondition"
          component={TermsAndCondition}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrivacyPolicies"
          component={PrivacyPolicies}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HelpCenter"
          component={HelpCenter}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="ImageViewer" component={ImageViewerScreen} />
        <Stack.Screen
          name="DomainScreen"
          component={DomainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateGroupScreen"
          component={CreateGroupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ContactScreen"
          component={ContactScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DetailDomainScreen"
          component={DetailDomainScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LinkContextScreen"
          component={LinkContextScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TopicPageScreen"
          component={TopicPageScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DiscoveryScreen"
          component={DiscoveryScreen}
          options={{ 
            headerShown: true,
            header: ({}) => {
              return (
                <SafeAreaView>
                  <DiscoverySearch />
                </SafeAreaView>
              )
            }
          }}
        />
        <Stack.Screen
          name='BlockScreen'
          component={Blocked}
          options={{
            headerShown:  isIos ? profileState.isShowHeader : true,
            header: ({ navigation }) => {
              return (
                <SafeAreaView>
                  <Header
                    title={"Blocked"}
                    // containerStyle={styles.header}
                    titleStyle={styles.title}
                    onPress={() => navigation.goBack()}
                    isCenter
                  />
                </SafeAreaView>

              );
            },
          }}
        />

      </Stack.Navigator>
    </View>
  );
};

export default RootStact;
const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: { fontSize: 16, fontFamily: fonts.inter[600], textAlign: 'center' },
});
