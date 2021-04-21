import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {Button} from '../../components/Button';
import Gap from '../../components/Gap';

const SheetCloseBtn = ({backRef, goBack, continueToEdit}) => {
  return (
    <RBSheet
      ref={backRef}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        container: {
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          height: 240,
        },
        draggableIcon: {
          backgroundColor: colors.alto,
        },
      }}>
      <View style={styles.container}>
        <Text style={styles.header}>Are you sure?</Text>
        <Gap style={{height: 30}} />
        <Button onPress={continueToEdit}>
          <Text>Continue editing</Text>
        </Button>
        <Gap style={{height: 10}} />
        <Button
          onPress={goBack}
          style={{backgroundColor: colors.porcelain}}
          textStyling={{color: colors.black}}>
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
    paddingHorizontal: 20,
  },
  header: {
    color: colors.black,
    fontFamily: fonts.inter[600],
    fontSize: 18,
    fontWeight: 'bold',
  },
  containerBtn: {flexDirection: 'row'},
});
