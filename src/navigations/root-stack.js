import * as React from 'react';
import NetInfo from '@react-native-community/netinfo';
import {View, KeyboardAvoidingView, Platform} from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {useRecoilState, useRecoilValue} from 'recoil';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

import Blocked from '../screens/Blocked';
import ChooseUsername from '../screens/InputUsername';
import CreatePost from '../screens/CreatePost';
import DiscoveryScreenV2 from '../screens/DiscoveryScreenV2';
import DomainScreen from '../screens/DomainScreen';
import FollowingScreen from '../screens/Followings/FollowingScreen';
import HelpCenter from '../screens/WebView/HelpCenter';
import HomeBottomTabs from './HomeBottomTabs';
import ImageViewerScreen from '../screens/ImageViewer';
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
import SignedChatScreen from '../screens/WebsocketResearchScreen/SignedChatScreen';
import Settings from '../screens/Settings';
import SignIn from '../screens/SignInV2';
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
import FollowersScreen from '../screens/Followings/FollowersScreen';
import KeyboardWrapper from './KeyboardWrapper';

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
    if (isUnauthenticated || ['TopicPageScreen', 'TopicMemberScreen'].includes(screenName)) {
      return 0;
    }
    return insets.top;
  };

  return (
    <LoadingStartupContext.Provider value={loadingStartup.loadingUser}>
      <View
        style={{
          height: '100%',
          paddingBottom: isUnauthenticated ? 0 : insets.bottom,
          paddingTop: getPaddingTop(currentScreen)
        }}>
        <NetworkStatusIndicator hide={true} />
        {/* <StatusBar translucent backgroundColor="white" /> */}
        {/* <KeyboardAvoidingView style={{flex: 1}} enabled={Platform.OS === 'ios'} behavior="padding"> */}
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
        {/* </KeyboardAvoidingView> */}
      </View>
    </LoadingStartupContext.Provider>
  );
};

RootNavigator.propTypes = {
  currentScreen: PropTypes.string
};

// region authenticatedStack
const AuthenticatedStack = createNativeStackNavigator();

const pdpWrapper = (props) => {
  return (
    <KeyboardWrapper>
      <PostDetailPage {...props} />
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
          name="TermsAndCondition"
          component={(props) => (
            <KeyboardWrapper>
              <TermsAndCondition {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="PrivacyPolicies"
          component={(props) => (
            <KeyboardWrapper>
              <PrivacyPolicies {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="Settings"
          component={(props) => (
            <KeyboardWrapper>
              <Settings {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="HelpCenter"
          component={(props) => (
            <KeyboardWrapper>
              <HelpCenter {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ProfileScreen"
          component={(props) => (
            <KeyboardWrapper>
              <ProfileScreen {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen name="ImageViewer" component={ImageViewerScreen} />
        <AuthenticatedStack.Screen
          name="DomainScreen"
          component={(props) => (
            <KeyboardWrapper>
              <DomainScreen {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ContactScreen"
          component={(props) => (
            <KeyboardWrapper>
              <ContactScreen {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="OtherProfile"
          component={(props) => (
            <KeyboardWrapper>
              <OtherProfile {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name={NavigationConstants.CREATE_POST_SCREEN}
          component={(props) => (
            <KeyboardWrapper>
              <CreatePost {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="Followings"
          component={(props) => (
            <KeyboardWrapper>
              <FollowingScreen {...props} />
            </KeyboardWrapper>
          )}
          options={{
            headerShown: false
          }}
        />
        <AuthenticatedStack.Screen
          name="Followers"
          component={(props) => (
            <KeyboardWrapper>
              <FollowersScreen {...props} />
            </KeyboardWrapper>
          )}
          options={{
            headerShown: false
          }}
        />
        <AuthenticatedStack.Screen
          name="DetailDomainScreen"
          component={(props) => (
            <KeyboardWrapper>
              <DetailDomainScreen {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="LinkContextScreen"
          component={(props) => (
            <KeyboardWrapper>
              <LinkContextScreen {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="TopicPageScreen"
          component={(props) => (
            <KeyboardWrapper>
              <TopicPageScreen {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="TopicMemberScreen"
          component={(props) => (
            <KeyboardWrapper>
              <TopicMemberScreen {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="DiscoveryScreen"
          component={(props) => (
            <KeyboardWrapper>
              <DiscoveryScreenV2 {...props} />
            </KeyboardWrapper>
          )}
          options={{
            headerShown: false
          }}
        />
        <AuthenticatedStack.Screen
          name="BlockScreen"
          component={(props) => (
            <KeyboardWrapper>
              <Blocked {...props} />
            </KeyboardWrapper>
          )}
          options={{
            headerShown: false
          }}
        />
        <AuthenticatedStack.Screen
          name="GroupSetting"
          component={(props) => (
            <KeyboardWrapper>
              <GroupSetting {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="AddParticipant"
          component={(props) => (
            <KeyboardWrapper>
              <AddParticipant {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="GroupMedia"
          component={(props) => (
            <KeyboardWrapper>
              <GroupMedia {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="GroupInfo"
          component={(props) => (
            <KeyboardWrapper>
              <GroupInfo {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="DetailGroupImage"
          component={(props) => (
            <KeyboardWrapper>
              <DetailGroupImage {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ChatDetailPage"
          component={(props) => (
            <KeyboardWrapper>
              <ChatDetailPage {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ReplyComment"
          component={(props) => (
            <KeyboardWrapper>
              <ReplyComment {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />

        <AuthenticatedStack.Screen
          name="ProfileReplyComment"
          component={(props) => (
            <KeyboardWrapper>
              <ProfileReplyComment {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="OtherProfileReplyComment"
          component={(props) => (
            <KeyboardWrapper>
              <OtherProfileReplyComment {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="PostDetailPage"
          component={(props) => (
            <KeyboardWrapper>
              <PostDetailPage {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ProfilePostDetailPage"
          component={(props) => (
            <KeyboardWrapper>
              <ProfilePostDetail {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="OtherProfilePostDetailPage"
          component={(props) => (
            <KeyboardWrapper>
              <OtherProfilePostDetail {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="ChannelScreen"
          component={(props) => (
            <KeyboardWrapper>
              <ChannelScreen {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="WebsocketResearchScreen"
          component={(props) => (
            <KeyboardWrapper>
              <WebsocketResearchScreen {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="SampleChatScreen"
          component={(props) => (
            <KeyboardWrapper>
              <SampleChatScreen {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="SampleChatInfoScreen"
          component={(props) => (
            <KeyboardWrapper>
              <SampleChatInfoScreen {...props} />
            </KeyboardWrapper>
          )}
          options={{headerShown: false}}
        />
        <AuthenticatedStack.Screen
          name="SignedChatScreen"
          component={(props) => (
            <KeyboardWrapper>
              <SignedChatScreen {...props} />
            </KeyboardWrapper>
          )}
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
