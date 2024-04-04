import * as React from 'react';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

import {Button} from '../Button';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const SpecificIssue = ({refSpecificIssue, onPress, onSkip, loading}) => {
  const [message, setMessage] = React.useState('');
  return (
    <RBSheet
      ref={refSpecificIssue}
      closeOnDragDown={true}
      closeOnPressMask={true}
      customStyles={{
        container: styles.container,
        draggableIcon: styles.draggableIcon
      }}>
      <View>
        <Text style={styles.title}>Please specify the issue</Text>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={(v) => setMessage(v)}
          textAlignVertical="top"
          multiline
          placeholder={'Please provide more details to inform our\n team (min. 50 characters)'}
          placeholderTextColor={COLORS.gray400}
        />
        <TouchableOpacity testID="button-skip-test" style={styles.btnSkip} onPress={() => onSkip()}>
          <Text style={styles.btnSkipText}>Skip & just block this account</Text>
          <IconFA5 name="chevron-right" size={17} color={COLORS.black} />
        </TouchableOpacity>
        <View style={styles.containerBtn}>
          <Button testID="button-report-test" onPress={() => onPress(message)}>
            {loading ? (
              <ActivityIndicator testID="loading-indicator-test" />
            ) : (
              <Text style={styles.containerBtnText}>File Report</Text>
            )}
          </Button>
        </View>
      </View>
    </RBSheet>
  );
};

export default SpecificIssue;

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.inter[700],
    fontSize: 18,
    color: COLORS.black,
    marginLeft: 21,
    marginTop: 18
  },
  containerBtn: {
    marginRight: 22,
    marginLeft: 18,
    marginBottom: 19
  },
  containerBtnText: {
    marginRight: 22,
    marginLeft: 18,
    marginBottom: 19,
    fontFamily: fonts.inter[500],
    fontSize: 16,
    color: COLORS.white
  },
  btn: {
    paddingLeft: 18,
    paddingRight: 22,
    paddingTop: 8
  },
  btnSkip: {
    backgroundColor: COLORS.gray100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    paddingVertical: 18,
    marginVertical: 22
  },
  btnSkipText: {
    fontFamily: fonts.inter[700],
    fontSize: 14,
    color: COLORS.black
  },
  input: {
    backgroundColor: COLORS.gray100,
    marginLeft: 17,
    marginRight: 23,
    borderRadius: 8,
    height: 233,
    marginTop: 14,
    paddingVertical: 19,
    paddingRight: 13,
    paddingLeft: 19,
    fontFamily: fonts.inter[400],
    color: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200
  },
  container: {
    height: 'auto',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: COLORS.almostBlack
  },
  draggableIcon: {
    backgroundColor: COLORS.gray100,
    width: 60
  }
});
