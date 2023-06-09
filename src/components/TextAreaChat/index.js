import React from 'react';
import {View, TextInput, ActivityIndicator, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {colors} from '../../utils/colors';
import MemoSendComment from '../../assets/icon/IconSendComment';
import {S} from './styles';

const PhotoProfile = (props) => {
  const {isAnonimity, loadingUser, avatarUrl, anon} = props;

  console.log({anon});

  return isAnonimity ? (
    <>
      {loadingUser ? (
        <ActivityIndicator size={'small'} color={colors.bondi_blue} />
      ) : (
        <View style={[S.image, {backgroundColor: anon.colorCode}]}>
          <Text style={S.emojyStyle}>{anon.emojiCode}</Text>
        </View>
      )}
    </>
  ) : (
    <>
      <FastImage
        style={S.image}
        source={{
          uri: avatarUrl
        }}
      />
    </>
  );
};

const TextAreaChat = (props) => {
  const {placeholder, isAnonimity, loadingUser, avatarUrl, anon} = props;
  const [value, onChangeText] = React.useState();

  return (
    <View style={S.container}>
      <PhotoProfile
        isAnonimity={isAnonimity}
        loadingUser={loadingUser}
        avatarUrl={avatarUrl}
        anon={anon}
      />
      <TextInput
        multiline={true}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={S.textArea}
        placeholderTextColor={colors.gray}
      />
      <View style={S.sendIconContainer(value)}>
        <MemoSendComment fill={colors.gray1} style={{alignSelf: 'center'}} />
      </View>
    </View>
  );
};

export default TextAreaChat;
