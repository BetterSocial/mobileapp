import * as React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Gap from '../Gap';
import MemoIc_rectangle_gradient from '../../assets/Ic_rectangle_gradient';
import {COLORS} from '../../utils/theme';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {sanitizeUrlForLinking} from '../../utils/Utils';

const Card = (props) => {
  const {
    title,
    description,
    image,
    url,
    domain,
    domainImage,
    date,
    onHeaderPress,
    onCardContentPress,
  } = props;
  // const styles = buildStylesheet('card', props.styles);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onHeaderPress}>
        <Header domain={domain} image={domainImage} date={''} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onCardContentPress}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {_.truncate(`${title}`, {length: 80, separator: ''})}
          </Text>
          <Image
            style={styles.image}
            source={image ? {uri: image} : null}
            resizeMethod="resize"
          />
          <Text style={styles.description}>
            {_.truncate(`${description}`, {length: 120})}
            {/* {description} */}
            <Gap style={styles.width(2)} />
            <Text
              onPress={() => Linking.openURL(sanitizeUrlForLinking(url))}
              style={styles.link}>
              Open Link
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Header = ({domain, image, date}) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerImageContainer}>
      <Image
        style={[
          {height: '100%', width: '100%', borderRadius: 45},
          StyleSheet.absoluteFillObject,
        ]}
        source={{uri: image}}
        resizeMode={'cover'}
      />
    </View>
    <Gap style={{width: 8}} />
    <View style={styles.headerDomainDateContainer}>
      <View style={styles.headerDomainDateRowContainer}>
        <Text style={styles.cardHeaderDomainName}>{domain}</Text>
        <View style={styles.point} />
        <Text style={styles.cardHeaderDate}>{date}</Text>
      </View>
      {/* <MemoIc_rectangle_gradient height={10} width={180} /> */}
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
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerImageContainer: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDomainDateContainer: {
    justifyContent: 'space-around',
    marginLeft: 8,
  },
  headerDomainDateRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 135,
  },
  content: {
    paddingTop: 8,
  },
  title: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 8,
    fontFamily: fonts.inter[600],
    paddingHorizontal: 8,
    paddingRight: 20,
    paddingLeft: 20,
  },
  description: {
    color: COLORS.blackgrey,
    fontSize: 12,
    fontFamily: fonts.inter[400],
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 5,
    lineHeight: 18,
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    marginTop: 2,
    backgroundColor: colors.gray1,
    marginLeft: 8,
    marginRight: 8,
  },
  cardHeaderDomainName: {
    fontSize: 12,
    lineHeight: 16,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: fonts.inter[600],
    // marginLeft: 8,
  },
  cardHeaderDate: {
    fontSize: 10,
    color: COLORS.blackgrey,
    fontFamily: fonts.inter[200],
    // lineHeight: 12.1,
  },
  openLinkText: {
    color: '#2f80ed',
    textDecorationLine: 'underline',
    marginStart: 8,
    fontSize: 12,
  },
});

export default Card;
