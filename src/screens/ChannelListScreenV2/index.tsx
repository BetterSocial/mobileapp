// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import {FlatList, StatusBar, View} from 'react-native';
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
  // TODO: Change this into useUserAuthHook
  const {profile} = useProfileHook();
  const {
    anonymousChannelUnreadCount,
    signedChannelUnreadCount,
    refreshAnonymousChannelList,
    refreshSignedChannelList
  } = useRootChannelListHook();

  const [selectedTab, setSelectedTab] = React.useState(0);
  const {signedChannelUnreadCount, anonymousChannelUnreadCount} = useRootChannelListHook();

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
      <FlatList
        data={[]}
        keyExtractor={(_e, i) => `dom${i.toString()}`}
        ListEmptyComponent={null}
        renderItem={null}
        contentContainerStyle={{flexGrow: 1}}
        ListHeaderComponent={
          <>
            <View style={{height: 52}}>
              <Search animatedValue={0} onPress={navigateToContactScreen} />
            </View>

            <HorizontalTab
              selectedTab={selectedTab}
              onSelectedTabChange={setSelectedTab}
              tabs={[
                <ChannelListTabItem
                  key={0}
                  testID="signed-channel-list-tab-item"
                  name={`@${profile?.username}`}
                  picture={profile?.profile_pic_path}
                  unreadCount={signedChannelUnreadCount}
                  type="SIGNED"
                />,
                <ChannelListTabItem
                  key={1}
                  testID="anonymous-channel-list-tab-item"
                  name="Anonymous"
                  picture={AnonymousProfile}
                  unreadCount={anonymousChannelUnreadCount}
                  type="ANONYMOUS"
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
    </>
  );
};

export default ChannelListScreenV2;
