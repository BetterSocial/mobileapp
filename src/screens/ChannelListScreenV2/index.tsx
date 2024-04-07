// eslint-disable-next-line no-use-before-define
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/core';
import * as React from 'react';
import {Alert, FlatList, PushNotificationPermissions, StatusBar, View} from 'react-native';

import {openSettings} from 'react-native-permissions';
import PushNotification from 'react-native-push-notification';
import AnonymousProfile from '../../assets/images/AnonymousProfile.png';
import HorizontalTab from '../../components/HorizontalTab';
import ChannelListTabItem from '../../components/HorizontalTab/ChannelListTabItem';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../../hooks/core/auth/useUserAuthHook';
import useChatUtilsHook from '../../hooks/core/chat/useChatUtilsHook';
import useRootChannelListHook from '../../hooks/screen/useRootChannelListHook';
import {fcmTokenService} from '../../service/users';
import StorageUtils from '../../utils/storage';
import ChannelListScreen from '../ChannelListScreen';
import Search from '../ChannelListScreen/elements/Search';
import AnonymousChannelListScreen from './AnonymousChannelListScreen';
import {
  PERMISSION_STATUS_ACCEPTED,
  PERMISSION_STATUS_BLOCKED,
  PERMISSION_STATUS_PENDING
} from '../../utils/constants';

const ChannelListScreenV2 = () => {
  const {refresh} = useLocalDatabaseHook();
  const navigation = useNavigation();
  const {profile} = useUserAuthHook();
  const isFocused = navigation.isFocused();

  const {selectedChannelKey} = useChatUtilsHook();

  const [selectedTab, setSelectedTab] = React.useState(selectedChannelKey || 0);
  const {signedChannelUnreadCount, anonymousChannelUnreadCount} = useRootChannelListHook();

  const navigateToContactScreen = () => {
    navigation.navigate('ContactScreen');
  };

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();
      const payload = {
        fcm_token: fcmToken
      };
      fcmTokenService(payload);
    }
  };

  React.useEffect(() => {
    const checkNotif = async () => {
      if (!navigation.isFocused()) return;
      PushNotification.checkPermissions(
        (
          data: PushNotificationPermissions & {
            authorizationStatus?: number;
          }
        ) => {
          const lastPromptTime = StorageUtils.lastPromptNotification.get();
          const promptInterval = 48 * 60 * 60 * 1000;
          const currentTime = new Date().getTime();
          if (lastPromptTime && currentTime - parseFloat(lastPromptTime) < promptInterval) {
            return; // Don't show the prompt if the interval has not passed
          }

          const needsPermission =
            data.alert === false || data.badge === false || data.sound === false;

          const showAlert = (onPressAction: () => void) =>
            Alert.alert(
              "Don't Miss New Messages",
              `Allow notifications to know 
when friends send you messages.`,
              [
                {text: 'Not now', onPress: () => console.log('Cancel Pressed')},
                {text: 'Allow', onPress: onPressAction, isPreferred: true}
              ]
            );

          switch (data.authorizationStatus) {
            case PERMISSION_STATUS_ACCEPTED:
              if (needsPermission) {
                // THIS CASE IT'S TRIGGERED WHEN USER MANUALLY DISABLED THE NOTIFICATION
                StorageUtils.lastPromptNotification.set(currentTime.toString());
                showAlert(() => openSettings().catch(() => console.warn('cannot open settings')));
              } else {
                requestPermission();
              }
              break;
            case PERMISSION_STATUS_BLOCKED:
              if (needsPermission) {
                StorageUtils.lastPromptNotification.set(currentTime.toString());
                showAlert(() => openSettings().catch(() => console.warn('cannot open settings')));
              }
              break;
            case PERMISSION_STATUS_PENDING:
              StorageUtils.lastPromptNotification.set(currentTime.toString());
              showAlert(() => requestPermission());
              break;
            default:
              break;
          }
        }
      );
    };

    checkNotif();
  }, [navigation?.isFocused?.()]);

  React.useEffect(() => {
    if (isFocused) refresh('channelList');
  }, [isFocused]);

  return (
    <View>
      <StatusBar translucent={false} barStyle={'light-content'} />
      <FlatList
        data={[]}
        keyExtractor={(_e, i) => `dom${i.toString()}`}
        ListEmptyComponent={null}
        renderItem={null}
        contentContainerStyle={{flexGrow: 1}}
        ListHeaderComponent={
          <>
            <View style={{height: 52}}>
              <Search
                animatedValue={0}
                onPress={navigateToContactScreen}
                isAnon={selectedTab === 1}
              />
            </View>

            <HorizontalTab
              selectedTab={selectedTab}
              onSelectedTabChange={setSelectedTab}
              tabs={[
                <ChannelListTabItem
                  key={0}
                  name={`@${profile?.username}`}
                  picture={profile?.profile_pic_path}
                  unreadCount={signedChannelUnreadCount}
                  type="SIGNED"
                  testID="horizontal-tab-0"
                />,
                <ChannelListTabItem
                  key={1}
                  name="Anonymous"
                  picture={AnonymousProfile}
                  unreadCount={anonymousChannelUnreadCount}
                  type="ANONYMOUS"
                  testID="horizontal-tab-1"
                />
              ]}
            />

            <View style={{display: selectedTab === 0 ? 'flex' : 'none'}}>
              <ChannelListScreen />
            </View>
            <View style={{display: selectedTab === 1 ? 'flex' : 'none'}}>
              <AnonymousChannelListScreen />
            </View>
          </>
        }
      />
    </View>
  );
};

export default ChannelListScreenV2;
