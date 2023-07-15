import * as React from 'react';

import {Linking, Text, TouchableNativeFeedback, TouchableOpacity, View} from 'react-native';

import PropTypes from 'prop-types';
import _ from 'lodash';
import CardStyle from './style/CardStyle';
import Gap from '../Gap';
import Header from './CardHeader';
import Image from '../Image';
import NewsEmptyState from '../../assets/images/news-empty-state.png';
import TestIdConstant from '../../utils/testId';

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

  const onPressUrl = () => {
    if (Linking.canOpenURL(url)) {
      Linking.openURL(url);
    }
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
            <View style={{flex: 1}}>{renderImageComponent()}</View>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={onPressUrl}>
          <Text style={CardStyle.description}>
            {_.truncate(`${description}`, {length: 120})}
            <Gap style={CardStyle.width(2)} />
            <Text testID={TestIdConstant.contentLinkOpenLinkPress} style={CardStyle.link}>
              Open Link
            </Text>
          </Text>
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
