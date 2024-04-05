import * as React from 'react';
/* eslint-disable react/display-name */
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {useRecoilState, useRecoilValue} from 'recoil';

import AnonymousChatScreen from '../screens/ChatScreen/AnonymousChatScreen';
import Blocked from '../screens/Blocked';
import ChatInfoScreen from '../screens/ChatInfoScreen/ChatInfoScreen';
import ChooseUsername from '../screens/InputUsername';
import CreatePost from '../screens/CreatePost';
import DiscoveryScreenV2 from '../screens/DiscoveryScreenV2';
import DomainScreen from '../screens/DomainScreen';
import FollowersScreen from '../screens/Followings/FollowersScreen';
import FollowingScreen from '../screens/Followings/FollowingScreen';
import HelpCenter from '../screens/WebView/HelpCenter';
import HomeBottomTabs from './HomeBottomTabs';
import ImageViewerScreen from '../screens/ImageViewer';
import KeyboardWrapper from './KeyboardWrapper';
import LinkContextScreen from '../screens/LinkContextScreen';
import LocalCommunity from '../screens/LocalCommunity';
import NetworkStatusIndicator from '../components/NetworkStatusIndicator';
import OneSignalNavigator from './OneSignalNavigator';
import OtherProfile from '../screens/OtherProfile';
import OtherProfilePostDetail from '../screens/OtherProfilePostDetail';
import OtherProfileReplyComment from '../screens/OtherProfileReplyComment';
import PostDetailPage from '../screens/PostPageDetail';
import PrivacyPolicies from '../screens/WebView/PrivacyPolicies';
import ProfilePostDetail from '../screens/ProfilePostDetail';
import ProfileReplyComment from '../screens/ProfileReplyComment';
import ReplyComment from '../screens/ReplyComment';
import Settings from '../screens/Settings';
import SignIn from '../screens/SignInV2';
import SignedChatScreen from '../screens/ChatScreen/SignedChatScreen';
import TopicMemberScreen from '../screens/TopicMemberScreen';
import TopicPageScreen from '../screens/TopicPageScreen';
import Topics from '../screens/Topics';
import VideoViewerScreen from '../screens/VideoViewer';
import WhotoFollow from '../screens/WhotoFollow';
import api from '../service/config';
import useLocalDatabaseHook from '../database/hooks/useLocalDatabaseHook';
import {
  AddParticipant,
  ChannelScreen,
  ChatDetailPage,
  ContactScreen,
  DetailDomainScreen,
  DetailGroupImage,
  GroupInfo,
  GroupMedia,
  GroupSetting,
  ProfileScreen
} from '../screens';
import {InitialStartupAtom, LoadingStartupContext} from '../service/initialStartup';
import {NavigationConstants} from '../utils/constants';
import {followersOrFollowingAtom} from '../screens/ChannelListScreen/model/followersOrFollowingAtom';
import {useInitialStartup} from '../hooks/useInitialStartup';
import {COLORS} from '../utils/theme';

const RootStack = createNativeStackNavigator();

export const RootNavigator = () => {
  const initialStartup = useRecoilValue(InitialStartupAtom);
  const [following, setFollowing] = useRecoilState(followersOrFollowingAtom);
  const loadingStartup = useInitialStartup();
  useLocalDatabaseHook(true);

  React.useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && following?.length !== 0) {
        const successValue = [];
        following.forEach((value) => {
          api.post('/profiles/follow-user-v3', value).then(() => {
            successValue.push(value.user_id_followed);
          });
        });

        if (successValue.length === following.length) {
          setFollowing([]);
        } else {
          const filteredList = following.filter(
            (value) => !successValue.includes(value.user_id_followed)
          );

          setFollowing([...filteredList]);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <LoadingStartupContext.Provider value={loadingStartup.loadingUser}>
      <View
        style={{
          height: '100%'
        }}>
        <NetworkStatusIndicator hide={true} />

        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
            safeAreaInsets: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0
            }
          }}>
          {initialStartup.id !== null && initialStartup.id !== '' ? (
            <RootStack.Screen name="AuthenticatedStack" component={AuthenticatedNavigator} />
          ) : (
            <RootStack.Screen name="UnauthenticatedStack" component={UnauthenticatedNavigator} />
          )}
        </RootStack.Navigator>
      </View>
    </LoadingStartupContext.Provider>
  );
};

RootNavigator.propTypes = {
  currentScreen: PropTypes.string
};

// region authenticatedStack
const AuthenticatedStack = createNativeStackNavigator();

const withSafeAreaView = (Component) => {
  return (props) => (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.almostBlack}}>
      <Component {...props} />
    </SafeAreaView>
  );
};
const withKeyboardWrapper = (Component) => {
  return (props) => (
    <KeyboardWrapper>
      <Component {...props} />
    </KeyboardWrapper>
  );
};

