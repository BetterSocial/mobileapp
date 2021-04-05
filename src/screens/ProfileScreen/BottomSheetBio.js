import React from 'react';
import {forwardRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Button} from '../../components/Button';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {BottomSheet} from '../../components/BottomSheet';
import {TextArea} from '../../components/TextArea';

const BottomSheetBio = forwardRef((props, ref) => (
  <BottomSheet ref={ref} closeOnPressMask={true} height={470}>
    <View style={styles.containerBottomSheet}>
      <Text style={styles.title}>Update your bio</Text>
      <TextArea
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder="Add Bio"
      />
      <Text style={styles.description}>350/350</Text>
      {props.error ? <Text style={styles.errorText}>{props.error}</Text> : null}
    </View>
    <Button
      style={styles.button}
      textStyling={styles.textStyling}
      onPress={() => (props.error ? null : props.handleSave())}>
      {props.isLoadingUpdateBio ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        'Save'
      )}
    </Button>
  </BottomSheet>
));

const styles = StyleSheet.create({
  containerBottomSheet: {
    flexDirection: 'column',
  },
  title: {
    fontFamily: fonts.inter[400],
    fontWeight: 'bold',
    fontSize: 24,
    color: colors.black,
    marginBottom: 16,
  },
  description: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
    marginTop: 7,
  },
  errorText: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.red,
    marginTop: 7,
  },
  button: {
    marginTop: 33,
    backgroundColor: colors.bondi_blue,
  },
  textStyling: {
    fontFamily: fonts.inter[600],
    fontSize: 18,
    color: colors.white,
  },
});
export default BottomSheetBio;
