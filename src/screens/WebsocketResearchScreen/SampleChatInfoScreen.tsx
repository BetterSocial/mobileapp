/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {ScrollView, Text, View} from 'react-native';

import useAnonymousChatInfoScreenHook from '../../hooks/screen/useAnonymousChatInfoHook';
import {Button} from '../../components/Button';

const SampleChatInfoScreen = () => {
  const {channelInfo, goBack} = useAnonymousChatInfoScreenHook();

  return (
    <View>
      <Button onPress={goBack}>Back</Button>
      <Text style={{paddingBottom: 16}}>SampleChatInfoScreen</Text>
      <ScrollView>
        {channelInfo?.members?.map((item, index) => {
          return (
            <View key={index}>
              <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
              <Text>{`${item?.id}`}</Text>
              <Text>{`${item?.user?.isMe ? 'You' : item?.user?.username}`}</Text>
              <Text>{item?.joinedAt}</Text>
              <View style={{borderBottomColor: 'black', borderBottomWidth: 1}} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SampleChatInfoScreen;
