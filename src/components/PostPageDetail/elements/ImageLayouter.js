import * as React from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import Image from 'react-native-fast-image';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import usePostDetail from '../hooks/usePostDetail';

const ImageLayouter = ({images = [], onimageclick}) => {
  const [height, setHeight] = React.useState({});
  const [width, setWidth] = React.useState({});
  const [ratio, setRatio] = React.useState({});
  const {calculatedSizeScreen} = usePostDetail();
  const onloadHandle = (nativeEvent, index) => {
    setRatio({
      ...ratio,
      [`image${index}`]: nativeEvent.height / nativeEvent.width
    });
    setHeight({
      ...height,
      [`image${index}`]: nativeEvent.height
    });
    setWidth({
      ...width,
      [`image${index}`]: nativeEvent.width
    });
  };

  if (images.length === 1) {
    return (
      <View style={[styles.twoPhotoLayout, {flexWrap: 'wrap'}]}>
        <Pressable
          style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
          onPress={() => onimageclick(0)}>
          <Image
            resizeMode={Image.resizeMode.stretch}
            source={{uri: images[0]}}
            style={[
              {
                height:
                  (height?.image0 > Dimensions.get('window').height
                    ? calculatedSizeScreen - 62
                    : Dimensions.get('window').width) * (ratio.image0 || 0),
                width:
                  height?.image0 > Dimensions.get('window').height
                    ? calculatedSizeScreen - 62
                    : Dimensions.get('window').width
              }
            ]}
            onLoad={({nativeEvent}) => onloadHandle(nativeEvent, 0)}
          />
        </Pressable>
      </View>
    );
  }
  if (images.length === 2) {
    return (
      <View style={[styles.twoPhotoLayout, {flexWrap: 'wrap'}]}>
        {images.map((item, index) => {
          return (
            <Pressable
              style={{justifyContent: 'center'}}
              key={`image${index}`}
              onPress={() => onimageclick(index)}>
              <Image
                style={[
                  {
                    height:
                      (height[`image${index}`] > Dimensions.get('window').height
                        ? calculatedSizeScreen - 62
                        : Dimensions.get('window').width / 2) * (ratio[`image${index}`] || 0),
                    width:
                      height[`image${index}`] > Dimensions.get('window').height
                        ? calculatedSizeScreen - 62
                        : Dimensions.get('window').width / 2
                  }
                ]}
                source={{uri: item}}
                resizeMode={Image.resizeMode.stretch}
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
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {images.map((data, index) => {
          if (index === 2) {
            return (
              <Pressable
                style={{justifyContent: 'center'}}
                onPress={() => onimageclick(index)}
                key={`image${index}`}>
                <Image
                  source={{uri: data}}
                  onLoad={({nativeEvent}) => onloadHandle(nativeEvent, index)}
                  style={{
                    width:
                      height[`image${index}`] > Dimensions.get('window').height
                        ? calculatedSizeScreen - 62
                        : Dimensions.get('window').width,
                    height:
                      (height[`image${index}`] > Dimensions.get('window').height
                        ? calculatedSizeScreen - 62
                        : Dimensions.get('window').width) * (ratio[`image${index}`] || 0)
                  }}
                  resizeMode={Image.resizeMode.stretch}
                />
              </Pressable>
            );
          }
          return (
            <Pressable
              style={{justifyContent: 'center'}}
              onPress={() => onimageclick(index)}
              key={`image${index}`}>
              <Image
                source={{uri: data}}
                onLoad={({nativeEvent}) => onloadHandle(nativeEvent, index)}
                style={{
                  width:
                    height[`image${index}`] > Dimensions.get('window').height
                      ? calculatedSizeScreen - 62
                      : Dimensions.get('window').width / 2,
                  height:
                    (height[`image${index}`] > Dimensions.get('window').height
                      ? calculatedSizeScreen - 62
                      : Dimensions.get('window').width / 2) * (ratio[`image${index}`] || 0)
                }}
                resizeMode={Image.resizeMode.stretch}
              />
            </Pressable>
          );
        })}
      </View>
    );
  }
  if (images.length === 4) {
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {images.map((data, index) => {
          return (
            <Pressable
              style={{justifyContent: 'center'}}
              onPress={() => onimageclick(index)}
              key={`image${index}`}>
              <Image
                source={{uri: data}}
                onLoad={({nativeEvent}) => onloadHandle(nativeEvent, index)}
                style={{
                  width:
                    height[`image${index}`] > Dimensions.get('window').height
                      ? calculatedSizeScreen - 62
                      : Dimensions.get('window').width / 2,
                  height:
                    (height[`image${index}`] > Dimensions.get('window').height
                      ? calculatedSizeScreen - 62
                      : Dimensions.get('window').width / 2) * (ratio[`image${index}`] || 0)
                }}
                resizeMode={Image.resizeMode.stretch}
              />
            </Pressable>
          );
        })}
      </View>
    );
  }
  if (images.length > 4) {
    return (
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {images.map((data, index) => {
          return (
            <Pressable
              style={{justifyContent: 'center'}}
              onPress={() => onimageclick(index)}
              key={`image${index}`}>
              <>
                {index > 3 ? null : (
                  <>
                    {index === 3 && (
                      <>
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
                      </>
                    )}
                    <Image
                      source={{uri: data}}
                      onLoad={({nativeEvent}) => onloadHandle(nativeEvent, index)}
                      style={{
                        width:
                          height[`image${index}`] > Dimensions.get('window').height
                            ? calculatedSizeScreen - 62
                            : Dimensions.get('window').width / 2,
                        height:
                          (height[`image${index}`] > Dimensions.get('window').height
                            ? calculatedSizeScreen - 62
                            : Dimensions.get('window').width / 2) * (ratio[`image${index}`] || 0)
                      }}
                      resizeMode={Image.resizeMode.stretch}
                    />
                  </>
                )}
              </>
            </Pressable>
          );
        })}
      </View>
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
