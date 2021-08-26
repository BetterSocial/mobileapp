import React from 'react';
import {FlatList} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';

import ItemLink from './ItemLink';

let dummyLink = [
  {
    domain: 'https://dev.to',
    link: 'https://dev.to/cassiocappellari/basic-concepts-of-node-js-pch',
    image:
      'https://i.picsum.photos/id/218/200/200.jpg?hmac=pIx-HTJBJRheNaHmhgqsQRX8JbTGvag_zic9NTNWFJU',
    title: 'Basic Concepts of Node.js',
  },
  {
    domain: 'https://dev.to',
    link: 'https://dev.to/cassiocappellari/basic-concepts-of-node-js-pch',
    image:
      'https://i.picsum.photos/id/218/200/200.jpg?hmac=pIx-HTJBJRheNaHmhgqsQRX8JbTGvag_zic9NTNWFJU',
    title:
      'animation-wrapper-view, declarative animations with imperative controls',
  },
  {
    domain: 'https://dev.to',
    link: 'https://dev.to/cassiocappellari/basic-concepts-of-node-js-pch',
    image:
      'https://i.picsum.photos/id/218/200/200.jpg?hmac=pIx-HTJBJRheNaHmhgqsQRX8JbTGvag_zic9NTNWFJU',
    title: 'Basic Concepts of Node.js',
  },
];
const Link = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={dummyLink}
        renderItem={({item, index}) => (
          <ItemLink
            key={String(index)}
            domain={item.domain}
            link={item.link}
            image={item.image}
            title={item.title}
          />
        )}
      />
    </View>
  );
};

export default Link;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
});
