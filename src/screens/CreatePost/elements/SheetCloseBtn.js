import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import RBSheet from 'react-native-raw-bottom-sheet';

import {Button} from '../../../components/Button';
import Gap from '../../../components/Gap';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';

const SheetCloseBtn = ({backRef, goBack, continueToEdit}) => {
  return (
    <RBSheet
      ref={backRef}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        wrapper: {
          backgroundColor: COLORS.black80
        },
        container: styles.containerSheet,
        draggableIcon: styles.draggableIcon
      }}>
      <View style={styles.container}>
        <Text style={styles.header}>Are you sure?</Text>
        <Gap style={styles.gap(30)} />
        {/* TODO: Garry warna sesuai mode */}
        <Button onPress={continueToEdit}>
          <Text>Continue editing</Text>
        </Button>
        <Gap style={styles.gap(10)} />
        <Button
          onPress={goBack}
          styles={{
            backgroundColor: COLORS.gray110
          }}
          textStyling={{color: COLORS.black}}>
          <Text>Discard post</Text>
        </Button>
      </View>
    </RBSheet>
  );
};

export default SheetCloseBtn;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 38,
    paddingHorizontal: 20
  },
  header: {
    color: COLORS.black,
    fontFamily: fonts.inter[600],
    fontSize: 18,
    fontWeight: 'bold'
  },
  containerBtn: {flexDirection: 'row'},
  containerSheet: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    height: 240,
    backgroundColor: COLORS.almostBlack
  },
  draggableIcon: {
    backgroundColor: COLORS.gray110
  },
  gap: (height) => ({
    height
  })
});
