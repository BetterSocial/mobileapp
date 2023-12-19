import * as React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {fonts} from '../../../utils/fonts';
import {colors} from '../../../utils/colors';
import {Button} from '../../../components/Button';
import {BottomSheet} from '../../../components/BottomSheet';
import AutoFocusTextArea from '../../../components/TextArea/AutoFocusTextArea';
import dimen from '../../../utils/dimen';

// eslint-disable-next-line react/display-name
const BottomSheetBio = React.forwardRef((props, ref) => {
  return (
    <View>
      <BottomSheet ref={ref} closeOnPressMask={true} height={355}>
        <View style={styles.containerBottomSheet}>
          <Text style={styles.title}>{props.username} Edit prompt</Text>
          <AutoFocusTextArea
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder="Message prompt"
            keyboardAppearDelay={500}
            editable={!props.isOtherProfile}
            maxLength={350}
          />
          <Text style={styles.description}>{props.value ? props.value.length : 0}/350</Text>
          {props.error ? <Text style={styles.errorText}>{props.error}</Text> : null}
        </View>
        {!props.isOtherProfile && (
          <Button
            styles={styles.button}
            textStyling={styles.textStyling}
            onPress={props.handleSave}>
            {props.isLoadingUpdateBio ? <ActivityIndicator size="small" color="#0000ff" /> : 'Save'}
          </Button>
        )}
      </BottomSheet>
    </View>
  );
});

BottomSheetBio.propTypes = {
  handleSave: PropTypes.func
};

const styles = StyleSheet.create({
  containerBottomSheet: {
    flexDirection: 'column',
    marginBottom: dimen.normalizeDimen(20)
  },
  title: {
    fontFamily: fonts.inter[400],
    fontWeight: 'bold',
    fontSize: 24,
    color: colors.black,
    marginBottom: dimen.normalizeDimen(12)
  },
  description: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.gray,
    marginTop: 7
  },
  errorText: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.red,
    marginTop: dimen.normalizeDimen(7)
  },
  button: {
    backgroundColor: colors.bondi_blue
  },
  textStyling: {
    fontFamily: fonts.inter[600],
    fontSize: 18,
    color: colors.white
  }
});
export default React.memo(BottomSheetBio);
