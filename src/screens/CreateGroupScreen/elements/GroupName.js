import * as React from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import MemoIc_pencil from '../../../assets/icons/Ic_pencil';
import {Gap} from '../../../components';
import {COLORS, SIZES, FONTS} from '../../../utils/theme';

const GroupName = ({onChangeText, onPress, groupIcon = null}) => {
  const renderImage = (icon) => {
    if (icon) {
      return (
        <TouchableOpacity
          onPress={onPress}
          style={{
            backgroundColor: 'white',
            width: 40,
            height: 40,
            borderRadius: 45,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Image
            width={40}
            height={40}
            source={{uri: icon.uri}}
            style={{width: 40, height: 40, borderRadius: 45}}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          backgroundColor: 'white',
          width: 40,
          height: 40,
          borderRadius: 45,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <MemoIc_pencil width={16} height={16} color={COLORS.gray} />
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        backgroundColor: COLORS.holyTosca,
        paddingHorizontal: 16,
        paddingVertical: SIZES.base
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {renderImage(groupIcon)}
        <Gap width={SIZES.base} />
        <View
          style={{
            justifyContent: 'center',
            flex: 1
          }}>
          <TextInput
            placeholder={'Type group name...'}
            placeholderTextColor={'white'}
            style={{color: 'white', ...FONTS.body2}}
            onChangeText={onChangeText}
          />
        </View>
      </View>
      <Text style={{...FONTS.body3, color: 'white'}}>Provide a group name and group icon</Text>
    </View>
  );
};

export default GroupName;
