import React, {forwardRef, ReactNode, Ref} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import RBSheet, {RBSheetProps} from 'react-native-raw-bottom-sheet';
import {COLORS} from '../../utils/theme';
import dimen from '../../utils/dimen';

type BottomSheetProps = RBSheetProps & {
  viewstyle?: ViewStyle;
  pullBottom?: boolean;
  keyboardAvoidingViewEnabled?: boolean;
  onOpen?: () => void;
  closeOnPressMask?: boolean;
  children?: ReactNode;
};

const BottomSheetV2 = forwardRef((props: BottomSheetProps, ref: Ref<RBSheet>) => {
  const {pullBottom = false, keyboardAvoidingViewEnabled = false} = props;
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <RBSheet
      ref={ref}
      onOpen={() => (props.onOpen ? props.onOpen() : {})}
      closeOnDragDown={true}
      dragFromTopOnly={true}
      closeOnPressMask={props.closeOnPressMask}
      height={props.height ?? 355}
      keyboardAvoidingViewEnabled={keyboardAvoidingViewEnabled}
      customStyles={{
        container: {
          borderTopRightRadius: 12,
          borderTopLeftRadius: 12,
          justifyContent: pullBottom ? 'flex-end' : 'flex-start'
        },
        draggableIcon: styles.draggableIcon
      }}>
      <View style={{...styles.container, ...props.viewstyle}}>{props.children}</View>
    </RBSheet>
  );
});

BottomSheetV2.displayName = 'BottomSheet';

export default BottomSheetV2;

const styles = StyleSheet.create({
  container: {
    paddingTop: dimen.normalizeDimen(10),
    paddingHorizontal: dimen.normalizeDimen(20),
    paddingBottom: dimen.normalizeDimen(20)
  },
  draggableIcon: {
    backgroundColor: COLORS.gray100
  }
});
