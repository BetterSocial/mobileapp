import * as React from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';

import {ButtonAddMedia} from '../../../components/Button';
import Gap from '../../../components/Gap';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const ShowMedia = ({onRemoveAll, onRemoveItem, onAddMedia, data}) => {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.contentImage}>
          {data.length < 10 && (
            <ButtonAddMedia
              onPress={onAddMedia}
              label="+add more photos"
              style={styles.btnMedia}
              labelStyle={styles.btnIcon}
            />
          )}
          <Gap style={styles.gap} />
          {data.map((item) => (
            <ShowImage key={item.id} data={item} onPress={onRemoveItem} />
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.btnRemove} onPress={onRemoveAll}>
        <Text style={styles.textBtnRemove}>Remove all photos</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShowMedia;

const ShowImage = ({data, onPress}) => {
  return (
    <ImageBackground
      source={{uri: data.data}}
      imageStyle={styles.image}
      style={styles.imageContainer}>
      <TouchableOpacity style={styles.icon} onPress={() => onPress(data.id)}>
        <Icon name="closecircle" size={20} />
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  textBtnRemove: {
    color: COLORS.redalert,
    fontSize: 14,
    fontFamily: fonts.inter[600],
    textAlign: 'center',
    fontWeight: 'bold'
  },
  imageContainer: {
    width: 120,
    height: 120,
    alignItems: 'flex-end',
    marginTop: 10,
    marginRight: 12
  },
  image: {borderRadius: 8},
  icon: {marginTop: -8, marginRight: -8},
  btnIcon: {
    color: COLORS.black,
    fontSize: 12,
    fontFamily: fonts.inter[400],
    width: 91,
    textAlign: 'center'
  },
  btnMedia: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    zIndex: 99
  },
  contentImage: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  btnRemove: {
    paddingVertical: 16,
    marginTop: 12,
    marginBottom: -14
  },
  gap: {width: 8}
});
