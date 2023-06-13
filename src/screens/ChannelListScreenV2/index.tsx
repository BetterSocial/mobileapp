import * as React from 'react';
import {ScrollView, StatusBar, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import AnonymousChannelListScreen from './AnonymousChannelListScreen';
import AnonymousProfile from '../../assets/images/AnonymousProfile.png';
import ChannelListScreen from '../ChannelListScreen';
import ChannelListTabItem from '../../components/HorizontalTab/ChannelListTabItem';
import HorizontalTab from '../../components/HorizontalTab';
import Search from '../ChannelListScreen/elements/Search';
import useProfileHook from '../../hooks/core/profile/useProfileHook';

const ChannelListScreenV2 = () => {
  const navigation = useNavigation();
  const {profile} = useProfileHook();

  const [selectedTab, setSelectedTab] = React.useState(0);

  const navigateToContactScreen = () => {
    navigation.navigate('ContactScreen');
  };

  console.log('profile');
  console.log(profile);

  return (
    <>
      <StatusBar translucent={false} />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{height: 52}}>
          <Search animatedValue={0} onPress={navigateToContactScreen} />
        </View>
        <HorizontalTab
          selectedTab={selectedTab}
          onSelectedTabChange={setSelectedTab}
          tabs={[
            <ChannelListTabItem
              key={0}
              name={`@${profile?.username}`}
              picture={profile?.profile_pic_path}
              unreadCount={4}
            />,
            <ChannelListTabItem
              key={0}
              name="Anonymous"
              picture={AnonymousProfile}
              unreadCount={4}
            />
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
