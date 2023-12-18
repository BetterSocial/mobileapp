import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import RBSheet from 'react-native-raw-bottom-sheet';

import {colors} from '../../utils/colors';
import dimen from '../../utils/dimen';

const BottomSheet = React.forwardRef((props, ref) => {
  const {pullBottom = false} = props;
  return (
    <RBSheet
      ref={ref}
      onOpen={() => (props.onOpen ? props.onOpen() : {})}
      closeOnDragDown={true}
      closeOnPressMask={props.closeOnPressMask}
      height={props.height ? props.height : 355}
      customStyles={{
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
    paddingBottom: dimen.normalizeDimen(20)
  },
  containerSheet: (pullBottom) => ({
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: pullBottom ? 'flex-end' : 'flex-start'
  }),
  draggableIcon: {
    backgroundColor: colors.alto
  }
});
