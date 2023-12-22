import * as React from 'react';
import {View, TextInput, ActivityIndicator, Text, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import MemoSendComment from '../../assets/icon/IconSendComment';
import {PhotoProfileProps, TextAreaChatProps} from './typings';
import {S} from './styles';
import {COLORS} from '../../utils/theme';

const PhotoProfile = ({
  anonUser,
  isAnonimity,
  avatarUrl,
  loadingAnonUser,
  chatDisabled = false
}: PhotoProfileProps) => {
  const {anon_user_info_emoji_code, anon_user_info_color_code} = anonUser ?? {};

  if (isAnonimity) {
    return (
      <View
        style={[
          S.image,
          {backgroundColor: loadingAnonUser ? 'transparent' : anon_user_info_color_code}
        ]}>
        {loadingAnonUser ? (
          <ActivityIndicator size={'small'} color={COLORS.bondi_blue} />
        ) : (
          <Text style={S.emojiStyle}>{anon_user_info_emoji_code}</Text>
        )}
      </View>
    );
  }

  return (
    <FastImage
      style={[S.image, {opacity: chatDisabled ? 0.4 : 1}]}
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

  const iconSendBackgroundColor = isAnonimity ? COLORS.bondi_blue : COLORS.blue1;

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
          {color: disabledInput ? COLORS.gray1 : COLORS.black, minHeight, maxHeight}
        ]}
        placeholderTextColor={COLORS.gray1}
        value={message}
        editable={!disabledInput}
      />
      <TouchableOpacity
        onPress={onSend}
        disabled={!message || disabledButton}
        style={[S.sendIconContainer]}>
        <MemoSendComment
          fillBackground={isButtonActive ? iconSendBackgroundColor : COLORS.gray1}
          fillIcon={COLORS.white}
        />
      </TouchableOpacity>
    </View>
  );
};

export default TextAreaChat;
