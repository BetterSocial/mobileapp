import * as React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../../utils/theme';
import {fonts} from '../../../utils/fonts';
import FastImage from 'react-native-fast-image';

const ImageLayouter = ({images = [], onimageclick, height}) => {
  if (images.length === 1) {
    return (
      <Pressable onPress={() => onimageclick(0)}>
        <FastImage
          source={{uri: images[0],  priority: FastImage.priority.normal,}}
          style={styles.imagelayout1}
          width={'100%'}
          height={'100%'}
        />
      </Pressable>
    );
  } else if (images.length === 2) {
    return (
      <View style={styles.twoPhotoLayout}>
        {images.map((item, index) => {
          return (
            <View key={`image-layouter-${index}`} style={styles.twoPhotoItemLayout}>
              <Pressable onPress={() => onimageclick(index)}>
                <FastImage
                  style={styles.imagelayout2}
                  source={{uri: item,  priority: FastImage.priority.normal,}}
                  width={'100%'}
                  height={'100%'}
                />
              </Pressable>
            </View>
          );
        })}
      </View>
    );
  } else if (images.length === 3) {
    return (
      <View style={styles.threePhotoLayout}>
        <View style={styles.threePhotoTopLayout}>
          <Pressable
            onPress={() => onimageclick(0)}
            style={styles.threePhotoTopFirstLayout}>
            <FastImage
              style={styles.imagelayout3}
              source={{uri: images[0],  priority: FastImage.priority.normal,}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
          <Pressable
            onPress={() => onimageclick(1)}
            style={styles.threePhotoTopSecondLayout}>
            <FastImage
              style={styles.imagelayout3}
              source={{uri: images[1],  priority: FastImage.priority.normal,}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
        </View>
        <View style={styles.threePhotoBottomLayout}>
          <Pressable onPress={() => onimageclick(2)}>
            <FastImage
              style={styles.imagelayout2}
              source={{uri: images[2],  priority: FastImage.priority.normal,}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
        </View>
      </View>
    );
  } else if (images.length === 4) {
    return (
      <View style={styles.threePhotoLayout}>
        <View style={styles.threePhotoTopLayout}>
          <Pressable
            onPress={() => onimageclick(0)}
            style={styles.threePhotoTopFirstLayout}>
            <FastImage
              style={styles.imagelayout3}
              source={{uri: images[0],  priority: FastImage.priority.normal,}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
          <Pressable
            onPress={() => onimageclick(1)}
            style={styles.threePhotoTopSecondLayout}>
            <FastImage
              style={styles.imagelayout3}
              source={{uri: images[1],  priority: FastImage.priority.normal,}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
        </View>
        <View style={styles.threePhotoTopLayout}>
          <Pressable
            onPress={() => onimageclick(2)}
            style={styles.threePhotoTopFirstLayout}>
            <FastImage
              style={styles.imagelayout3}
              source={{uri: images[2],  priority: FastImage.priority.normal,}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
          <Pressable
            onPress={() => onimageclick(3)}
            style={styles.threePhotoTopSecondLayout}>
            <FastImage
              style={styles.imagelayout3}
              source={{uri: images[3],  priority: FastImage.priority.normal,}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
        </View>
      </View>
    );
  } else if (images.length > 4) {
    return (
      <View style={styles.threePhotoLayout}>
        <View style={styles.threePhotoTopLayout}>
          <Pressable
            onPress={() => onimageclick(0)}
            style={styles.threePhotoTopFirstLayout}>
            <FastImage
              style={styles.imagelayout3}
              source={{uri: images[0],  priority: FastImage.priority.normal,}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
          <Pressable
            onPress={() => onimageclick(1)}
            style={styles.threePhotoTopSecondLayout}>
            <FastImage
              style={styles.imagelayout3}
              source={{uri: images[1],  priority: FastImage.priority.normal,}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
        </View>
        <View style={styles.threePhotoTopLayout}>
          <Pressable
            onPress={() => onimageclick(2)}
            style={styles.threePhotoTopFirstLayout}>
            <FastImage
              style={styles.imagelayout3}
              source={{uri: images[2],  priority: FastImage.priority.normal,}}
              width={'100%'}
              height={'100%'}
            />
          </Pressable>
          <Pressable
            onPress={() => onimageclick(3)}
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
            <FastImage
              style={styles.imagelayout3}
              source={{uri: images[3],  priority: FastImage.priority.normal}}
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

  threePhotoTopFirstLayout: {flex: 1, marginRight: 2},
  threePhotoTopSecondLayout: {flex: 1},
  threePhotoTopSecondBlurLayout: {flex: 1, backgroundColor: COLORS.blue},

  threePhotoBottomLayout: {
    flex: 1,
  },

  twoPhotoItemLayout: {
    flex: 1,
    marginHorizontal: 1,
  },
});

export default ImageLayouter;
