import * as React from 'react';
import {View, TextInput, ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {colors} from '../../utils/colors';
import MemoSendComment from '../../assets/icon/IconSendComment';
import {PhotoProfileProps, TextAreaChatProps} from './typings';
import {S} from './styles';

const PhotoProfile = ({
  anonUser,
  isAnonimity,
  avatarUrl,
  loadingAnonUser,
  chatDisabled = false
}: PhotoProfileProps) => {
  const {anon_user_info_emoji_code, anon_user_info_color_code} = anonUser ?? {};

  if (isAnonimity) {
    return loadingAnonUser ? (
      <ActivityIndicator size={'small'} color={colors.bondi_blue} style={S.image} />
    ) : (
      <View style={[S.image, {backgroundColor: anon_user_info_color_code}]}>
        <Text style={S.emojyStyle}>{anon_user_info_emoji_code}</Text>
      </View>
    );
  }

  return (
    <FastImage
      style={[S.image, chatDisabled && {opacity: 0.4}]}
      source={{
        uri: avatarUrl
      }}
    />
  );
};

const TextAreaChat = ({
  anonUser,
  avatarUrl,
  isAnonimity,
  loadingAnonUser,
  placeholder,
  onSend,
  onChangeMessage,
  defaultValue,
  disabledButton = false,
  disabledInput = false,
  minHeight = 88,
  maxHeight = 88
}: TextAreaChatProps) => {
  const [message, setMessage] = React.useState<string>(defaultValue);

  const isButtonActive = message && !disabledButton;

  const iconSendBackgroundColor = isAnonimity ? colors.bondi_blue : colors.blue1;

  const onChangeText = (text: string) => {
    setMessage(text);
  };

  React.useEffect(() => {
    onChangeMessage(message);
  }, [message]);

  React.useEffect(() => {
    setMessage(defaultValue);
  }, [defaultValue]);

  return (
    <View style={S.container}>
      <PhotoProfile
        isAnonimity={isAnonimity}
        loadingAnonUser={loadingAnonUser}
        avatarUrl={avatarUrl}
        anonUser={anonUser}
        chatDisabled={disabledInput}
      />
      <TextInput
        multiline={true}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[
          S.textArea,
          {color: disabledInput ? colors.gray1 : colors.black, minHeight, maxHeight}
        ]}
        placeholderTextColor={'#C4C4C4'}
        value={message}
        editable={!disabledInput}
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={!message || disabledButton}
        style={[S.sendIconContainer]}>
        <MemoSendComment
          fillBackground={isButtonActive ? iconSendBackgroundColor : colors.gray1}
          fillIcon={colors.white}
        />
      </TouchableOpacity>
    </View>
  );
};

export default TextAreaChat;
