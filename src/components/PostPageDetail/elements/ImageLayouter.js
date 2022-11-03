import * as React from 'react';
import FastImage from 'react-native-fast-image';

import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import Image from '../../../components/Image';

const ImageLayouter = ({images = [], onimageclick}) => {
  const handleImageWidth = (index) => {
    
    if(images.length > 2 && images.length % 2 === 0) {
      return {
        height: '50%',
        width: '50%',
      }
    }
    if(images.length > 2 && images.length % 2 === 1) {
      if(index === images.length -  1) {
        return {
          height: '50%',
          width: '100%'
        }
      }
      return {
          height: '50%',
          width: '50%'
        }
    }
    if(images.length === 2) {
      return {
        height: '100%',
        width: '50%'
      }
    }
     return {
        height: '100%',
        width: '100%'
      }
 
  }

  const renderImages = ({item, index}) => (
    <React.Fragment key={index} >

          {index > 3 ? null : <Pressable
            style={handleImageWidth(index)}
            onPress={() => onimageclick(index)}
            >
              {index ===  3 && images.length - 4 > 0 ? <View style={styles.backdropBg} >
                <Text style={styles.allImageFont} >{images.length - 4}+ </Text>
              </View> : null}
              <React.Fragment>
                <Image 
              source={{uri: item}}
              style={{height: 305, width: '100%'}}
              resizeMode={FastImage.resizeMode.cover}
              />
              </React.Fragment>
        </Pressable>}
          
        </React.Fragment>
  )

  return (
    <>
   <View  style={styles.imageContainer}  >
    <FlatList 
    data={images}
    numColumns={2}
    renderItem={renderImages}
    />
   </View>
   
   </>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    // backgroundColor:'blue', 
    height: '100%', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  imageItem: {
    height: `50%` , 
    width: '50%',
  },
  imageStyle: {
    height: '100%', width: '100%'
  },
  backdropBg: {
    position: 'absolute', 
    backgroundColor: 'black', 
    height: '100%', 
    width: '100%', 
    zIndex: 1, opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  allImageFont: {
    fontSize: 32,
    color:'white',
    fontWeight: 'bold'
  }
});

export default ImageLayouter;