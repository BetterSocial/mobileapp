import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import ChooseUsername from '../screens/Onboarding/ChooseUsername';
import SignIn from '../screens/SignIn/SignIn';
import SplashScreen from '../screens/SplashScreen/SplashScreen';
import LocalComunity from '../screens/LocalComunity';
import Topics from '../screens/Topics';
import WhotoFollow from '../screens/WhotoFollow';
import {StatusBar, Text} from 'react-native';
import CreatePost from '../screens/Post/CreatePost';
import Followings from '../screens/Followings';
import OtherProfile from '../screens/OtherProfile';
import Settings from '../screens/Settings';
import HomeBottomTabs from './HomeBottomTabs';
import {ChannelScreen, ProfileScreen} from '../screens';
import TermsAndCondition from '../screens/WebView/TermsAndCondition';
import PrivacyPolicies from '../screens/WebView/PrivacyPolicies';
import PostDetailPage from '../screens/Post/PostDetailPage';
import ImageViewerScreen from '../screens/ImageViewer';
import ReplyComment from '../screens/Post/ReplyComment';
import FollowingScreen from '../screens/Followings/FollowingScreen';
import Header from '../components/Header';
import {colors} from '../utils/colors';
import {fonts} from '../utils/fonts';
import DomainScreen from '../screens/DomainScreen/DomainScreen';
const Stack = createStackNavigator();
const RootStact = () => {
  useEffect(() => {
    StatusBar.setBackgroundColor('#ffffff');
    StatusBar.setBarStyle('dark-content', true);
  }, []);
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
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
        name="SplashScreen"
        component={SplashScreen}
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
            return (
              <Header
                title="Who you're following"
                containerStyle={{
                  backgroundColor: colors.white,
                  padding: 20,
                  paddingBottom: 10,
                }}
                titleStyle={{fontSize: 16, fontFamily: fonts.inter[600]}}
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
    </Stack.Navigator>
  );
};

export default RootStact;
