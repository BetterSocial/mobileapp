import React from 'react';
import {StyleSheet,View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors} from '../../utils/colors';

const BottomSheet = React.forwardRef((props, ref)=> {
  return (
    <RBSheet
      ref={ref}
      onOpen={() => props.onOpen ? props.onOpen() : {}}
      closeOnDragDown={true}
      closeOnPressMask={props.closeOnPressMask}
      height={props.height ? props.height : 260}
      customStyles={{
        container: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20
        },
        draggableIcon: {
          backgroundColor: colors.alto,
        },
      }}>
      <View style={{...styles.container, ...props.viewstyle}}>
        {props.children}
      </View>
    </RBSheet>
  );
})

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 38
  },
});