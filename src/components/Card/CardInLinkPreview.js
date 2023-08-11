import * as React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Linking,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native';

import Gap from '../Gap';
import Header from './CardHeaderInLinkPreview';
import NewsEmptyState from '../../assets/images/news-empty-state.png';
import TestIdConstant from '../../utils/testId';
import Image from '../Image';
import {sanitizeUrlForLinking} from '../../utils/Utils';
import {COLORS} from '../../utils/theme';
import {fonts} from '../../utils/fonts';

const CardStyle = StyleSheet.create({
  link: {
    color: COLORS.blue,
    textDecorationLine: 'underline',
    marginStart: 8,
    fontSize: 12
  },
  contentDomain: {flexDirection: 'row', alignItems: 'center'},
  containerDomain: {justifyContent: 'space-around'},
  date: {fontSize: 12, color: '#828282'},
  domain: {
    fontSize: 16,
    lineHeight: 16,
    color: '#000000',
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
    borderColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: 'rgba(0,0,0, 0.5)',
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
    color: '#000000',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 8,
    fontFamily: fonts.inter[600],
    paddingRight: 20,
    paddingLeft: 20
  },
  description: {
    color: COLORS.blackgrey,
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
      return (
        <Image testID="contentLinkImageUrlImage" style={CardStyle.image} source={{uri: image}} />
      );

    return (
      <Image
        testID="contentLinkImageEmptyStateImage"
        style={CardStyle.image}
        source={NewsEmptyState}
      />
    );
  };

  return (
    <View style={CardStyle.container}>
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
          <View style={CardStyle.content}>
            <View>
              <Text style={CardStyle.title}>
                {_.truncate(`${title}`, {length: 80, separator: ''})}
              </Text>
            </View>
            <View style={{flex: 1, height: 150}}>{renderImageComponent()}</View>
            <View>
              <Text style={CardStyle.description}>
                {_.truncate(`${description}`, {length: 120})}
                {/* {description} */}
                <Gap style={CardStyle.width(2)} />
                <Text
                  testID={TestIdConstant.contentLinkOpenLinkPress}
                  onPress={() => Linking.openURL(sanitizeUrlForLinking(url))}
                  style={CardStyle.link}>
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

export default Card;
