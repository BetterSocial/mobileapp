import * as React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
} from 'react-native';

import Gap from '../Gap';
import Header from './CardHeaderInLinkPreview';
import NewsEmptyState from '../../assets/images/news-empty-state.png';
import TestIdConstant from '../../utils/testId';
import Image from '../Image';
import {COLORS} from '../../utils/theme';
import {fonts} from '../../utils/fonts';
import {sanitizeUrlForLinking} from '../../utils/Utils';

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
    url
  } = props;
  // const styles = buildStylesheet('card', props.styles);
  const renderImageComponent = () => {
    if (image)
      return <Image testID="contentLinkImageUrlImage" style={styles.image} source={{uri: image}} />;

    return (
      <Image
        testID="contentLinkImageEmptyStateImage"
        style={styles.image}
        source={NewsEmptyState}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => onHeaderPress(item)}
          testID={TestIdConstant.contentLinkHeaderPress}>
          <Header domain={domain} image={domainImage} date={date} score={score} />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1}}>
        <TouchableNativeFeedback
          onPress={onCardContentPress}
          style={{flex: 1}}
          testID={TestIdConstant.contentLinkContentPress}>
          <View style={styles.content}>
            <View>
              <Text style={styles.title}>
                {_.truncate(`${title}`, {length: 80, separator: ''})}
              </Text>
            </View>
            <View style={{flex: 1, height: 150}}>{renderImageComponent()}</View>
            <View>
              <Text style={styles.description}>
                {_.truncate(`${description}`, {length: 120})}
                {/* {description} */}
                <Gap style={styles.width(2)} />
                <Text
                  testID={TestIdConstant.contentLinkOpenLinkPress}
                  onPress={() => Linking.openURL(sanitizeUrlForLinking(url))}
                  style={styles.link}>
                  Open Link
                </Text>
              </Text>
            </View>
          </View>
        </TouchableNativeFeedback>
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
  date: PropTypes.string
};

const styles = StyleSheet.create({
  link: {
    color: COLORS.blue,
    textDecorationLine: 'underline',
    marginStart: 8,
    fontSize: 12
  },
  contentDomain: {flexDirection: 'row', alignItems: 'center'},
  containerDomain: {justifyContent: 'space-around'},
  date: {fontSize: 12, color: COLORS.gray410},
  domain: {
    fontSize: 16,
    lineHeight: 16,
    color: COLORS.black,
    fontWeight: 'bold',
    fontFamily: fonts.inter[600]
  },
  width: (width) => ({
    width
  }),
  imageHeader: {height: '100%', width: '100%', borderRadius: 45},
  constainerHeader: {
    flexDirection: 'row',
    padding: 8
  },
  contentHeader: {
    borderRadius: 45,
    borderWidth: 0.2,
    borderColor: COLORS.black50,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: COLORS.black50,
    overflow: 'hidden',
    paddingBottom: 8,
    flex: 1
  },
  image: {
    width: '100%',
    height: '100%'
  },
  content: {
    // paddingTop: 8,
    justifyContent: 'space-between',
    flex: 1
    // backgroundColor: 'blue',
  },
  title: {
    color: COLORS.black,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 8,
    fontFamily: fonts.inter[600],
    paddingRight: 20,
    paddingLeft: 20
  },
  description: {
    color: COLORS.gray410,
    fontSize: 12,
    fontFamily: fonts.inter[400],
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: 5,
    lineHeight: 18
  },
  openLinkText: {
    color: COLORS.blue,
    textDecorationLine: 'underline',
    marginStart: 8,
    fontSize: 12
  }
});

export default Card;
