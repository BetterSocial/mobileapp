import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Image from '../Image';
import { fonts } from '../../utils/fonts';
import { COLORS } from '../../utils/theme';

const ImageLayouter = ({ images = [], onimageclick }) => {
  const pressableFn = (index) => () => {
    onimageclick(index);
  }
  if (images.length === 1) {
    return (
      <Pressable onPress={pressableFn(0)}>
        <Image
          source={{ uri: images[0] }}
          style={styles.imagelayout1}
        />
      </Pressable>
    );
  }

  if (images.length === 2) {
    return (
      <View style={styles.twoPhotoLayout}>
        {images.map((item, index) => (
            <View key={index} style={styles.twoPhotoItemLayout}>
              <Pressable onPress={pressableFn(index)}>
                <Image
                  style={styles.imagelayout2}
                  source={{ uri: item }}
                />
              </Pressable>
            </View>
          ))}
      </View>
    );
  } if (images.length === 3) {
    return (
      <View style={styles.threePhotoLayout}>
        <View style={styles.threePhotoTopLayout}>
          <Pressable
            onPress={pressableFn(0)}
            style={styles.threePhotoTopFirstLayout}>
            <Image
              style={styles.imagelayout3}
              source={{ uri: images[0] }}
            />
          </Pressable>
          <Pressable
            onPress={pressableFn(1)}
            style={styles.threePhotoTopSecondLayout}>
            <Image
              style={styles.imagelayout3}
              source={{ uri: images[1] }}
            />
          </Pressable>
        </View>
        <View style={styles.threePhotoBottomLayout}>
          <Pressable onPress={pressableFn(2)}>
            <Image
              style={styles.imagelayout2}
              source={{ uri: images[2] }}
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
          <Pressable
            onPress={pressableFn(0)}
            style={styles.threePhotoTopFirstLayout}>
            <Image
              style={styles.imagelayout3}
              source={{ uri: images[0] }}
            />
          </Pressable>
          <Pressable
            onPress={pressableFn(1)}
            style={styles.threePhotoTopSecondLayout}>
            <Image
              style={styles.imagelayout3}
              source={{ uri: images[1] }}
            />
          </Pressable>
        </View>
        <View style={styles.threePhotoTopLayout}>
          <Pressable
            onPress={pressableFn(2)}
            style={styles.threePhotoTopFirstLayout}>
            <Image
              style={styles.imagelayout3}
              source={{ uri: images[2] }}
            />
          </Pressable>
          <Pressable
            onPress={pressableFn(3)}
            style={styles.threePhotoTopSecondLayout}>
            <Image
              style={styles.imagelayout3}
              source={{ uri: images[3] }}
            />
          </Pressable>
        </View>
      </View>
    );
  } if (images.length > 4) {
    return (
      <View style={styles.threePhotoLayout}>
        <View style={styles.threePhotoTopLayout}>
          <Pressable
            onPress={pressableFn(0)}
            style={styles.threePhotoTopFirstLayout}>
            <Image
              style={styles.imagelayout3}
              source={{ uri: images[0] }}
            />
          </Pressable>
          <Pressable
            onPress={pressableFn(1)}
            style={styles.threePhotoTopSecondLayout}>
            <Image
              style={styles.imagelayout3}
              source={{ uri: images[1] }}
            />
          </Pressable>
        </View>
        <View style={styles.threePhotoTopLayout}>
          <Pressable
            onPress={pressableFn(2)}
            style={styles.threePhotoTopFirstLayout}>
            <Image
              style={styles.imagelayout3}
              source={{ uri: images[2] }}
            />
          </Pressable>
          <Pressable
            onPress={pressableFn(3)}
            style={styles.threePhotoTopSecondLayout}>
            <View
              style={{
                backgroundColor: COLORS.blue,
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0.5,
                zIndex: 1000,
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
                color: COLORS.white,
              }}>{`${images.length - 3}+`}</Text>
            <Image
              style={styles.imagelayout3}
              source={{ uri: images[3] }}
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
    maxHeight: 427,
    width: '100%',
    resizeMode: 'cover',
  },

  imagelayout2: {
    maxHeight: 405,
    width: '100%',
    resizeMode: 'cover',
  },

  imagelayout3: {
    resizeMode: 'cover',
  },

  twoPhotoLayout: {
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    maxHeight: 405,
  },

  threePhotoLayout: {
    width: '100%',
    height: 305,
    display: 'flex',
    flexDirection: 'column',
  },

  threePhotoTopLayout: {
    flex: 1,
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row',
  },

  threePhotoTopFirstLayout: { flex: 1, marginRight: 2 },
  threePhotoTopSecondLayout: { flex: 1 },
  threePhotoTopSecondBlurLayout: { flex: 1, backgroundColor: COLORS.blue },

  threePhotoBottomLayout: {
    flex: 1,
  },

  twoPhotoItemLayout: {
    flex: 1,
    marginHorizontal: 1,
  },
});

export default ImageLayouter;
