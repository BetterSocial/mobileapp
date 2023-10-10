import * as React from 'react';
import {ScrollView, StatusBar, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import AnonymousChannelListScreen from './AnonymousChannelListScreen';
import AnonymousProfile from '../../assets/images/AnonymousProfile.png';
import ChannelListScreen from '../ChannelListScreen';
import ChannelListTabItem from '../../components/HorizontalTab/ChannelListTabItem';
import HorizontalTab from '../../components/HorizontalTab';
import Search from '../ChannelListScreen/elements/Search';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import useRootChannelListHook from '../../hooks/screen/useRootChannelListHook';

const ChannelListScreenV2 = () => {
  const navigation = useNavigation();
  const {profile} = useProfileHook();
  const {
    anonymousChannelUnreadCount,
    signedChannelUnreadCount,
    refreshAnonymousChannelList,
    refreshSignedChannelList
  } = useRootChannelListHook();

  const [selectedTab, setSelectedTab] = React.useState(0);

  const navigateToContactScreen = () => {
    navigation.navigate('ContactScreen');
  };

  const onTabSelected = (index: number) => {
    setSelectedTab(index);
    if (index === 0) {
      refreshSignedChannelList();
    } else if (index === 1) {
      refreshAnonymousChannelList();
    }
  };

  return (
    <>
      <StatusBar translucent={false} />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{height: 52}}>
          <Search animatedValue={0} onPress={navigateToContactScreen} />
        </View>
        <HorizontalTab
          selectedTab={selectedTab}
          onSelectedTabChange={onTabSelected}
          tabs={[
            {
              key: 0,
              tabElement: (
                <ChannelListTabItem
                  key={0}
                  name={`@${profile?.username}`}
                  picture={profile?.profile_pic_path}
                  unreadCount={signedChannelUnreadCount}
                  testID="signed-channel-list-tab-item"
                />
              )
            },
            {
              key: 1,
              tabElement: (
                <ChannelListTabItem
                  key={1}
                  name="Anonymous"
                  picture={AnonymousProfile}
                  unreadCount={anonymousChannelUnreadCount}
                  testID="anonymous-channel-list-tab-item"
                />
              )
            }
          ]}
        />
        <View style={{display: selectedTab === 0 ? 'flex' : 'none'}}>
          <ChannelListScreen />
        </View>
        <View style={{display: selectedTab === 1 ? 'flex' : 'none'}}>
          <AnonymousChannelListScreen />
        </View>
      </ScrollView>
    </>
  );
};

export default ChannelListScreenV2;
