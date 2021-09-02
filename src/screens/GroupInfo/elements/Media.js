import * as React from 'react';
import {Image} from 'react-native';
import {FlatList} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {Context} from '../../../context';

const Media = () => {
  const [groupChatState] = React.useContext(Context).groupChat;
  let {asset} = groupChatState;
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
        data={asset}
        numColumns={4}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <Image
            source={{
              uri: item.message.attachments[0].image_url,
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