const AuthenticatedNavigator = () => {
  return (
    <OneSignalNavigator>
      <AuthenticatedStack.Navigator initialRouteName="HomeTabs">
        <AuthenticatedStack.Screen
          name="HomeTabs"
          component={HomeBottomTabs}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="PrivacyPolicies"
          component={withKeyboardWrapper(PrivacyPolicies)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="Settings"
          component={withKeyboardWrapper(Settings)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="HelpCenter"
          component={withKeyboardWrapper(HelpCenter)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ProfileScreen"
          component={withSafeAreaView(withKeyboardWrapper(ProfileScreen))}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen name="ImageViewer" component={ImageViewerScreen} />
        <AuthenticatedStack.Screen name="VideoViewer" component={VideoViewerScreen} />
        <AuthenticatedStack.Screen
          name="DomainScreen"
          component={withKeyboardWrapper(DomainScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ContactScreen"
          component={withKeyboardWrapper(ContactScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="OtherProfile"
          component={withSafeAreaView(withKeyboardWrapper(OtherProfile))}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name={NavigationConstants.CREATE_POST_SCREEN}
          component={withKeyboardWrapper(CreatePost)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="Followings"
          component={FollowingScreen}
          options={{
            headerShown: false
          }}
        />
        <AuthenticatedStack.Screen
          name="Followers"
          component={withSafeAreaView(withKeyboardWrapper(FollowersScreen))}
          options={{
            headerShown: false
          }}
        />
        <AuthenticatedStack.Screen
          name="DetailDomainScreen"
          component={withKeyboardWrapper(DetailDomainScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="LinkContextScreen"
          component={withKeyboardWrapper(LinkContextScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="TopicPageScreen"
          component={withKeyboardWrapper(TopicPageScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="TopicMemberScreen"
          component={withKeyboardWrapper(TopicMemberScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="DiscoveryScreen"
          component={DiscoveryScreenV2}
          options={{
            headerShown: false
          }}
        />
        <AuthenticatedStack.Screen
          name="BlockScreen"
          component={Blocked}
          options={{
            headerShown: false
          }}
        />
        <AuthenticatedStack.Screen
          name="GroupSetting"
          component={withKeyboardWrapper(GroupSetting)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="AddParticipant"
          component={withKeyboardWrapper(AddParticipant)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="GroupMedia"
          component={withKeyboardWrapper(GroupMedia)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="GroupInfo"
          component={withKeyboardWrapper(GroupInfo)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="DetailGroupImage"
          component={withKeyboardWrapper(DetailGroupImage)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ChatDetailPage"
          component={withKeyboardWrapper(ChatDetailPage)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ReplyComment"
          component={withKeyboardWrapper(ReplyComment)}
          options={{headerShown: false}}
        />

        <AuthenticatedStack.Screen
          name="ProfileReplyComment"
          component={withSafeAreaView(withKeyboardWrapper(ProfileReplyComment))}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="OtherProfileReplyComment"
          component={withSafeAreaView(withKeyboardWrapper(OtherProfileReplyComment))}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="PostDetailPage"
          component={withSafeAreaView(withKeyboardWrapper(PostDetailPage))}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ProfilePostDetailPage"
          component={withSafeAreaView(withKeyboardWrapper(ProfilePostDetail))}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="OtherProfilePostDetailPage"
          component={withSafeAreaView(withKeyboardWrapper(OtherProfilePostDetail))}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ChannelScreen"
          component={withKeyboardWrapper(ChannelScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="AnonymousChatScreen"
          component={withSafeAreaView(withKeyboardWrapper(AnonymousChatScreen))}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ChatInfoScreen"
          component={withKeyboardWrapper(ChatInfoScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="SignedChatScreen"
          component={withSafeAreaView(withKeyboardWrapper(SignedChatScreen))}
          options={{headerShown: false}}
        />
      </AuthenticatedStack.Navigator>
    </OneSignalNavigator>
  );
};

// endregion

// region UnauthenticatedStack
const UnauthenticatedStack = createNativeStackNavigator();

const UnauthenticatedNavigator = () => (
  <UnauthenticatedStack.Navigator>
    <UnauthenticatedStack.Screen name="SignIn" component={SignIn} options={{headerShown: false}} />
    <UnauthenticatedStack.Screen
      name="ChooseUsername"
      component={ChooseUsername}
      options={{headerShown: false}}
    />
    <UnauthenticatedStack.Screen
      name="LocalCommunity"
      component={LocalCommunity}
      options={{headerShown: false}}
    />
    <UnauthenticatedStack.Screen
      name="WhotoFollow"
      component={WhotoFollow}
      options={{headerShown: false}}
    />
    <UnauthenticatedStack.Screen name="Topics" component={Topics} options={{headerShown: false}} />
  </UnauthenticatedStack.Navigator>
);

// endregion
