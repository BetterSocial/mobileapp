import * as React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';

import {fonts} from '../utils/fonts';
import Topics from '../screens/Topics';
import {colors} from '../utils/colors';
import Header from '../components/Header';
import Settings from '../screens/Settings';
import HomeBottomTabs from './HomeBottomTabs';
import SignIn from '../screens/SignIn';
import WhotoFollow from '../screens/WhotoFollow';
import OtherProfile from '../screens/OtherProfile';
import CreatePost from '../screens/CreatePost';
import LocalComunity from '../screens/LocalComunity';
import {
  ChannelScreen,
  ContactScreen,
  CreateGroupScreen,
  ProfileScreen,
  DetailDomainScreen,
  ChatDetailPage,
  DetailGroupImage,
  GroupInfo,
  GroupMedia,
  AddParticipant,
  GroupSetting,
} from '../screens';
import ImageViewerScreen from '../screens/ImageViewer';
import ReplyComment from '../screens/ReplyComment';
import PostDetailPage from '../screens/PostPageDetail';
import SplashScreen from '../screens/SplashScreen';
import PrivacyPolicies from '../screens/WebView/PrivacyPolicies';
import ChooseUsername from '../screens/InputUsername';
import TermsAndCondition from '../screens/WebView/TermsAndCondition';
import FollowingScreen from '../screens/Followings/FollowingScreen';
import DomainScreen from '../screens/DomainScreen';
import LinkContextScreen from '../screens/LinkContextScreen';
import TopicPageScreen from '../screens/TopicPageScreen';
import {Context} from '../context';

const Stack = createStackNavigator();
const RootStact = () => {
  const [clientState] = React.useContext(Context).client;
  const [profileState] = React.useContext(Context).profile
  const {client} = clientState;
  console.log(profileState, 'sikat')
  React.useEffect(() => {
    StatusBar.setBackgroundColor('#ffffff');
    StatusBar.setBarStyle('dark-content', true);

    return async () => {
      await client?.disconnectUser();
    };
  }, []);

  console.log(profileState, 'saka')

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
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddParticipant"
          component={AddParticipant}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GroupMedia"
          component={GroupMedia}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="GroupInfo"
          component={GroupInfo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailGroupImage"
          component={DetailGroupImage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChatDetailPage"
          component={ChatDetailPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ReplyComment"
          component={ReplyComment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PostDetailPage"
          component={PostDetailPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeTabs"
          component={HomeBottomTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChannelScreen"
          component={ChannelScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ChooseUsername"
          component={ChooseUsername}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LocalComunity"
          component={LocalComunity}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Topics"
          component={Topics}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WhotoFollow"
          component={WhotoFollow}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePost}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Followings"
          component={FollowingScreen}
          options={{
            headerShown: true,
            header: ({navigation}) => {
              console.log(navigation, profileState, 'jalan')
              return (
                <Header
                  title={profileState.navbarTitle}
                  containerStyle={styles.header}
                  titleStyle={styles.title}
                  onPress={() => navigation.goBack()}
                />
              );
            },
          }}
        />
        <Stack.Screen
          name="OtherProfile"
          component={OtherProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TermsAndCondition"
          component={TermsAndCondition}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PrivacyPolicies"
          component={PrivacyPolicies}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="ImageViewer" component={ImageViewerScreen} />
        <Stack.Screen
          name="DomainScreen"
          component={DomainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateGroupScreen"
          component={CreateGroupScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ContactScreen"
          component={ContactScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailDomainScreen"
          component={DetailDomainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LinkContextScreen"
          component={LinkContextScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TopicPageScreen"
          component={TopicPageScreen}
          options={{headerShown: false}}
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
  title: {fontSize: 16, fontFamily: fonts.inter[600]},
});
