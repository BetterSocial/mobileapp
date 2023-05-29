/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import useCoreChatSystemHook from '../../database/hooks/core/useCoreChatSystemHook';
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
            <Text>{`${item?.name}`}</Text>
            <Text>{`${item?.description}`}</Text>
            <Text>{item?.last_updated_at}</Text>
            <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
          </View>
        );
      })}
    </View>
  );
};

export default WebsocketResearchScreen;
