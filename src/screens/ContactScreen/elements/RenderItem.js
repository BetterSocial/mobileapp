import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {Avatar, Gap} from '../../../components';
import {COLORS, SIZES} from '../../../utils/theme';

const RenderItem = ({item}) => {
  return (
    <TouchableOpacity
      onPress={() => alert('select')}
      style={{flexDirection: 'row', marginBottom: SIZES.base * 2}}>
      <Avatar image={item.icon} />
      <Gap width={SIZES.base * 2} />
      <View style={{justifyContent: 'center'}}>
        <Text>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RenderItem;
