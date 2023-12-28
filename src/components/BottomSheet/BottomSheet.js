import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';

import {colors} from '../../utils/colors';

const BottomSheet = React.forwardRef((props, ref) => {
  const {pullBottom = false} = props;
  return (
    <RBSheet
      ref={ref}
      onOpen={() => (props.onOpen ? props.onOpen() : {})}
      closeOnDragDown={true}
      dragFromTopOnly={true}
      closeOnPressMask={props.closeOnPressMask}
      height={props.height ? props.height : 260}
      customStyles={{
        container: styles.containerSheet(pullBottom),
        draggableIcon: styles.draggableIcon,
      }}>
      <View style={{...styles.container, ...props.viewstyle}}>
        {props.children}
      </View>
    </RBSheet>
  );
});

BottomSheet.displayName = 'BottomSheet'

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 38,
  },
  containerSheet: (pullBottom) => ({
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: pullBottom ? 'flex-end' : 'flex-start',
  }),
  draggableIcon: {
    backgroundColor: colors.alto,
  },
});
