import * as React from 'react';
import {Image, FlatList, StyleSheet, View} from 'react-native';
import {Context} from '../../../context';
import useMedia from './useMedia';
import {COLORS} from '../../../utils/theme';

const Media = () => {
  const [groupChatState] = React.useContext(Context).groupChat;
  const {asset} = groupChatState;
  const {getSpace} = useMedia();

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
              uri: item.message.attachments[0].image_url
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
    backgroundColor: COLORS.white,
    alignItems: 'center',
    flexWrap: 'nowrap',
    paddingTop: 8
  },
  image: (isFirst) => ({
    width: 80,
    height: 80,
    marginLeft: isFirst ? 0 : 5,
    marginBottom: 5
  })
});
