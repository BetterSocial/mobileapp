import * as React from 'react';
import {View, Text, TouchableNativeFeedback} from 'react-native';

import {Avatar, Gap} from '../../../components';
import {COLORS, SIZES} from '../../../utils/theme';

const RenderItem = ({item, selectedUsers, onChange, index}) => {
  function isInArray(value, array, method = 'render') {
    const check = array.indexOf(value);
    return check;
  }
  return (
    <TouchableNativeFeedback
      key={item.user_id}
      onPress={() => {
        onChange(item.user_id);
      }}>
      <View
        style={{
          paddingHorizontal: SIZES.base * 2,
          flexDirection: 'row',
          paddingVertical: SIZES.base
        }}>
        <Avatar image={item.profile_pic_path} />
        <Gap width={SIZES.base * 2} />
        <View style={{justifyContent: 'center'}}>
          <Text>{item.username}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  const prev = JSON.stringify(prevProps);
  const next = JSON.stringify(nextProps);

  if (prev === next) {
    return false;
  }
  return true;
}

export default React.memo(RenderItem, areEqual);
