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
import {smartRender} from '../../utils/Utils';

const dateFormat = (date) => {
  return date === undefined
    ? new Date().toLocaleDateString()
    : new Date(date).toLocaleDateString();
};

const ContentLink = ({og, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.contentFeed,
        {justifyContent: 'center', alignItems: 'center'},
      ]}>
      {smartRender(Card, {
        domain: og.domain,
        date: new Date(og.date).toLocaleDateString(),
        domainImage:
          og.domainImage !== ''
            ? og.domainImage
            : 'https://res.cloudinary.com/hpjivutj2/image/upload/v1617245336/Frame_66_1_xgvszh.png',
        title: og.title,
        description: og.description,
        image: og.image,
        url: og.url,
      })}
    </TouchableOpacity>
  );
};

// ContentLink.propTypes = {
//   og: PropTypes.object,
//   onPress: PropTypes.func,
// };

export default ContentLink;

const styles = StyleSheet.create({
  contentFeed: {
    flex: 1,
    marginTop: 12,
  },
});
