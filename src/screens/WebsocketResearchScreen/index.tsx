/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import useAnonymousChannelListScreenHook from '../../hooks/screen/useAnonymousChannelListHook';
import {Button} from '../../components/Button';

const WebsocketResearchScreen = () => {
  const navigation = useNavigation();

  const {channels, goToChatScreen} = useAnonymousChannelListScreenHook();
  return (
    <View>
      <Button onPress={navigation.goBack}>Back</Button>
      <Text style={{paddingBottom: 16}}>WebsocketResearchScreen</Text>
      {channels?.map((item) => {
        return (
          <TouchableOpacity key={item?.id} onPress={() => goToChatScreen(item)}>
            <View>
              <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
              <Text>{`${item?.id}`}</Text>
              <Text>{`${item?.name}`}</Text>
              <Text>{`${item?.user?.isMe ? 'You' : item?.user?.username}: ${
                item?.description
              }`}</Text>
              <Text>{item?.lastUpdatedAt}</Text>
              <Text>{`Chat Type: ${item?.channelType}`}</Text>
              <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default WebsocketResearchScreen;
