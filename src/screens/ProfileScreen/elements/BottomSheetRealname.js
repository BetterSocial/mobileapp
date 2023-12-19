import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import {Button} from '../../../components/Button';
import {BottomSheet} from '../../../components/BottomSheet';
import {fonts} from '../../../utils/fonts';
import {colors} from '../../../utils/colors';

const BottomSheetRealname = React.forwardRef((props, ref) => (
  <BottomSheet ref={ref} closeOnPressMask={true} height={300}>
    <View style={styles.containerBottomSheet}>
      <Text style={styles.textYourName}>Your name</Text>
      <TextInput
        autoFocus={true}
        style={styles.inputYourName}
        onChangeText={(text) => props.setTempFullName(text)}
        value={props.tempFullName}
        placeholder="Your Name"
        placeholderTextColor={colors.silver}
      />
      <Text style={styles.descriptionYourname}>
        Providing a common or real name is fully optional, but might make it
        easier for others to find you.
      </Text>
      {props.errorChangeRealName ? (
        <Text style={styles.errorText}>{props.errorChangeRealName}</Text>
      ) : null}
      <Button
        style={styles.button}
        textStyling={styles.textStyling}
        onPress={() => props.handleSave()}>
        {props.isChangeRealName ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          'Save'
        )}
      </Button>
    </View>
  </BottomSheet>
));

const styles = StyleSheet.create({
  containerBottomSheet: {
    flexDirection: 'column',
  },
  textYourName: {
    fontFamily: fonts.inter[800],
    fontWeight: 'bold',
    fontSize: 24,
    color: colors.black,
    marginBottom: 16,
  },
  inputYourName: {
    height: 52,
    backgroundColor: colors.wildSand,
    color: colors.black,
    fontFamily: fonts.inter[400],
    fontSize: 18,
  },
  descriptionYourname: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
    lineHeight: 24,
  },
  errorText: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 24,
    color: colors.red,
  },

  button: {
    marginTop: 50,
    backgroundColor: colors.bondi_blue,
  },
  textStyling: {
    fontFamily: fonts.inter[600],
    fontSize: 18,
    color: colors.white,
  },
});
export default BottomSheetRealname;
