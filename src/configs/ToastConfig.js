import React from 'react'
import { View, Text, StyleSheet } from 'react-native';


export const toastConfig = {
  center: ({ text1, text2 }) => (
    <View style={styles.container}>
      <Text>{text1}</Text>
      <Text>{text2}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        borderColor: '#f2f2f2',
        borderWidth: 1
    }
})