import * as React from 'react';
import {Dimensions, FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import Image from 'react-native-fast-image';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const ImageLayouter = ({images = [], onimageclick}) => {
  const [height, setHeight] = React.useState({});
  const [width, setWidth] = React.useState({});
  const [ratio, setRatio] = React.useState({});

  const onloadHandle = (nativeEvent, index) => {
    setRatio({
      ...ratio,
      [`image_${index}`]: nativeEvent.height / nativeEvent.width
    });
    setHeight({
      ...height,
      [`image_${index}`]: nativeEvent.height
    });
    setWidth({
      ...width,
      [`image_${index}`]: nativeEvent.width
    });
  };

  const handleThreeImage = ({item, index}) => {
    let widthCalc = 0;
    let heightCalc = 0;
    if (ratio?.[`image_${index}`]) {
      if (index === 2) {
        widthCalc = Dimensions.get('window').width;
        heightCalc = widthCalc * ratio?.[`image_${index}`];
      } else {
        widthCalc = Dimensions.get('window').width / 2;
        heightCalc = widthCalc * ratio?.[`image_${index}`];
      }
    }
    return (
      <Pressable
        style={{flex: 1, justifyContent: 'flex-end'}}
        key={index}
        onPress={() => onimageclick(index)}>
        <Image
          style={[styles.imagelayout3, {height: heightCalc, width: widthCalc}]}
          source={{uri: item}}
          resizeMode={Image.resizeMode.cover}
          onLoad={({nativeEvent}) => onloadHandle(nativeEvent, index)}
        />
      </Pressable>
    );
  };

  const handleImage4 = ({item, index}) => {
    let widthCalc = 0;
    let heightCalc = 0;
    if (ratio?.[`image_${index}`]) {
      widthCalc = Dimensions.get('window').width / 2;
      heightCalc = widthCalc * ratio?.[`image_${index}`];
    }
    return (
      <Pressable
        style={{flex: 1, justifyContent: 'flex-end'}}
        key={index}
        onPress={() => onimageclick(index)}>
        <Image
          style={[styles.imagelayout3, {height: heightCalc, width: widthCalc}]}
          source={{uri: item}}
          resizeMode={Image.resizeMode.cover}
          onLoad={({nativeEvent}) => onloadHandle(nativeEvent, index)}
        />
      </Pressable>
    );
  };

  const handleImageMoreThan4 = ({item, index}) => {
    let widthCalc = 0;
    let heightCalc = 0;
    if (ratio?.[`image_${index}`]) {
      widthCalc = Dimensions.get('window').width / 2;
      heightCalc = widthCalc * ratio?.[`image_${index}`];
    }
    if (index === 3) {
      return (
        <Pressable
          onPress={() => onimageclick(index)}
          style={[styles.threePhotoTopSecondLayout, {justifyContent: 'flex-end'}]}>
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
              color: COLORS.white
            }}>{`${images.length - (images.length - 1)}+`}</Text>
          <Image
            style={[styles.imagelayout3, {height: heightCalc, width: widthCalc}]}
            source={{uri: item}}
            resizeMode={Image.resizeMode.cover}
            onLoad={({nativeEvent}) => onloadHandle(nativeEvent, index)}
          />
        </Pressable>
      );
    }
    if (index > 3) return null;
    return (
      <Pressable
        style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}
        key={index}
        onPress={() => onimageclick(index)}>
        <Image
          style={[styles.imagelayout3, {height: heightCalc, width: widthCalc}]}
          source={{uri: item}}
          resizeMode={Image.resizeMode.contain}
          onLoad={({nativeEvent}) => onloadHandle(nativeEvent, index)}
        />
      </Pressable>
    );
  };

  if (images.length === 1) {
    const heightCalc = Dimensions.get('window').width * ratio?.image_0 || 0;
    const widthCalc = Dimensions.get('window').width;
    return (
      <Pressable style={{flex: 1, justifyContent: 'flex-end'}} onPress={() => onimageclick(0)}>
        <Image
          resizeMode={Image.resizeMode.cover}
          source={{uri: images[0]}}
          style={[{height: heightCalc, width: widthCalc}]}
          onLoad={({nativeEvent}) => onloadHandle(nativeEvent, 0)}
        />
      </Pressable>
    );
  }
  if (images.length === 2) {
    return (
      <View style={styles.twoPhotoLayout}>
        {images.map((item, index) => {
          let widthCalc = 0;
          let heightCalc = 0;
          if (height?.[`image_${index}`] && ratio?.[`image_${index}`]) {
            widthCalc = Dimensions.get('window').width / 2;
            heightCalc = widthCalc * ratio?.[`image_${index}`];
          }

          return (
            <Pressable
              style={{flex: 1, justifyContent: 'flex-end'}}
              key={index}
              onPress={() => onimageclick(index)}>
              <Image
                style={[{height: heightCalc, width: widthCalc}]}
                source={{uri: item}}
                resizeMode={Image.resizeMode.cover}
                onLoad={({nativeEvent}) => onloadHandle(nativeEvent, index)}
              />
            </Pressable>
          );
        })}
      </View>
    );
  }
  if (images.length === 3) {
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={images}
        renderItem={handleThreeImage}
        numColumns={2}
      />
    );
  }
  if (images.length === 4) {
    return <FlatList numColumns={2} data={images} renderItem={handleImage4} />;
  }
  if (images.length > 4) {
    return (
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={images}
        numColumns={2}
        renderItem={handleImageMoreThan4}
      />
    );
  }

  return <></>;
};

const styles = StyleSheet.create({
  imagelayout1: {
    // maxHeight: 300,
    width: '100%'
    // resizeMode: 'cover'
  },

  imagelayout2: {
    // maxHeight: 300,
    width: '100%'
    // resizeMode: 'cover'
  },

  imagelayout3: {
    // resizeMode: 'cover'
  },

  twoPhotoLayout: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row'
  },

  threePhotoLayout: {
    width: '100%',
    height: 300,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'red',
    flexWrap: 'wrap'
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
    // height: 300,
    marginHorizontal: 0
  }
});

export default ImageLayouter;
