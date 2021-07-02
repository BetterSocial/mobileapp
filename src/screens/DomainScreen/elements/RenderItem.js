import * as React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

import Gap from '../../../components/Gap';
import {colors} from '../../../utils/colors';
import {FONTS, SIZES} from '../../../utils/theme';
import Memoic_globe from '../../../assets/icons/ic_globe';
import MemoPeopleFollow from '../../../assets/icons/Ic_people_follow';
import MemoIc_rectangle_gradient from '../../../assets/Ic_rectangle_gradient';

const RenderItem = ({domain, image}) => {
  const getname = (d) => {
    try {
      return d.name;
    } catch (error) {
      return 'undenfined';
    }
  };

  const getTime = (d) => {
    try {
      return d.time;
    } catch (error) {
      return new Date().toUTCString();
    }
  };

  const {content} = domain;
  const name = getname(domain);
  const time = getTime(domain);
  return (
    <View style={styles.wrapperItem}>
      <View style={styles.content}>
        <View style={styles.wrapperImage}>
          <Image
            source={{
              uri: image
                ? image
                : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
            }}
            style={[styles.image, StyleSheet.absoluteFillObject]}
          />
        </View>
        <Gap style={styles.width(8)} />
        <View style={styles.containerDetail}>
          <Text>{name}</Text>
          <View style={styles.contentDetail}>
            <Text>{new Date(time).toLocaleDateString()}</Text>
            <View style={styles.point} />
            <Memoic_globe height={16} width={16} />
            <View style={styles.point} />

            <MemoPeopleFollow height={16} width={16} />
            <Gap style={styles.width(4)} />
            <Text style={styles.views}>12k</Text>
          </View>
          <MemoIc_rectangle_gradient width={SIZES.width * 0.43} height={20} />
        </View>
        <View>
          <TouchableOpacity>
            <View style={styles.wrapperText}>
              <Text style={styles.iconPlush}>+</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.containerText}>
        <Text style={{...FONTS.h2}}>{content.title}</Text>
      </View>
      <Gap style={styles.height(8)} />
      <Image
        source={{uri: content.image}}
        style={styles.height(SIZES.height * 0.3)}
      />
      <Gap />
      <Gap style={styles.height(16)} />
      <View style={styles.containerText}>
        <Text>{content.description}</Text>
      </View>
      <Gap style={styles.height(16)} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerText: {paddingHorizontal: 16},
  iconPlush: {fontSize: 24, color: '#00ADB5'},
  views: {color: '#828282'},
  containerDetail: {flex: 1},
  contentDetail: {flexDirection: 'row', alignItems: 'center'},
  content: {flexDirection: 'row', paddingHorizontal: 16},
  wrapperItem: {backgroundColor: 'white', marginBottom: 16},
  wrapperImage: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 46,
    width: 46,
    borderRadius: 45,
  },
  wrapperText: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderColor: '#00ADB5',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8,
  },
  height: (height) => ({height}),
  width: (width) => ({width}),
});

export default RenderItem;
