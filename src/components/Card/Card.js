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

/**
 * Card element
 * @example ./examples/Card.md
 */
const Card = (props) => {
  const {title, description, image, url} = props;
  // const styles = buildStylesheet('card', props.styles);

  return (
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(sanitizeUrlForLinking(url));
      }}
      style={styles.container}>
      <Image
        style={styles.image}
        source={image ? {uri: image} : null}
        resizeMethod="resize"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{_.truncate(title, {length: 60})}</Text>
        <Text style={styles.description}>
          {_.truncate(description, {length: 60})}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  styles: PropTypes.object,
  pressed: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    margin: 15,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#C5D9E6',
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  title: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 17,
    marginBottom: 7,
  },
  description: {
    color: '#364047',
    fontSize: 13,
  },
});

export default Card;
