import * as React from 'react';
import {TextInput, View, StyleSheet} from 'react-native';

import SearchIcon from '../../../assets/icons/search.svg';

const Search = (props) => {
  return (
    <View style={{...styles.inputContainer, ...styles.container}}>
      <SearchIcon width={16.67} height={16.67} fill="#000" />
      <TextInput
        style={{...styles.searchInput, ...styles.textInput}}
        onChangeText={props.onChangeText}
        value={props.value}
        placeholder={props.placeholder ? props.placeholder : ''}
      />
    </View>
  );
};
const styles = StyleSheet.create({
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
});
export default Search;
