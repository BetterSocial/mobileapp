import * as React from 'react';
import {View, Text, Image, Linking, StyleSheet} from 'react-native';

import PropTypes from 'prop-types';
import _ from 'lodash';

import {sanitizeUrlForLinking} from '../../utils/Utils';
import {colors} from '../../utils/colors';
import MemoIc_rectangle_gradient from '../../assets/Ic_rectangle_gradient';
import {fonts} from '../../utils/fonts';
import Gap from '../Gap';

const Card = (props) => {
  const {title, description, image, url, domain, domainImage, date} = props;
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
          <Gap style={styles.width(2)} />
          <Text
            onPress={() => Linking.openURL(sanitizeUrlForLinking(url))}
            style={styles.link}>
            Open Link
          </Text>
        </Text>
      </View>
    </View>
  );
};
const Header = ({domain, image, date}) => (
  <View style={styles.constainerHeader}>
    <View style={styles.contentHeader}>
      <Image
        style={[styles.imageHeader, StyleSheet.absoluteFillObject]}
        source={{uri: image}}
        resizeMode={'cover'}
      />
    </View>
    <Gap style={styles.width(8)} />
    <View style={styles.containerDomain}>
      <View style={styles.contentDomain}>
        <Text style={styles.domain}>{domain}</Text>
        <View style={styles.point} />
        <Text style={styles.date}>{date}</Text>
      </View>
      <MemoIc_rectangle_gradient height={10} width={180} />
    </View>
  </View>
);
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
  link: {
    color: '#2f80ed',
    textDecorationLine: 'underline',
    marginStart: 8,
    fontFamily: 'bold',
    fontSize: 12,
  },
  contentDomain: {flexDirection: 'row', alignItems: 'center'},
  containerDomain: {justifyContent: 'space-around'},
  date: {fontSize: 12, color: '#828282'},
  domain: {
    fontSize: 16,
    lineHeight: 16,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: fonts.inter[600],
  },
  width: (width) => ({
    width,
  }),
  imageHeader: {height: '100%', width: '100%', borderRadius: 45},
  constainerHeader: {
    flexDirection: 'row',
    padding: 8,
  },
  contentHeader: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
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
