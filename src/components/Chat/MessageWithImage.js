import * as React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  ImageBackground,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MemoIc_read from '../../assets/chats/Ic_read';
import {fonts} from '../../utils/fonts';
import {calculateTime} from '../../utils/time';
import Dot from '../Dot';
import ModalImageSingleDetail from './ModalImageSingleDetail';
import ProfileMessage from './ProfileMessage';
import ActionChat from './ActionChat';
import {COLORS} from '../../utils/theme';

const MessageWithImage = ({image, name, time, message, read, isMe, attachments}) => {
  const [onAction, setOnAction] = React.useState(false);
  return (
    <ActionChat isMe={isMe} active={onAction}>
      <View style={styles.container}>
        <ProfileMessage image={image} />
        <TouchableWithoutFeedback
          onLongPress={() => setOnAction(true)}
          onPress={() => setOnAction(false)}>
          <View style={styles.containerChat(isMe)}>
            <View style={styles.user}>
              <View style={styles.userDetail}>
                <Text style={styles.name}>{name}</Text>
                <Dot color="#000" />
                <Text style={styles.time}>{calculateTime(time)}</Text>
              </View>
            </View>
            <Text style={styles.message}>{message}</Text>
            <ShowImage images={attachments} name={name} time={time} />
          </View>
        </TouchableWithoutFeedback>
      </View>
    </ActionChat>
  );
};
export default MessageWithImage;

const ShowImage = React.memo(({images, name, time}) => {
  const navigation = useNavigation();
  const [activeModal, setActiveModal] = React.useState(false);
  const [img, setImg] = React.useState('');
  const openDetail = (url) => {
    setImg(url);
    setActiveModal(true);
  };

  if (images.length <= 3) {
    return (
      <>
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity onPress={() => openDetail(item.image_url)}>
                <Image
                  key={'sg' + index}
                  style={styles.singleImage}
                  source={{
                    uri: item.image_url
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            );
          }}
        />
        <ModalImageSingleDetail
          visible={activeModal}
          img={img}
          onBack={() => setActiveModal(false)}
          name={name}
          time={time}
        />
      </>
    );
  }
  if (images.length === 4) {
    return (
      <FlatList
        data={images}
        style={styles.flexlist}
        contentContainerStyle={styles.containerManyEmage}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('DetailGroupImage', {
                  images,
                  name,
                  time,
                  index
                })
              }>
              <Image
                key={'mn' + index}
                style={[styles.manyImage, styles.manyImageItem(index)]}
                source={{uri: item.asset_url}}
                resizeMode="cover"
              />
            </TouchableOpacity>
          );
        }}
      />
    );
  }
  if (images.length > 4) {
    return (
      <FlatList
        data={images.slice(0, 4)}
        style={styles.flexlist}
        contentContainerStyle={styles.containerManyEmage}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DetailGroupImage', {
                images,
                name,
                time,
                index
              })
            }>
            <RanderImages item={item} index={index} count={images.length} />
          </TouchableOpacity>
        )}
      />
    );
  }
  return null;
});
const RanderImages = React.memo(({item, index, count}) => {
  if (index === 3) {
    return (
      <ImageBackground
        style={[styles.manyImage, styles.manyImageItem(index)]}
        source={{uri: item.asset_url}}>
        <View style={styles.moreImages}>
          <Text style={styles.textMore}>{count - 4} +</Text>
        </View>
      </ImageBackground>
    );
  }
  return (
    <Image
      key={'mn' + index}
      style={[styles.manyImage, styles.manyImageItem(index)]}
      source={{uri: item.asset_url}}
      resizeMode="cover"
    />
  );
});

const styles = StyleSheet.create({
  moreImages: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 173, 181, 0.75)',
    flex: 1
  },
  textMore: {
    fontSize: 24,
    fontFamily: fonts.inter[400],
    color: COLORS.white
  },
  singleImage: {
    flex: 1,
    width: '100%',
    height: 295,
    marginVertical: 4,
    borderRadius: 8
  },
  flexlist: {backgroundColor: COLORS.white, borderRadius: 8},
  containerManyEmage: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  manyImage: {
    flex: 2,
    width: 145.76,
    height: 145.76
  },
  manyImageItem: (i) => {
    if (i === 0) {
      return {
        borderTopLeftRadius: 8,
        marginBottom: 3.47,
        marginRight: 3.47
      };
    }
    if (i === 1) {
      return {
        borderTopRightRadius: 8
      };
    }
    if (i === 2) {
      return {
        borderBottomLeftRadius: 8,
        marginRight: 3.47
      };
    }
    if (i === 3) {
      return {
        borderBottomRightRadius: 8
      };
    }
  },
  name: {
    fontSize: 12,
    fontFamily: fonts.inter[600],
    lineHeight: 14.53,
    color: COLORS.black,
    marginRight: 5.7
  },
  time: {
    fontSize: 10,
    fontFamily: fonts.inter[600],
    lineHeight: 12,
    color: COLORS.black,
    marginLeft: 5
  },
  message: {
    color: COLORS.black,
    marginTop: 4,
    fontSize: 16,
    fontFamily: fonts.inter[400],
    lineHeight: 19.36,
    marginLeft: 4,
    marginRight: 5.35,
    marginBottom: 8
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 20
  },
  containerChat: (isMe) => ({
    backgroundColor: isMe ? COLORS.halfBaked : COLORS.lightgrey,
    paddingVertical: 8,
    paddingHorizontal: 4,
    flex: 1,
    borderRadius: 8,
    marginVertical: 4,
    marginLeft: 8
  }),
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userDetail: {flexDirection: 'row', alignItems: 'center'}
});
