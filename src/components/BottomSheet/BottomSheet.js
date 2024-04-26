import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import RBSheet from 'react-native-raw-bottom-sheet';

import {COLORS} from '../../utils/theme';
import dimen from '../../utils/dimen';

const BottomSheet = React.forwardRef((props, ref) => {
  const {pullBottom = false, keyboardAvoidingViewEnabled = false} = props;
  return (
    <RBSheet
      ref={ref}
      onOpen={() => (props.onOpen ? props.onOpen() : {})}
      closeOnDragDown={true}
      dragFromTopOnly={true}
      closeOnPressMask={props.closeOnPressMask}
      height={props.height ? props.height : 355}
      keyboardAvoidingViewEnabled={keyboardAvoidingViewEnabled}
      customStyles={{
        wrapper: {
          backgroundColor: COLORS.black80
        },
        container: styles.containerSheet(pullBottom),
        draggableIcon: styles.draggableIcon
      }}>
      <View style={{...styles.container, ...props.viewstyle}}>{props.children}</View>
    </RBSheet>
  );
});

BottomSheet.displayName = 'BottomSheet';

BottomSheet.propTypes = {
  height: PropTypes.number,
  viewstyle: PropTypes.object
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    paddingTop: dimen.normalizeDimen(10),
    paddingHorizontal: dimen.normalizeDimen(20),
    paddingBottom: dimen.normalizeDimen(20),
    backgroundColor: COLORS.almostBlack
  },
  containerSheet: (pullBottom) => ({
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: pullBottom ? 'flex-end' : 'flex-start',
    backgroundColor: COLORS.almostBlack
  }),
  draggableIcon: {
    backgroundColor: COLORS.gray110
  }
});
