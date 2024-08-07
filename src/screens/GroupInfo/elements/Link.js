/* eslint-disable consistent-return */
import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Context} from '../../../context';

import ItemLink from './ItemLink';
import {COLORS} from '../../../utils/theme';

const Link = () => {
  const [groupChatState] = React.useContext(Context).groupChat;
  const {asset} = groupChatState;
  return (
    <View style={styles.container}>
      <FlatList
        data={asset}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          if (item.message.attachments[0].title_link !== undefined) {
            return (
              <ItemLink
                domain={item.message.attachments[0].author_name}
                link={item.message.attachments[0].title_link}
                image={item.message.attachments[0].image_url}
                title={item.message.attachments[0].title}
              />
            );
          }
        }}
      />
    </View>
  );
};

export default Link;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.almostBlack,
    paddingHorizontal: 20,
    paddingTop: 8
  }
});
