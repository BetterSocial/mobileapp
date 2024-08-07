import * as React from 'react';
import {
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  StatusBar
} from 'react-native';

import Icon from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/native';
import MemoIc_arrow_back_white from '../../assets/arrow/Ic_arrow_back_white';
import {fonts} from '../../utils/fonts';
import {calculateTime} from '../../utils/time';
import ModalImageSingleDetail from '../../components/Chat/ModalImageSingleDetail';
import {COLORS} from '../../utils/theme';

const {width} = Dimensions.get('screen');

const ShowDetailGroupImage = (props) => {
  const [images] = React.useState(props.route.params.images);
  const [time] = React.useState(props.route.params.time);
  const [name] = React.useState(props.route.params.name);
  const [indexScroll] = React.useState(props.route.params.index);
  const [activeModal, setActiveModal] = React.useState(false);
  const [img, setImg] = React.useState('');
  const navigation = useNavigation();

  const openDetail = (url) => {
    setImg(url);
    setActiveModal(true);
  };
  return (
    <View style={styles.container}>
      <StatusBar translucent={false} barStyle={'light-content'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MemoIc_arrow_back_white width={20} height={12} />
        </TouchableOpacity>
        <View style={styles.user}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.time}>
            {images.length} photos <Icon name="primitive-dot" size={6} color="#fff" />{' '}
            {calculateTime(time)}{' '}
          </Text>
        </View>
      </View>
      <FlatList
        data={images}
        initialScrollIndex={indexScroll}
        renderItem={({item, index}) => (
          <TouchableOpacity key={index} onPress={() => openDetail(item.asset_url)}>
            <ImageBackground resizeMode="cover" style={styles.image} source={{uri: item.asset_url}}>
              <Text style={styles.time}>{calculateTime(time)}</Text>
            </ImageBackground>
          </TouchableOpacity>
        )}
      />
      <ModalImageSingleDetail
        visible={activeModal}
        img={img}
        onBack={() => setActiveModal(false)}
        name={name}
        time={time}
      />
    </View>
  );
};

export default ShowDetailGroupImage;

const styles = StyleSheet.create({
  image: {
    width,
    height: 417,
    marginTop: 8,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 10,
    paddingRight: 10
  },
  container: {
    flex: 1
  },
  header: {
    backgroundColor: COLORS.anon_primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingTop: 6,
    paddingBottom: 7
  },
  user: {
    marginLeft: 18
  },
  name: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    color: COLORS.almostBlack,
    lineHeight: 16.94
  },
  time: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.almostBlack,
    lineHeight: 18
  }
});
