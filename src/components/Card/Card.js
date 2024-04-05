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
import Header from './CardHeader';
import Image from '../Image';
import NewsEmptyState from '../../assets/images/news-empty-state.png';
import TestIdConstant from '../../utils/testId';
import dimen from '../../utils/dimen';
import {COLORS} from '../../utils/theme';
import {fonts, normalizeFontSizeByWidth} from '../../utils/fonts';

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
    heightTopic = 0,
    textHeight = 0,
    contentHeight,
    containerStyle
  } = props;
  // const styles = buildStylesheet('card', props.styles);
  const renderImageComponent = () => {
    if (image)
      return (
        <Image
          testID="contentLinkImageUrlImage"
          style={styles.image}
          source={{uri: image}}
          resizeMode="cover"
        />
      );

    return (
      <Image
        testID="contentLinkImageEmptyStateImage"
        style={styles.image}
        source={NewsEmptyState}
      />
    );
  };

  const onPressUrl = () => {
    if (Linking.canOpenURL(url)) {
      Linking.openURL(url);
    }
  };

  const calculateHeight = () => {
    if (contentHeight && typeof contentHeight === 'number') {
      return contentHeight - heightTopic - textHeight - 20;
    }
    return normalizeFontSizeByWidth(250);
  };

  return (
    <View style={[styles.container(calculateHeight()), containerStyle]}>
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
            <Text style={styles.title}>{_.truncate(`${title}`, {length: 80, separator: ''})}</Text>
            <View style={{flex: 1}}>{renderImageComponent()}</View>
            <TouchableNativeFeedback onPress={onPressUrl}>
              <Text style={styles.description}>
                {_.truncate(`${description}`, {length: 120})}
                <Gap style={styles.width(2)} />
                <Text testID={TestIdConstant.contentLinkOpenLinkPress} style={styles.link}>
                  Open Link
                </Text>
              </Text>
            </TouchableNativeFeedback>
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
  date: {fontSize: 12, color: COLORS.gray400},
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
  container: (height) => ({
    borderWidth: 1,
    borderRadius: 9,
    borderColor: COLORS.gray210,
    overflow: 'hidden',
    paddingBottom: 8,
    marginBottom: 5,
    height
  }),
  image: {
    flex: 1
  },
  content: {
    flex: 1
  },
  title: {
    color: COLORS.black,
    fontWeight: '600',
    fontSize: normalizeFontSizeByWidth(14),
    lineHeight: dimen.normalizeDimen(17),
    marginBottom: dimen.normalizeDimen(4),
    fontFamily: fonts.inter[600],
    paddingRight: dimen.normalizeDimen(20),
    paddingLeft: dimen.normalizeDimen(20)
  },
  description: {
    color: COLORS.gray400,
    fontSize: normalizeFontSizeByWidth(12),
    fontFamily: fonts.inter[400],
    paddingRight: dimen.normalizeDimen(20),
    paddingLeft: dimen.normalizeDimen(20),
    marginTop: dimen.normalizeDimen(4),
    lineHeight: dimen.normalizeDimen(18)
  },
  openLinkText: {
    color: COLORS.blue,
    textDecorationLine: 'underline',
    marginStart: 8,
    fontSize: 12
  }
});

export default Card;
