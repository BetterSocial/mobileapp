/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import BaseChatItem from '../../../components/AnonymousChat/BaseChatItem';
import useAnonymousChannelListScreenHook from '../../../hooks/screen/useAnonymousChannelListHook';
import {Button} from '../../../components/Button';

const AnonymousChannelListScreen = () => {
  const navigation = useNavigation();

  const {channels, goToChatScreen} = useAnonymousChannelListScreenHook();
  return (
    <ScrollView>
      <View>
        {channels?.map((item) => {
          return (
            <TouchableOpacity key={item?.id} onPress={() => goToChatScreen(item)}>
              <BaseChatItem />
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default AnonymousChannelListScreen;
