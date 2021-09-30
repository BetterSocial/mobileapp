import * as React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  FlatList,
  Pressable,
  Text,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import PropTypes from 'prop-types';
import SeeMore from 'react-native-see-more-inline';

import Gap from '../../components/Gap';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';
import ImageLayouter from './elements/ImageLayouter';
import {TouchableWithoutFeedback} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

const Content = ({message, images_url, style, onPress}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const cekImage = () => {
    return images_url !== null && images_url !== '' && images_url !== undefined;
  };

  const onImageClickedByIndex = (index) => {
    console.log(index);
    navigation.push('ImageViewer', {
      title: 'Photo',
      index,
      images: images_url.reduce((acc, current) => {
        acc.push({url: current});
        return acc;
      }, []),
    });
  };

  const handleText = (text, onPress) => {
    if (text.length > 750) {
      return (
        <Text style={styles.text(text)}>
          {`${text.substring(0, 750).trim()} `}
          <Text onPress={onPress} style={styles.seemore}>
            ...more
          </Text>
        </Text>
      );
    } else {
      return <Text style={styles.text(text)}>{text}</Text>;
    }
  };

  return (
    <Pressable onPress={onPress} style={[styles.contentFeed, style]}>
      {cekImage() ? (
        images_url.length > 0 ? (
          <View style={styles.container}>
            {handleText(message, onPress)}
            <Gap height={16} />
            <ImageLayouter
              images={images_url}
              onimageclick={onImageClickedByIndex}
            />
          </View>
        ) : (
          <View style={styles.containerShowMessage(route.name)}>
            {handleText(message, onPress)}
          </View>
        )
      ) : null}
    </Pressable>
  );
};

Content.propTypes = {
  message: PropTypes.string,
  images_url: PropTypes.array,
  style: PropTypes.object,
  onPress: PropTypes.func,
};

export default Content;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
  },
  fletlist: {flex: 1},
  imageList: {
    flex: 1,
    width: screenWidth - 32,
    borderRadius: 16,
  },
  containerShowMessage: (currentRouteName) => {
    return {
      justifyContent: 'center',
      alignItems: currentRouteName === 'Feed' ? 'center' : 'center',
      flex: 1,
      paddingBottom: 10,
      minHeight: 100,
    };
  },
  text: (text) => {
    console.log(text.length);
    if (text.length < 270) {
      return {
        fontFamily: fonts.inter[400],
        fontWeight: 'normal',
        fontSize: 24,
        color: colors.black,
        lineHeight: 44,
      };
    }
    return {
      fontFamily: fonts.inter[400],
      fontWeight: 'normal',
      fontSize: 16,
      color: colors.black,
      lineHeight: 24,
    };
  },

  seemore: {
    color: COLORS.blue,
  },
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerFeedProfile: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 13,
  },

  feedUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
  containerFeedText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  feedDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.black,
    lineHeight: 18,
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8,
  },
  contentFeed: {
    flex: 1,
    marginTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.white,
  },
  textContentFeed: {
    fontFamily: fonts.inter[400],
    fontSize: 24,
    lineHeight: 24,
    color: colors.black,
  },
  textComment: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: colors.gray,
  },
  usernameComment: {
    fontFamily: fonts.inter[500],
    fontWeight: '900',
    fontSize: 12,
    lineHeight: 24,
    color: colors.black,
  },
  usernameTextComment: {
    fontFamily: fonts.inter[500],
    fontSize: 12,
    lineHeight: 24,
    color: colors.gray,
  },
  item: {
    width: screenWidth - 20,
    height: screenWidth - 20,
    marginTop: 10,
    marginLeft: -20,
    backgroundColor: 'pink',
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    aspectRatio: 1.5,
    resizeMode: 'cover',
  },
  imageAnonimity: {
    marginRight: 8,
    width: 32,
    height: 32,
  },
});
