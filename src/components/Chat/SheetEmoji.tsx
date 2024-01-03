/* eslint-disable react/display-name */
import * as React from 'react';
import EmojiSelector from 'react-native-emoji-selector';
import RBSheet from 'react-native-raw-bottom-sheet';
import {StyleSheet, Text, View} from 'react-native';

import {colors} from '../../utils/colors';

const SheetEmoji = React.forwardRef(({selectEmoji}, ref) => {
  return (
    <RBSheet
      ref={ref}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        container: styles.container,
        draggableIcon: styles.draggableIcon
      }}>
      <View style={styles.containerEmoji}>
        <EmojiSelector
          columns={8}
          showHistory={true}
          onEmojiSelected={(emoji) => selectEmoji(emoji)}
        />
      </View>
    </RBSheet>
  );
});

export default SheetEmoji;
const styles = StyleSheet.create({
  containerEmoji: {flex: 1},
  container: {
    height: '80%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  draggableIcon: {
    backgroundColor: colors.alto,
    width: 60
  }
});
