/* eslint-disable @typescript-eslint/no-explicit-any */
import {useNavigation} from '@react-navigation/native';
import * as React from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {generateRandomId} from 'stream-chat-react-native-core';

import IconSend from '../../assets/icon/IconSendComment';
import {Context} from '../../context';
import {setChannel} from '../../context/actions/setChannel';
import {colors} from '../../utils/colors';
import dimen from '../../utils/dimen';
import Loading from '../Loading';
import ToggleSwitch from '../ToggleSwitch';
import SheetEmoji from './SheetEmoji';

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'row'
  },
  container: {
    flex: 1,
    backgroundColor: colors.white
  },
  btnEmoji: {
    paddingVertical: dimen.normalizeDimen(7),
    paddingHorizontal: dimen.normalizeDimen(6),
    width: dimen.normalizeDimen(24),
    height: dimen.normalizeDimen(24),
    borderRadius: dimen.normalizeDimen(24 / 2),
    marginRight: dimen.normalizeDimen(6)
  },
  emoji: {
    fontSize: dimen.normalizeDimen(32 / 2)
  },
  icSendButton: {
    alignSelf: 'center'
  },
  btnPicture: {
    paddingVertical: dimen.normalizeDimen(7),
    paddingRight: dimen.normalizeDimen(7),
    paddingLeft: dimen.normalizeDimen(6)
  },
  containerInput: {
    backgroundColor: colors.lightgrey,
    flexDirection: 'row',
    alignItems: 'center',
    padding: dimen.normalizeDimen(8),
    paddingTop: dimen.normalizeDimen(4),
    paddingBottom: dimen.normalizeDimen(4),
    borderRadius: dimen.normalizeDimen(8)
  },
  input: {
    flex: 1,
    backgroundColor: colors.lightgrey,
    maxHeight: dimen.normalizeDimen(100)
  },
  btn: {
    borderRadius: dimen.normalizeDimen(32 / 2),
    width: dimen.normalizeDimen(32),
    height: dimen.normalizeDimen(32),
    display: 'flex',
    justifyContent: 'center',
    marginLeft: dimen.normalizeDimen(6)
  },
  enableButton: {
    backgroundColor: colors.bondi_blue
  },
  disableButton: {
    backgroundColor: colors.gray1
  },
  previewPhotoContainer: {
    marginTop: dimen.normalizeDimen(5),
    marginBottom: dimen.normalizeDimen(5)
  },
  imageStyle: {
    height: dimen.normalizeDimen(64),
    width: dimen.normalizeDimen(64),
    marginRight: dimen.normalizeDimen(10)
  },
  containerDelete: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: dimen.normalizeDimen(25),
    width: dimen.normalizeDimen(25),
    backgroundColor: colors.holytosca,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: dimen.normalizeDimen(100),
    borderRadius: dimen.normalizeDimen(13)
  },
  labelToggle: {
    color: '#828282',
    fontSize: dimen.normalizeDimen(8),
    fontWeight: '400'
  }
});

export interface AnonymousInputMessageProps {
  onSendButtonClicked: (message: string) => void;
  emojiCode: string;
  emojiColor: string;
  username: string;
  userId: string;
}

const AnonymousInputMessage = ({
  onSendButtonClicked,
  emojiCode,
  emojiColor,
  username,
  userId
}: AnonymousInputMessageProps) => {
  const navigation = useNavigation<any>();
  const refEmoji = React.useRef(null);
  const [text, setText] = React.useState('');
  const [inputFocus, setInputFocus] = React.useState(false);
  const [alignItemsInput, setAlignItemsInput] = React.useState('center');
  const [loading, setLoading] = React.useState(false);
  const [client] = (React.useContext(Context) as any).client;
  const [, dispatchChannel] = (React.useContext(Context) as any).channel;
  const {profile} = (React.useContext(Context) as {profile?: any}) ?? {};

  const onChangeInput = (v) => {
    setText(v);
  };
  const onSelectEmoji = () => {
    refEmoji.current.close();
  };

  const handleSendMessage = () => {
    onSendButtonClicked(text);
    setText('');
  };

  const isDisableButton = () => {
    return text?.length === 0;
  };

  const handleCreateChannel = async () => {
    try {
      setLoading(true);
      const members = [profile[0].myProfile.user_id, userId];
      const channelName = [profile[0].myProfile.username, username];
      const typeChannel = members.length > 2 ? 1 : 0;
      const clientChat = await client.client;
      const type = members.length > 2 ? 'group' : 'messaging';
      const findChannels = await clientChat.queryChannels(
        {type, members: {$eq: members}},
        [{last_message_at: -1}],
        {
          watch: true,
          state: true
        }
      );
      const memberWithRoles = members.map((item) => ({
        user_id: item,
        channel_role: 'channel_moderator'
      }));

      if (findChannels.length > 0) {
        setChannel(findChannels[0], dispatchChannel);
      } else {
        const channelChat = await clientChat.channel(type, generateRandomId(), {
          name: channelName.join(', '),
          type_channel: typeChannel
        });
        await channelChat.create();
        channelChat.update(
          {
            name: channelName.join(', ')
          },
          {
            text: 'You created this group',
            system_user: profile?.myProfile?.user_id,
            is_from_prepopulated: true,
            other_text: `${profile?.myProfile?.username} created this group`
          }
        );
        await channelChat.addMembers(memberWithRoles);
        setChannel(channelChat, dispatchChannel);
      }
      setLoading(false);
      await navigation.replace('ChatDetailPage');
    } catch (error) {
      showMessage({
        message: 'Failed creating new chat',
        type: 'danger'
      });
      setLoading(false);
    }
  };

  const toggleChnage = () => {
    Alert.alert('', `Do you want to switch and chat with ${username} under your username?`, [
      {
        text: 'Cancel'
      },
      {text: 'Yes, move to other chat', onPress: () => handleCreateChannel()}
    ]);
  };

  return (
    <View style={[styles.main, {alignItems: alignItemsInput as ViewStyle['alignItems']}]}>
      <View style={[styles.btnEmoji, {backgroundColor: emojiColor}]}>
        <Text style={styles.emoji}>{emojiCode}</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.containerInput}>
          <TextInput
            multiline
            style={styles.input}
            onChangeText={onChangeInput}
            value={text}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            onContentSizeChange={(e) => {
              const {contentSize} = e.nativeEvent;
              if (contentSize.height >= 20) {
                setAlignItemsInput('flex-end');
              } else {
                setAlignItemsInput('center');
              }
            }}
          />
          <ToggleSwitch
            labelLeft={!inputFocus && 'Anonymity'}
            conatinerStyle={{alignSelf: alignItemsInput as ViewStyle['alignItems']}}
            styleLabelLeft={styles.labelToggle}
            onValueChange={toggleChnage}
          />
        </View>
      </View>
      <TouchableOpacity
        style={[styles.btn, isDisableButton() ? styles.disableButton : styles.enableButton]}
        disabled={isDisableButton()}
        onPress={handleSendMessage}>
        <IconSend
          style={styles.icSendButton}
          fillBackground={isDisableButton() ? colors.gray1 : colors.bondi_blue}
          fillIcon={colors.white}
        />
      </TouchableOpacity>
      <SheetEmoji ref={refEmoji} selectEmoji={onSelectEmoji} />
      <Loading visible={loading} />
    </View>
  );
};

export default AnonymousInputMessage;
