//
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

import _ from 'lodash';
import {sanitizeUrlForLinking} from '../../utils/Utils';
import {colors} from '../../utils/colors';
import MemoIc_rectangle_gradient from '../../assets/Ic_rectangle_gradient';
import {fonts} from '../../utils/fonts';
import Gap from '../Gap';

/**
 * Card element
 * @example ./examples/Card.md
 */
const Card = (props) => {
  const {title, description, image, url, domain, domainImage, date} = props;
  // const styles = buildStylesheet('card', props.styles);

  const Header = ({domain, image, date}) => (
    <View style={{flexDirection: 'row', padding: 8}}>
      <Image
        style={{width: 36, height: 36, borderRadius: 45}}
        source={{uri: image}}
      />
      <Gap style={{width: 8}} />
      <View style={{justifyContent: 'space-around'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 16,
              color: '#000000',
              fontWeight: 'bold',
              fontFamily: fonts.inter[600],
            }}>
            {domain}
          </Text>
          <View style={styles.point} />
          <Text style={{fontSize: 12, color: '#828282'}}>{date}</Text>
        </View>
        <MemoIc_rectangle_gradient height={10} width={180} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header domain={domain} image={domainImage} date={date} />
      <View style={styles.content}>
        <Text style={styles.title}>
          {_.truncate(title, {length: 60, separator: ''})}
        </Text>
        <Image
          style={styles.image}
          source={image ? {uri: image} : null}
          resizeMethod="resize"
        />
        <Text style={styles.description}>
          {/* {_.truncate(description, {length: 120})} */}
          {description}
          <Gap style={{width: 2}} />
          <Text
            onPress={() => Linking.openURL(sanitizeUrlForLinking(url))}
            style={{
              color: '#2f80ed',
              textDecorationLine: 'underline',
              marginStart: 8,
              fontFamily: 'bold',
              fontSize: 12,
            }}>
            Open Link
          </Text>
        </Text>
      </View>
    </View>
  );
};

Card.propTypes = {
  domain: PropTypes.string,
  domainImage: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  styles: PropTypes.object,
  pressed: PropTypes.func,
  date: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: 'rgba(0,0,0, 0.5)',
    overflow: 'hidden',
    paddingBottom: 8,
  },
  image: {
    width: '100%',
    height: 135,
  },
  content: {
    // padding: 8,
  },
  title: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 7,
    fontFamily: fonts.inter[400],
    paddingHorizontal: 8,
  },
  description: {
    color: '#364047',
    fontSize: 12,
    fontFamily: fonts.inter[600],
    paddingHorizontal: 8,
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8,
  },
});

export default Card;
