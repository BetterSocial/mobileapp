/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {ScrollView, Text, View} from 'react-native';

import useAnonymousChatScreenHook from '../../hooks/screen/useAnonymousChatScreenHook';
import {Button} from '../../components/Button';

const SampleChatScreen = () => {
  const {chats, goBackFromChatScreen, goToChatInfoScreen, sendChat} = useAnonymousChatScreenHook();

  return (
    <View>
      <Button onPress={goBackFromChatScreen}>Back</Button>
      <Button onPress={goToChatInfoScreen}>To Chat Info</Button>
      <Button onPress={() => sendChat(undefined)}>Send chat</Button>
      <Text style={{paddingBottom: 16}}>SampleChatScreen</Text>
      <ScrollView>
        {chats?.map((item, index) => {
          return (
            <View key={index}>
              <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
              <Text>{`${item?.id}`}</Text>
              <Text>{`${item?.user?.isMe ? 'You' : item?.user?.username}: ${item?.message}`}</Text>
              <Text>{item?.updatedAt}</Text>
              <Text>{`Chat Type: ${item?.type}`}</Text>
              <Text>{`Status: ${item?.status}`}</Text>
              <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SampleChatScreen;
