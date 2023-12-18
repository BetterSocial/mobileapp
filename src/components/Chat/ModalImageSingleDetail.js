import * as React from 'react';
import {
  StatusBar,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';

import MemoIc_arrow_back_white from '../../assets/arrow/Ic_arrow_back_white';
import MemoIc_arrow_turn_right from '../../assets/arrow/Ic_arrow_turn_right';
import {fonts} from '../../utils/fonts';
import {calculateTime} from '../../utils/time';
import {COLORS} from '../../utils/theme';

const width = Dimensions.get('screen').width;

const ModalImageSingleDetail = ({onBack, visible, img, name, time}) => {
  React.useEffect(() => {
    StatusBar.setBackgroundColor(COLORS.black);
    StatusBar.setBarStyle('light-content', true);
  }, []);
  return (
    <Modal visible={visible} animationType="fade">
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack}>
            <MemoIc_arrow_back_white width={20} height={12} />
          </TouchableOpacity>
          <View style={styles.user}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.time}>{calculateTime(time)}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.btnShare}>
            <MemoIc_arrow_turn_right width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="dots-three-vertical" color={COLORS.white} size={17} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        <Image
          source={{
            uri: img,
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
    </Modal>
  );
};

export default ModalImageSingleDetail;

const styles = StyleSheet.create({
  btnShare: {
    marginRight: 9,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {flex: 1, backgroundColor: COLORS.black, justifyContent: 'center'},
  image: {width: width, height: 417},
  header: {
    backgroundColor: COLORS.black,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 26,
    paddingLeft: 20,
    paddingTop: 6,
    paddingBottom: 7,
    justifyContent: 'space-between',
  },
  user: {
    marginLeft: 18,
  },
  name: {
    fontFamily: fonts.inter[600],
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 16.94,
  },
  time: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.white,
    lineHeight: 18,
  },
});
