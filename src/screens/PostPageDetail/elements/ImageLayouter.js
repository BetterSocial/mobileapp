import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const ImageLayouter = ({images = [], onimageclick}) => {
  if (images.length === 1) {
    return (
      <Pressable onPress={() => onimageclick(0)}>
        <Image source={{uri: images[0]}} style={styles.imagelayout1} width={'100%'} height={305} />
      </Pressable>
    );
  }
  if (images.length === 2) {
    return (
      <View style={styles.twoPhotoLayout}>
        {images.map((item, index) => {
          return (
            <View key={index} style={styles.twoPhotoItemLayout}>
              <Pressable onPress={() => onimageclick(index)}>
                <Image
                  style={styles.imagelayout2}
                  source={{uri: item}}
                  width={'100%'}
                  height={305}
                />
              </Pressable>
            </View>
          );
        })}
      </View>
    );
  }
  if (images.length === 3) {
    return (
      <View style={styles.threePhotoLayout}>
        <View style={styles.threePhotoTopLayout}>
          <Pressable onPress={() => onimageclick(0)} style={styles.threePhotoTopFirstLayout}>
            <Image
              style={styles.imagelayout3}
              source={{uri: images[0]}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
          <Pressable onPress={() => onimageclick(1)} style={styles.threePhotoTopSecondLayout}>
            <Image
              style={styles.imagelayout3}
              source={{uri: images[1]}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
        </View>
        <View style={styles.threePhotoBottomLayout}>
          <Pressable onPress={() => onimageclick(2)}>
            <Image
              style={styles.imagelayout2}
              source={{uri: images[2]}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
        </View>
      </View>
    );
  }
  if (images.length === 4) {
    return (
      <View style={styles.threePhotoLayout}>
        <View style={styles.threePhotoTopLayout}>
          <Pressable onPress={() => onimageclick(0)} style={styles.threePhotoTopFirstLayout}>
            <Image
              style={styles.imagelayout3}
              source={{uri: images[0]}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
          <Pressable onPress={() => onimageclick(1)} style={styles.threePhotoTopSecondLayout}>
            <Image
              style={styles.imagelayout3}
              source={{uri: images[1]}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
        </View>
        <View style={styles.threePhotoTopLayout}>
          <Pressable onPress={() => onimageclick(2)} style={styles.threePhotoTopFirstLayout}>
            <Image
              style={styles.imagelayout3}
              source={{uri: images[2]}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
          <Pressable onPress={() => onimageclick(3)} style={styles.threePhotoTopSecondLayout}>
            <Image
              style={styles.imagelayout3}
              source={{uri: images[3]}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
        </View>
      </View>
    );
  }
  if (images.length > 4) {
    return (
      <View style={styles.threePhotoLayout}>
        <View style={styles.threePhotoTopLayout}>
          <Pressable onPress={() => onimageclick(0)} style={styles.threePhotoTopFirstLayout}>
            <Image
              style={styles.imagelayout3}
              source={{uri: images[0]}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
          <Pressable onPress={() => onimageclick(1)} style={styles.threePhotoTopSecondLayout}>
            <Image
              style={styles.imagelayout3}
              source={{uri: images[1]}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
        </View>
        <View style={styles.threePhotoTopLayout}>
          <Pressable onPress={() => onimageclick(2)} style={styles.threePhotoTopFirstLayout}>
            <Image
              style={styles.imagelayout3}
              source={{uri: images[2]}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
          <Pressable onPress={() => onimageclick(3)} style={styles.threePhotoTopSecondLayout}>
            <View
              style={{
                backgroundColor: COLORS.blue,
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0.5,
                zIndex: 1000
              }}
            />
            <Text
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: '30%',
                left: '40%',
                fontSize: 36,
                fontFamily: fonts.inter[700],
                zIndex: 1000,
                color: COLORS.almostBlack
              }}>{`${images.length - 3}+`}</Text>
            <Image
              style={styles.imagelayout3}
              source={{uri: images[3]}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  return <></>;
};

const styles = StyleSheet.create({
  imagelayout1: {
    maxHeight: 305,
    width: '100%',
    resizeMode: 'cover'
  },

  imagelayout2: {
    maxHeight: 305,
    width: '100%',
    resizeMode: 'cover'
  },

  imagelayout3: {
    resizeMode: 'cover'
  },

  twoPhotoLayout: {
    width: '100%',
    height: 305,
    display: 'flex',
    flexDirection: 'row'
  },

  threePhotoLayout: {
    width: '100%',
    height: 305,
    display: 'flex',
    flexDirection: 'column'
  },

  threePhotoTopLayout: {
    flex: 1,
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row'
  },

  threePhotoTopFirstLayout: {flex: 1, marginRight: 2},
  threePhotoTopSecondLayout: {flex: 1},
  threePhotoTopSecondBlurLayout: {flex: 1, backgroundColor: COLORS.blue},

  threePhotoBottomLayout: {
    flex: 1
  },

  twoPhotoItemLayout: {
    flex: 1,
    height: 305,
    marginHorizontal: 1
  }
});

export default ImageLayouter;
