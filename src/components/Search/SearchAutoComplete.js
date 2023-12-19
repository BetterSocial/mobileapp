import * as React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';

import SearchIcon from '../../../assets/icons/search.svg';

const SearchAutoComplete = (props) => {
  return (
    <View style={styles.container}>
      <View style={{...styles.inputContainer, ...styles.container}}>
        <SearchIcon width={16.67} height={16.67} fill="#000" />
        <TextInput
          style={{...styles.searchInput, ...styles.textInput}}
          onChangeText={props.onChangeText}
          value={props.value}
          placeholder={props.placeholder ? props.placeholder : ''}
        />
      </View>
      {typeof props.options !== 'undefined' && props.options.length > 0 ? (
        <View style={styles.box}>
          {props.options.map((value, index) => {
            return (
              <TouchableNativeFeedback
                key={index}
                onPress={() => props.onSelect(value)}>
                <View style={styles.list}>
                  <Text style={styles.label}>{value.label}</Text>
                </View>
              </TouchableNativeFeedback>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  inputContainer: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 13,
  },
  searchInput: {
    width: '90%',
    height: 40,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 13,
    letterSpacing: -0.28,
    color: '#BDBDBD',
    marginLeft: 5,
  },
  box: {
    minHeight: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    flexDirection: 'column',
    marginBottom: 2,
    position: 'absolute',
    width: '100%',
    top: 50,
    zIndex: 2000,
    elevation: 2000,
  },
  list: {
    minHeight: 35,
    backgroundColor: '#e6e6e6',
    paddingLeft: 13,
    paddingRight: 13,
    paddingTop: 2,
    paddingBottom: 2,
  },
  label: {
    textTransform: 'capitalize',
  },
});
export default SearchAutoComplete;
