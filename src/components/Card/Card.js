//
import * as React from 'react';
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
  const {
    title,
    description,
    image,
    url,
    domain,
    domainImage,
    date,
    onCardPress,
  } = props;
  // const styles = buildStylesheet('card', props.styles);

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
        <MemoIc_rectangle_gradient height={10} width={180} />
      </View>
    </View>
  );

  return (
    <TouchableOpacity onPress={onCardPress}>
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
              style={styles.openLinkText}>
              Open Link
            </Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 8,
    fontFamily: fonts.inter[700],
    paddingHorizontal: 8,
    paddingRight: 20,
    paddingLeft: 20,
  },
  description: {
    color: '#364047',
    fontSize: 12,
    fontFamily: fonts.inter[600],
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 5,
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
  cardHeaderDomainName: {
    fontSize: 12,
    lineHeight: 16,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: fonts.inter[600],
    // marginLeft: 8,
  },
  cardHeaderDate: {
    fontSize: 12,
    color: '#828282',
    fontFamily: fonts.inter[200],
  },
  openLinkText: {
    color: '#2f80ed',
    textDecorationLine: 'underline',
    marginStart: 8,
    fontFamily: 'bold',
    fontSize: 12,
  },
});

export default Card;
