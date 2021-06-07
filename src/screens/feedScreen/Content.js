import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';

import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import SeeMore from 'react-native-see-more-inline';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import Gap from '../../components/Gap';
import Card from '../../components/Card/Card';

const {width: screenWidth} = Dimensions.get('window');

import PropTypes from 'prop-types';
import {isContainUrl, smartRender} from '../../utils/Utils';

const Content = ({message, images_url, style, onPress}) => {
  if (isContainUrl(message)) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.contentFeed,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        {smartRender(Card, {
          domain: 'guardian.com',
          date: 'May, 2, 2021',
          domainImage:
            'https://www.rollingstone.com/wp-content/uploads/2018/08/GettyImages-1020376858.jpg',
          title:
            "'Queen' rapper rescheduling dates to 2019 after deciding to &#8220;reevaluate elements of production on the 'NickiHndrxx Tour'",
          description:
            'Why choose one when you can wear both? These energizing pairings stand out from the crowd',
          image:
            'https://www.rollingstone.com/wp-content/uploads/2018/08/GettyImages-1020376858.jpg',
          url: 'https://www.rollingstone.com/music/music-news/nicki-minaj-cancels-north-american-tour-with-future-714315/',
        })}
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.contentFeed, style]}>
        {images_url !== null &&
        images_url !== '' &&
        images_url !== undefined ? (
          images_url.length > 0 ? (
            <View
              style={{
                flex: 1,
                paddingBottom: 16,
              }}>
              <SeeMore
                seeLessText={' '}
                numberOfLines={4}
                linkStyle={styles.textContentFeed}>
                {message}
              </SeeMore>
              <Gap height={16} />
              <FlatList
                style={{flex: 1}}
                horizontal={true}
                pagingEnabled={true}
                data={images_url}
                renderItem={({item, index}) => {
                  return (
                    <Image
                      source={{uri: item}}
                      style={{
                        flex: 1,
                        width: screenWidth - 32,
                        borderRadius: 16,
                      }}
                      resizeMode={'cover'}
                    />
                  );
                }}
                keyExtractor={({item, index}) => index}
              />
            </View>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
              }}>
              <SeeMore numberOfLines={10} linkStyle={styles.textContentFeed}>
                {message}
              </SeeMore>
            </View>
          )
        ) : null}
      </TouchableOpacity>
    );
  }
};

Content.propTypes = {
  message: PropTypes.string,
  images_url: PropTypes.array,
  style: PropTypes.object,
  onPress: PropTypes.func,
};

export default Content;

const styles = StyleSheet.create({
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
