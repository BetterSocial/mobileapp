/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {ScrollView, Text, View} from 'react-native';

import useAnonymousChatScreenHook from '../../hooks/screen/useAnonymousChatScreenHook';
import {Button} from '../../components/Button';

const SampleChatScreen = () => {
  const {chats, goBackFromChatScreen} = useAnonymousChatScreenHook();

  return (
    <View>
      <Button onPress={goBackFromChatScreen}>Back</Button>
      <Text style={{paddingBottom: 16}}>SampleChatScreen</Text>
      <ScrollView>
        {chats?.map((item, index) => {
          return (
            <View key={index}>
              <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
              <Text>{`${item?.id}`}</Text>
              <Text>{`From: ${item?.userId}`}</Text>
              <Text>{`${item?.message}`}</Text>
              <Text>{item?.lastUpdatedAt}</Text>
              <Text>{`Chat Type: ${item?.type}`}</Text>
              <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SampleChatScreen;
