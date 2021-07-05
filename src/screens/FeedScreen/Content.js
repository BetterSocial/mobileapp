import * as React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import {useRoute} from '@react-navigation/native';

import PropTypes from 'prop-types';
import SeeMore from 'react-native-see-more-inline';

import Gap from '../../components/Gap';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import { COLORS } from '../../utils/theme';

const {width: screenWidth} = Dimensions.get('window');

const Content = ({message, images_url, style, onPress}) => {
  const route = useRoute();
  const cekImage = () => {
    return images_url !== null && images_url !== '' && images_url !== undefined;
  };

  return (
    <TouchableOpacity onPress={onPress} style={[styles.contentFeed, style]}>
      {cekImage() ? (
        images_url.length > 0 ? (
          <View style={styles.container}>
            <SeeMore
              seeLessText={' '}
              numberOfLines={4}
              linkStyle={styles.textContentFeed}>
              {message}
            </SeeMore>
            <Gap height={16} />
            <FlatList
              style={styles.fletlist}
              horizontal={true}
              pagingEnabled={true}
              data={images_url}
              renderItem={({item, index}) => {
                return (
                  <Image
                    source={{uri: item}}
                    style={styles.imageList}
                    resizeMode={'cover'}
                  />
                );
              }}
              keyExtractor={({item, index}) => index}
            />
          </View>
        ) : (
          <View style={styles.containerShowMessage(route.name)}>
            <SeeMore numberOfLines={10} linkStyle={styles.textContentFeed}>
              {message}
            </SeeMore>
          </View>
        )
      ) : null}
    </TouchableOpacity>
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
      alignItems: currentRouteName === 'Feed' ? 'center' : 'flex-start',
      flex: 1,
      paddingBottom: 10,
      minHeight: 100,
    };
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
