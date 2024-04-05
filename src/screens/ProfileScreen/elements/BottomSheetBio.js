import * as React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import {fonts} from '../../../utils/fonts';
import {Button} from '../../../components/Button';
import {BottomSheet} from '../../../components/BottomSheet';
import AutoFocusTextArea from '../../../components/TextArea/AutoFocusTextArea';
import {COLORS} from '../../../utils/theme';
import dimen from '../../../utils/dimen';

// eslint-disable-next-line react/display-name
const BottomSheetBio = React.forwardRef((props, ref) => {
  return (
    <View>
      <BottomSheet
        ref={ref}
        closeOnPressMask={true}
        height={355}
        keyboardAvoidingViewEnabled={true}>
        <View style={styles.containerBottomSheet}>
          <Text style={styles.title}>{props.username} Edit prompt</Text>
          <AutoFocusTextArea
            value={props.value}
            onChangeText={props.onChangeText}
            placeholder="Message prompt"
            keyboardAppearDelay={1}
            editable={!props.isOtherProfile}
            maxLength={350}
            placeholderTextColor={COLORS.gray400}
          />
          <Text style={styles.description}>{props.value ? props.value.length : 0}/350</Text>
          {props.error ? <Text style={styles.errorText}>{props.error}</Text> : null}
        </View>
        {!props.isOtherProfile && (
          <Button
            styles={styles.button}
            textStyling={styles.textStyling}
            onPress={props.handleSave}>
            {props.isLoadingUpdateBio ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              'Save'
            )}
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
    color: COLORS.black,
    marginBottom: dimen.normalizeDimen(12)
  },
  description: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.gray400,
    marginTop: 7
  },
  errorText: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: COLORS.redalert,
    marginTop: dimen.normalizeDimen(7)
  },
  button: {
    backgroundColor: COLORS.signed_primary
  },
  textStyling: {
    fontFamily: fonts.inter[600],
    fontSize: 18,
    color: COLORS.white2
  }
});
export default React.memo(BottomSheetBio);
