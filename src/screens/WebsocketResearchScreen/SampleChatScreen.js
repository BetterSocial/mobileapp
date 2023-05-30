/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import useCoreChatSystemHook from '../../hooks/core/useCoreChatSystemHook';
import {Button} from '../../components/Button';

const WebsocketResearchScreen = () => {
  const navigation = useNavigation();

  const {channelList} = useCoreChatSystemHook();

  return (
    <View>
      <Button onPress={navigation.goBack}>Back</Button>
      <Text style={{paddingBottom: 16}}>WebsocketResearchScreen</Text>
      {channelList?.map((item, index) => {
        return (
          <View key={index}>
            <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
            <Text>{`${item?.id}`}</Text>
            <Text>{`${item?.name}`}</Text>
            <Text>{`${item?.description}`}</Text>
            <Text>{item?.lastUpdatedAt}</Text>
            <Text>{`Chat Type: ${item?.channelType}`}</Text>
            <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
          </View>
        );
      })}
    </View>
  );
};

export default WebsocketResearchScreen;
