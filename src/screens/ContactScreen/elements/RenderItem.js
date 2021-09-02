import * as React from 'react';
import {View, Text, TouchableNativeFeedback} from 'react-native';
import MemoIc_Checklist from '../../../assets/icons/Ic_Checklist';

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
        console.log(item.user_id);
        onChange(item.user_id);
      }}>
      <View
        style={{
          paddingHorizontal: SIZES.base * 2,
          flexDirection: 'row',
          paddingVertical: SIZES.base,
          // backgroundColor:
          //   isInArray(item, selectedUsers) > -1
          //     ? 'rgba(0, 173, 181, 0.15)'
          //     : '#FFFFFF',
        }}>
        <Avatar image={item.profile_pic_path} />
        <Gap width={SIZES.base * 2} />
        <View style={{justifyContent: 'center'}}>
          <Text>{item.username}</Text>
        </View>
        {/* <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-end',
            flex: 1,
          }}>
          {isInArray(item, selectedUsers) > -1 ? <MemoIc_Checklist /> : null}
        </View> */}
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
  let prev = JSON.stringify(prevProps);
  let next = JSON.stringify(nextProps);

  if (prev === next) {
    return false;
  } else {
    return true;
  }
}

export default React.memo(RenderItem, areEqual);
