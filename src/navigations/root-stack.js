/* eslint-disable react/display-name */
import * as React from 'react';
import NetInfo from '@react-native-community/netinfo';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {useRecoilState, useRecoilValue} from 'recoil';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Blocked from '../screens/Blocked';
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
import SampleChatInfoScreen from '../screens/WebsocketResearchScreen/SampleChatInfoScreen';
import SampleChatScreen from '../screens/WebsocketResearchScreen/SampleChatScreen';
import Settings from '../screens/Settings';
import SignIn from '../screens/SignInV2';
import SignedChatScreen from '../screens/WebsocketResearchScreen/SignedChatScreen';
import TermsAndCondition from '../screens/WebView/TermsAndCondition';
import TopicMemberScreen from '../screens/TopicMemberScreen';
import TopicPageScreen from '../screens/TopicPageScreen';
import Topics from '../screens/Topics';
import WebsocketResearchScreen from '../screens/WebsocketResearchScreen';
import WhotoFollow from '../screens/WhotoFollow';
import api from '../service/config';
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

export const RootNavigator = ({currentScreen}) => {
  const initialStartup = useRecoilValue(InitialStartupAtom);
  const [following, setFollowing] = useRecoilState(followersOrFollowingAtom);
  const loadingStartup = useInitialStartup();
  const insets = useSafeAreaInsets();

  React.useEffect(() => {
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

  const isUnauthenticated = initialStartup.id === null || initialStartup.id === '';

  const getPaddingTop = (screenName) => {
    'worklet';

    if (isUnauthenticated || ['TopicPageScreen', 'TopicMemberScreen'].includes(screenName)) {
      return 0;
    }
    return insets.top;
  };

  const getInsetTopColor = () => {
    'worklet';

    return currentScreen === 'SampleChatScreen' ? COLORS.holyTosca : COLORS.white;
  };

  return (
    <LoadingStartupContext.Provider value={loadingStartup.loadingUser}>
      <View
        style={{
          height: '100%',
          paddingBottom: isUnauthenticated ? 0 : insets.bottom,
          paddingTop: getPaddingTop(currentScreen),
          backgroundColor: getInsetTopColor()
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
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: insets.bottom,
            backgroundColor: COLORS.white
          }}
        />
      </View>
    </LoadingStartupContext.Provider>
  );
};

RootNavigator.propTypes = {
  currentScreen: PropTypes.string
};

// region authenticatedStack
const AuthenticatedStack = createNativeStackNavigator();

const AuthenticatedNavigator = () => {
  const withKeyboardWrapper = (Component) => {
    return (props) => (
      <KeyboardWrapper>
        <Component {...props} />
      </KeyboardWrapper>
    );
  };

  return (
    <OneSignalNavigator>
      <AuthenticatedStack.Navigator initialRouteName="HomeTabs">
        <AuthenticatedStack.Screen
          name="HomeTabs"
          component={HomeBottomTabs}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="TermsAndCondition"
          component={withKeyboardWrapper(TermsAndCondition)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="PrivacyPolicies"
          component={withKeyboardWrapper(PrivacyPolicies)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="Settings"
          component={Settings}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="HelpCenter"
          component={withKeyboardWrapper(HelpCenter)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ProfileScreen"
          component={withKeyboardWrapper(ProfileScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen name="ImageViewer" component={ImageViewerScreen} />
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
          component={withKeyboardWrapper(OtherProfile)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name={NavigationConstants.CREATE_POST_SCREEN}
          component={withKeyboardWrapper(CreatePost)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="Followings"
          component={withKeyboardWrapper(FollowingScreen)}
          options={{
            headerShown: false
          }}
        />
        <AuthenticatedStack.Screen
          name="Followers"
          component={withKeyboardWrapper(FollowersScreen)}
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
          component={TopicPageScreen}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="TopicMemberScreen"
          component={withKeyboardWrapper(TopicMemberScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="DiscoveryScreen"
          component={withKeyboardWrapper(DiscoveryScreenV2)}
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
          component={withKeyboardWrapper(ProfileReplyComment)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="OtherProfileReplyComment"
          component={withKeyboardWrapper(OtherProfileReplyComment)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="PostDetailPage"
          component={withKeyboardWrapper(PostDetailPage)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ProfilePostDetailPage"
          component={withKeyboardWrapper(ProfilePostDetail)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="OtherProfilePostDetailPage"
          component={withKeyboardWrapper(OtherProfilePostDetail)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ChannelScreen"
          component={withKeyboardWrapper(ChannelScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="WebsocketResearchScreen"
          component={withKeyboardWrapper(WebsocketResearchScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="SampleChatScreen"
          component={withKeyboardWrapper(SampleChatScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="SampleChatInfoScreen"
          component={withKeyboardWrapper(SampleChatInfoScreen)}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="SignedChatScreen"
          component={withKeyboardWrapper(SignedChatScreen)}
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
