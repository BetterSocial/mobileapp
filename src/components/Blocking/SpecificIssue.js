import * as React from 'react';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

import {Button} from '../Button';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

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
        />
        <TouchableOpacity testID="button-skip-test" style={styles.btnSkip} onPress={() => onSkip()}>
          <Text style={styles.btnSkipText}>Skip & just block this account</Text>
          <IconFA5 name="chevron-right" size={17} color={'#000'} />
        </TouchableOpacity>
        <View style={styles.containerBtn}>
          <Button testID="button-report-test" onPress={() => onPress(message)}>
            {loading ? (
              <ActivityIndicator testID="loading-indicator-test" />
            ) : (
              <Text>File Report</Text>
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
    color: '#000',
    marginLeft: 21,
    marginTop: 18
  },
  containerBtn: {
    marginRight: 22,
    marginLeft: 18,
    marginBottom: 19
  },
  btn: {
    paddingLeft: 18,
    paddingRight: 22,
    paddingTop: 8
  },
  btnSkip: {
    backgroundColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
    paddingVertical: 18,
    marginVertical: 22
  },
  btnSkipText: {
    fontFamily: fonts.inter[700],
    fontSize: 14,
    color: '#000'
  },
  input: {
    backgroundColor: colors.lightgrey,
    marginLeft: 17,
    marginRight: 23,
    borderRadius: 8,
    height: 233,
    marginTop: 14,
    paddingVertical: 19,
    paddingRight: 13,
    paddingLeft: 19,
    fontFamily: fonts.inter[400],
    color: colors.gray
  },
  container: {
    height: 'auto',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20
  },
  draggableIcon: {
    backgroundColor: colors.alto,
    width: 60
  }
});
