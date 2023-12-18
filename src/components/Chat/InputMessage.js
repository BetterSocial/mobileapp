import * as React from 'react';
import {StyleSheet, View, TextInput, TouchableOpacity, Image, FlatList} from 'react-native';
import Fa from 'react-native-vector-icons/FontAwesome';
import {useChatContext, useMessageInputContext} from 'stream-chat-react-native';
import {debounce} from 'lodash';
import MemoIcPicture from '../../assets/icons/Ic_Picture';
import IconSend from '../../assets/icon/IconSendComment';
import SheetEmoji from './SheetEmoji';

import {Context} from '../../context/Store';
import {deleteDraftChat, getDraftChat, saveDraftChat} from '../../service/draftChat';
import {COLORS} from '../../utils/theme';

const InputMessage = () => {
  const [channelClient] = React.useContext(Context).channel;
  const channelId = channelClient.channel?.cid;

  const refEmoji = React.useRef(null);
  const {
    setText,
    text,
    appendText,
    sendMessage,
    toggleAttachmentPicker,
    imageUploads,
    closeAttachmentPicker,
    setImageUploads
  } = useMessageInputContext();

  const {isOnline} = useChatContext();

  const saveMessageToDraftDebounced = debounce((message) => {
    saveDraftChat(channelId, message);
  }, 500);

  const onChangeInput = (message) => {
    setText(message);
    saveMessageToDraftDebounced(message);
  };

  const onSelectImoji = (emoji) => {
    appendText(emoji);
    refEmoji.current.close();
  };

  const handleSendMessage = () => {
    sendMessage();
    closeAttachmentPicker();
    deleteDraftChat(channelId);
  };

  const handleDelete = (item) => {
    const notDeleteImage = imageUploads.filter((image) => image.id !== item.id);
    setImageUploads(notDeleteImage);
  };

  const isDisableButton = () => {
    if (isOnline) {
      if (text.length > 0 || imageUploads.length > 0) {
        return false;
      }
      return true;
    }
    return true;
  };

  React.useEffect(() => {
    const draftMessage = getDraftChat(channelId);
    if (draftMessage) {
      setText(draftMessage);
    }
  }, []);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerInput}>
          <TextInput multiline style={styles.input} onChangeText={onChangeInput} value={text} />
          <TouchableOpacity style={styles.btnPicture} onPress={toggleAttachmentPicker}>
            <MemoIcPicture width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn(isDisableButton())}
            disabled={isDisableButton()}
            onPress={handleSendMessage}>
            <IconSend
              fillBackground={isDisableButton() ? COLORS.gray9 : COLORS.holyTosca}
              style={styles.icSendButton}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.previewPhotoContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={imageUploads}
            renderItem={({item, index}) => (
              <View key={index}>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.containerDelete}>
                  <Fa name="trash" color={COLORS.white} size={18} />
                </TouchableOpacity>
                <Image style={styles.imageStyle} resizeMode="contain" source={{uri: item.url}} />
              </View>
            )}
          />
        </View>
      </View>

      <SheetEmoji ref={refEmoji} selectEmoji={(emoji) => onSelectImoji(emoji)} />
    </>
  );
};

export default InputMessage;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  btnEmoji: {
    paddingVertical: 7,
    paddingHorizontal: 6
  },
  icSendButton: {
    alignSelf: 'center'
  },
  btnPicture: {
    paddingVertical: 7,
    paddingRight: 7,
    paddingLeft: 6
  },
  containerInput: {
    backgroundColor: COLORS.lightgrey,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 9,
    borderRadius: 8,
    zIndex: 4
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightgrey
  },
  btn: (disable) => ({
    backgroundColor: disable ? COLORS.gray9 : COLORS.holyTosca,
    borderRadius: 18,
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 8
  }),
  previewPhotoContainer: {
    marginTop: 5,
    marginBottom: 5
  },
  imageStyle: {
    height: 64,
    width: 64,
    marginRight: 10
  },
  containerDelete: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 25,
    width: 25,
    backgroundColor: COLORS.holyTosca,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    borderRadius: 13
  }
});
