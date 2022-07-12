import * as React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Gap from '../Gap';
import { COLORS } from '../../utils/theme';
import { FeedCredderRating } from '../CredderRating';
import { calculateTime } from '../../utils/time';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { sanitizeUrlForLinking } from '../../utils/Utils';
import Image from '../Image';

const Card = (props) => {
  const {
    date,
    description,
    domain,
    domainImage,
    image,
    item,
    onCardContentPress,
    onHeaderPress,
    score,
    title,
    url,
  } = props;
  // const styles = buildStylesheet('card', props.styles);
  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => onHeaderPress(item)}>
          <Header domain={domain} image={domainImage} date={date} score={score} />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <Pressable onPress={onCardContentPress} style={{ flex: 1 }}>
          <View style={styles.content}>
            <View>
              <Text style={styles.title}>
                {_.truncate(`${title}`, { length: 80, separator: '' })}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Image
                style={styles.image}
                source={image ? { uri: image } : null}
              />
            </View>
            <View>
              <Text style={styles.description}>
                {_.truncate(`${description}`, { length: 120 })}
                {/* {description} */}
                <Gap style={styles.width(2)} />
                <Text
                  onPress={() => Linking.openURL(sanitizeUrlForLinking(url))}
                  style={styles.link}>
                  Open Link
                </Text>
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const Header = ({ domain, image, date, score }) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerImageContainer}>
      <FastImage
        style={[
          { height: '100%', width: '100%', borderRadius: 45 },
          StyleSheet.absoluteFillObject,
        ]}
        source={{ uri: image }}
        resizeMode={'cover'}
      />
    </View>
    <Gap style={{ width: 0 }} />
    <View style={styles.headerDomainDateContainer}>
      <View style={styles.headerDomainDateRowContainer}>
        <Text style={styles.cardHeaderDomainName} numberOfLines={1}>{domain}</Text>
        <View style={styles.point} />
        {/* <Text style={styles.cardHeaderDate} numberOfLines={1}>{date}</Text> */}
        <Text style={styles.cardHeaderDate} numberOfLines={1}>{calculateTime(moment(date, 'DD MMM YYYY'))}</Text>
        <View style={styles.point} />
        <FeedCredderRating containerStyle={styles.credderRating} score={score} iconSize={16} scoreSize={12} />
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
  credderRating: {
    // height: 24,
    height: 16,
    alignSelf: 'center',
  },
  link: {
    color: '#2f80ed',
    textDecorationLine: 'underline',
    marginStart: 8,
    fontSize: 12,
  },
  contentDomain: { flexDirection: 'row', alignItems: 'center' },
  containerDomain: { justifyContent: 'space-around' },
  date: { fontSize: 12, color: '#828282' },
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
  imageHeader: { height: '100%', width: '100%', borderRadius: 45 },
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
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    // paddingTop: 12,
    paddingVertical: 8.5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerImageContainer: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: 'rgba(0,0,0,0.5)',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDomainDateContainer: {
    justifyContent: 'space-around',
    marginLeft: 8,
    flex: 1,
    alignSelf: 'center',
    // backgroundColor: 'red',
  },
  headerDomainDateRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    // paddingTop: 8,
    justifyContent: 'space-between',
    flex: 1,
    // backgroundColor: 'blue',
  },
  title: {
    color: '#000000',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 8,
    fontFamily: fonts.inter[600],
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
    width: 3,
    height: 3,
    borderRadius: 4,
    marginTop: 1,
    backgroundColor: colors.gray1,
    marginLeft: 6,
    marginRight: 6,
  },
  cardHeaderDomainName: {
    fontSize: 14,
    lineHeight: 16,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: fonts.inter[600],
    flexShrink: 1,
    // marginLeft: 8,
  },
  cardHeaderDate: {
    fontSize: 12,
    color: COLORS.gray,
    fontFamily: fonts.inter[400],
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
