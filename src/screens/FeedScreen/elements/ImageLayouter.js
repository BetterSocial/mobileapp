import * as React from 'react';
import FastImage from 'react-native-fast-image';

import {Pressable, StyleSheet, Text, View} from 'react-native';
import Image from '../../../components/Image';
import useImageLayout from '../hooks/useImageLayout';

const ImageLayouter = ({images = [], onimageclick}) => {
  const {handleImageWidth} = useImageLayout()

  return (
    <>
   <View  style={styles.imageContainer}  >
      {images.length > 0 && images.map((image, index) => (
        <React.Fragment key={index} >

          {index > 3 ? null : <Pressable
            testID='press'
            style={handleImageWidth(images, index)}
            onPress={() => onimageclick(index)}
            >
              {index ===  3 && images.length - 4 > 0 ? <View style={styles.backdropBg} >
                <Text style={styles.allImageFont} >{images.length - 4}+ </Text>
              </View> : null}
              <React.Fragment>
                <Image 
              source={{uri: image}}
              style={styles.imageStyle}
              resizeMode={FastImage.resizeMode.cover}
              />
              </React.Fragment>
        </Pressable>}
          
        </React.Fragment>
        
      ))}
   </View>
   
   </>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
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
