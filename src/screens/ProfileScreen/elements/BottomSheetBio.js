import * as React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

import {fonts} from '../../../utils/fonts';
import {Button} from '../../../components/Button';
import {BottomSheet} from '../../../components/BottomSheet';
import AutoFocusTextArea from '../../../components/TextArea/AutoFocusTextArea';
import {COLORS} from '../../../utils/theme';

// eslint-disable-next-line react/display-name
const BottomSheetBio = React.forwardRef((props, ref) => {
  return (
    <View>
      <BottomSheet
        ref={ref}
        closeOnPressMask={true}
        height={380}
        // pullBottom
        viewstyle={styles.bottomsheet}>
        <View style={styles.containerBottomSheet}>
          <Text style={styles.title}>{props.username} Edit prompt</Text>
          <AutoFocusTextArea
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder="Message prompt"
            keyboardAppearDelay={500}
            editable={!props.isOtherProfile}
          />
          <Text style={styles.description}>{props.value ? props.value.length : 0}/350</Text>
          {props.error ? <Text style={styles.errorText}>{props.error}</Text> : null}
        </View>
        {!props.isOtherProfile && (
          <Button style={styles.button} textStyling={styles.textStyling} onPress={props.handleSave}>
            {props.isLoadingUpdateBio ? <ActivityIndicator size="small" color="#0000ff" /> : 'Save'}
          </Button>
        )}
      </BottomSheet>
    </View>
  );
});

const styles = StyleSheet.create({
  bottomsheet: {
    paddingBottom: 20
  },
  containerBottomSheet: {
    flexDirection: 'column'
  },
  title: {
    fontFamily: fonts.inter[400],
    fontWeight: 'bold',
    fontSize: 24,
    color: COLORS.black,
    marginBottom: 16
  },
  description: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.blackgrey,
    marginTop: 7
  },
  errorText: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.redalert,
    marginTop: 7
  },
  button: {
    marginTop: 33,
    backgroundColor: COLORS.bondi_blue
  },
  textStyling: {
    fontFamily: fonts.inter[600],
    fontSize: 18,
    color: COLORS.white
  },
  input: {
    backgroundColor: COLORS.lightgrey,
    paddingVertical: 16,
    paddingHorizontal: 12,
    height: 150,
    justifyContent: 'flex-start',
    overflow: 'scroll',
    borderRadius: 8,
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 24
  }
});
export default React.memo(BottomSheetBio);
