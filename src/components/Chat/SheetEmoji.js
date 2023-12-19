import * as React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import EmojiSelector from 'react-native-emoji-selector';
import RBSheet from 'react-native-raw-bottom-sheet';
import {COLORS} from '../../utils/theme';

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
    backgroundColor: COLORS.alto,
    width: 60
  }
});
