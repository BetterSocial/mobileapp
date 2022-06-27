import * as React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';

import Blocked from '../screens/Blocked';
import ChooseUsername from '../screens/InputUsername';
// import CreatePost from '../screens/CreatePost';
import DiscoveryScreenV2 from '../screens/DiscoveryScreenV2';
import DomainScreen from '../screens/DomainScreen';
// import FollowingScreen from '../screens/Followings/FollowingScreen';
import Header from '../components/Header';
import HelpCenter from '../screens/WebView/HelpCenter';
import HomeBottomTabs from './HomeBottomTabs';
import ImageViewerScreen from '../screens/ImageViewer';
import LinkContextScreen from '../screens/LinkContextScreen';
import LocalCommunity from '../screens/LocalCommunity';
// import OtherProfile from '../screens/OtherProfile';
import OtherProfilePostDetail from '../screens/OtherProfilePostDetail';
import OtherProfileReplyComment from '../screens/OtherProfileReplyComment';
import PostDetailPage from '../screens/PostPageDetail';
import PrivacyPolicies from '../screens/WebView/PrivacyPolicies';
import ProfilePostDetail from '../screens/ProfilePostDetail';
import ProfileReplyComment from '../screens/ProfileReplyComment';
import ReplyComment from '../screens/ReplyComment';
// import Settings from '../screens/Settings';
import SignIn from '../screens/SignInV2';
import TermsAndCondition from '../screens/WebView/TermsAndCondition';
import TopicPageScreen from '../screens/TopicPageScreen';
// import Topics from '../screens/Topics';
// import WhotoFollow from '../screens/WhotoFollow';
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
import { useClientGetstream } from '../utils/getstream/ClientGetStram';
import { getDeepLinkUrl } from './linking';
import {initialStartupTask, InitialStartupAtom } from '../service/initialStartup';

const RootStack = createStackNavigator();

export const RootNavigator = () => {
  const initialStartup = useRecoilValue(InitialStartupAtom);
  const initialStartupAction = useRecoilCallback(initialStartupTask);
  const [clientState] = React.useContext(Context).client;
  const [profileState] = React.useContext(Context).profile;
  const { client } = clientState;
  const isIos = Platform.OS === 'ios'

  const create = useClientGetstream();

  React.useEffect(() => {
    StatusBar.setBackgroundColor('#ffffff');
    StatusBar.setBarStyle('dark-content', true);
    if (initialStartup.id !== null && initialStartup.id !== '') {
      // getDeepLinkUrl(initialStartup.id);
      create();
    }
    initialStartupAction();
    return async () => {
      await client?.disconnectUser();
    };
  }, []);

  React.useEffect(() => {
    if (initialStartup.id !== null) {
      setTimeout(() => {
        SplashScreen.hide();
      }, 700);
    }
  }, [initialStartup])

  console.log('INITIAL STARTUP', initialStartup.id, initialStartup.id !== null && initialStartup.id !== '')
  return (
    <View
      style={{
        height: '100%',
      }}>
      <StatusBar translucent backgroundColor="white" />
      <RootStack.Navigator
        screenOptions={{
          headerStyle: {
            height: Platform.OS === 'ios' ? 64 : 56 + StatusBar.currentHeight,
            paddingTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
          },
        }}>
        {
          initialStartup.id !== null && initialStartup.id !== '' ? (
            <>
              <RootStack.Screen
                name="HomeTabs"
                component={HomeBottomTabs}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="LocalCommunity"
                component={LocalCommunity}
                options={{ headerShown: false }}
              />

              <RootStack.Screen
                name="TermsAndCondition"
                component={TermsAndCondition}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="PrivacyPolicies"
                component={PrivacyPolicies}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="HelpCenter"
                component={HelpCenter}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen name="ImageViewer" component={ImageViewerScreen} />
              <RootStack.Screen
                name="DomainScreen"
                component={DomainScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="CreateGroupScreen"
                component={CreateGroupScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="ContactScreen"
                component={ContactScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="DetailDomainScreen"
                component={DetailDomainScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="LinkContextScreen"
                component={LinkContextScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="TopicPageScreen"
                component={TopicPageScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="DiscoveryScreen"
                component={DiscoveryScreenV2}
                options={{
                  headerShown: false,
                }}
              />
              <RootStack.Screen
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
              <RootStack.Screen
                name="GroupSetting"
                component={GroupSetting}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="AddParticipant"
                component={AddParticipant}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="GroupMedia"
                component={GroupMedia}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="GroupInfo"
                component={GroupInfo}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="DetailGroupImage"
                component={DetailGroupImage}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="ChatDetailPage"
                component={ChatDetailPage}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="ReplyComment"
                component={ReplyComment}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="ProfileReplyComment"
                component={ProfileReplyComment}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="OtherProfileReplyComment"
                component={OtherProfileReplyComment}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="PostDetailPage"
                component={PostDetailPage}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="ProfilePostDetailPage"
                component={ProfilePostDetail}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="OtherProfilePostDetailPage"
                component={OtherProfilePostDetail}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="ChannelScreen"
                component={ChannelScreen}
                options={{ headerShown: false }}
              />
            </>
            ) : (
              <>
                <RootStack.Screen
                  name="SignIn"
                  component={SignIn}
                  options={{ headerShown: false }}
                />
                <RootStack.Screen
                  name="ChooseUsername"
                  component={ChooseUsername}
                  options={{ headerShown: false }}
                />
              </>
          )
        }
      </RootStack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: { fontSize: 16, fontFamily: fonts.inter[600], textAlign: 'center' },
});
