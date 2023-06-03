import React from 'react';
import {View, TextInput} from 'react-native';
import FastImage from 'react-native-fast-image';
import {colors} from '../../utils/colors';
import MemoSendComment from '../../assets/icon/IconSendComment';
import {S} from './styles';

const TextAreaChat = (props) => {
  const {profile} = props;
  const [value, onChangeText] = React.useState();

  return (
    <View style={S.container}>
      {/* <View style={S.placeholderAvatar} /> */}
      <FastImage
        style={S.placeholderAvatar}
        source={{
          uri: profile.myProfile.profile_pic_path
        }}
      />
      <TextInput
        multiline={true}
        onChangeText={onChangeText}
        placeholder="Write a message..."
        style={S.textArea}
      />
      <View style={S.sendIconContainer(value)}>
        <MemoSendComment fill={colors.gray1} style={{alignSelf: 'center'}} />
      </View>
    </View>
  );
};

export default TextAreaChat;
