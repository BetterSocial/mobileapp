import React from 'react';
import {Image} from 'react-native';
import {FlatList} from 'react-native';
import {StyleSheet, View} from 'react-native';

const Media = () => {
  const [count, setCount] = React.useState(5);
  const getSpace = (index) => {
    if (index === 0 && index + 1 === count) {
      setCount(index + 1 === count);
      return true;
    } else {
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]}
        numColumns={4}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <Image
            key={String(index)}
            source={{
              uri:
                'https://i.picsum.photos/id/218/200/200.jpg?hmac=pIx-HTJBJRheNaHmhgqsQRX8JbTGvag_zic9NTNWFJU',
            }}
            width={80}
            height={80}
            style={styles.image(getSpace(index))}
          />
        )}
      />
    </View>
  );
};

export default Media;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexWrap: 'nowrap',
    paddingTop: 8,
  },
  image: (isFirst) => ({
    width: 80,
    height: 80,
    marginLeft: isFirst ? 0 : 5,
    marginBottom: 5,
  }),
});
