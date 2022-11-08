import * as React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList
} from 'react-native';
import FA from 'react-native-vector-icons/FontAwesome'
import {useChatContext, useMessageInputContext} from 'stream-chat-react-native';
import MemoIc_emoji from '../../assets/icons/Ic_emoji';
import MemoIc_Picture from '../../assets/icons/Ic_Picture';
import {colors} from '../../utils/colors';
import IconSend from '../../assets/icon/IconSendComment';
import SheetEmoji from './SheetEmoji';

const InputMessage = () => {
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
  const {isOnline} = useChatContext()

  const onChangeInput = (v) => {
    setText(v);
  };
  const onShowPickerEmoji = () => {
    refEmoji.current.open();
  };
  const onSelectImoji = (emoji) => {
    appendText(emoji);
    refEmoji.current.close();
  };

  const handleSendMessage = () => {
    sendMessage()
    closeAttachmentPicker()
  }

  const handleDelete = (item) => {
    const notDeleteImage = imageUploads.filter((image) => image.id !== item.id)
    setImageUploads(notDeleteImage)
  }
  return (
    <>
      <View style={styles.container}>
        <View style={styles.containerInput}>
          <TextInput
            multiline
            style={styles.input}
            onChangeText={onChangeInput}
            value={text}
          />
          <TouchableOpacity
            style={styles.btnEmoji}
            onPress={() => onShowPickerEmoji()}>
            <MemoIc_emoji width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnPicture}
            onPress={toggleAttachmentPicker}>
            <MemoIc_Picture width={20} height={20} />
          </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn(text || imageUploads.length !== 0)}
          disabled={imageUploads.length <= 0 || !isOnline}
          onPress={handleSendMessage}>
          <IconSend style={styles.icSendButton} />
        </TouchableOpacity>
        </View>
 
        <View style={styles.previewPhotoContainer} >
        <FlatList
        horizontal
        data={imageUploads}
        renderItem={({item, index}) => (
          <View key={index} >
            <TouchableOpacity onPress={() => handleDelete(item)} style={styles.containerDelete}  >
              <FA name='trash' color={'white'} size={18} />
            </TouchableOpacity>
          <Image style={styles.imageStyle} resizeMode='contain'  source={{uri: item.url}} />
        </View>
        )}
        />
        </View>
      
      </View>
      
      <SheetEmoji
        ref={refEmoji}
        selectEmoji={(emoji) => onSelectImoji(emoji)}
      />
    </>
  );
};

export default InputMessage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnEmoji: {
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  icSendButton: {
    alignSelf: 'center',
  },
  btnPicture: {
    paddingVertical: 7,
    paddingRight: 7,
    paddingLeft: 6,
  },
  containerInput: {
    backgroundColor: colors.lightgrey,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 9,
    borderRadius: 8,
    zIndex: 4
  },
  input: {
    flex: 1,
    backgroundColor: colors.lightgrey,
  },
  btn: (enabled) => ({
    backgroundColor: enabled ? colors.bondi_blue : colors.gray1,
    borderRadius: 18,
    width: 35,
    height: 35,
    display: 'flex',
    justifyContent: 'center',
    marginLeft: 8,
  }),
  previewPhotoContainer: {
    marginTop: 5,
    marginBottom: 5
  },
  imageStyle: {
    height: 64,
    width: 64
  },
  containerDelete: {
    position: 'absolute', top: 0, right: 0, height: 25, width: 25, backgroundColor: colors.holytosca, alignItems: 'center', justifyContent:'center', zIndex: 100, borderRadius: 13
  }
});
