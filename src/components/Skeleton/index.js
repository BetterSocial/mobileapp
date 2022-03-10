import React from 'react'
import { View, StyleSheet } from 'react-native';

const index = ({ type }) => {
  const classes = `styles.${type}`;
  return (
    <View style={{ classes }} />
  )
}

const styles = StyleSheet.create({
  title: {
    width: 50,
    height: 50
  },
  text: {
    width: 200,
    height: 8
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  thumbnail: {
    width: 100,
    height: 100
  }
})

export default index