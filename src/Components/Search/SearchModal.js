import React from 'react';
import {useState, useEffect} from 'react';
import {
  StatusBar,
  Button,
  SafeAreaView,
  TextInput,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableNativeFeedback,
} from 'react-native';
import Modal from 'react-native-modal';
import CrossIcon from '../../../assets/icons/cross.svg';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

const SearchModal = (props) => {
  const [data, setData] = useState('');
  return (
    <Modal
      testID={'modal'}
      isVisible={props.isVisible}
      onSwipeComplete={props.onClose}
      swipeDirection={['down']}
      style={styles.view}>
      <View style={styles.container}>
        <View style={{flex: 1}} />
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableNativeFeedback onPress={props.onClose}>
              <CrossIcon width={18} height={18} fill="#000" />
            </TouchableNativeFeedback>
            <Text style={styles.textSearch}>Search</Text>
          </View>
          <View style={styles.containerInput}>
            <View style={{...styles.inputContainer, ...styles.containerInput}}>
              <TextInput
                style={{...styles.searchInput, ...styles.textInput}}
                onChangeText={props.onChangeText}
                value={props.value}
                placeholder={props.placeholder ? props.placeholder : ''}
                placeholderTextColor="#BDBDBD"
              />
            </View>
            {typeof props.options !== 'undefined' &&
            props.options.length > 0 ? (
              <View style={styles.box}>
                {props.options.map((value, index) => {
                  let firstLetter = value.label.split(' ');
                  let lastLetter = value.label.replace(
                    `${firstLetter[0]} `,
                    ' ',
                  );
                  return (
                    <TouchableNativeFeedback
                      key={index}
                      onPress={() => props.onSelect(value)}>
                      <View style={styles.list}>
                        <Text style={styles.labelBold}>{firstLetter[0]}</Text>
                        {firstLetter.length > 1 ? (
                          <Text style={styles.label}>{lastLetter}</Text>
                        ) : null}
                      </View>
                    </TouchableNativeFeedback>
                  );
                })}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    width: width,
    flexDirection: 'column',
    flex: 1,
  },
  content: {
    backgroundColor: 'white',
    flexDirection: 'column',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flex: 8,
    width: width,
    padding: 22,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSearch: {
    fontFamily: 'FontsFree-Net-SFProText-Regular',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: -0.28,
    color: '#000000',
    paddingLeft: 19,
  },
  inputContainer: {
    height: 48,
    width: width - 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 13,
    marginTop: 26,
  },
  containerInput: {
    position: 'relative',
  },
  searchInput: {
    width: '90%',
    height: 40,
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    letterSpacing: -0.28,
    color: '#000000',
    marginLeft: 5,
  },
  box: {
    minHeight: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    flexDirection: 'column',
    marginBottom: 2,
    position: 'absolute',
    width: '100%',
    top: 90,
    zIndex: 2000,
    elevation: 2000,
  },
  list: {
    minHeight: 35,
    paddingTop: 2,
    paddingBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  labelBold: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 17,
    color: '#000000',
    textTransform: 'capitalize'
  },
  label: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 17,
    color: '#000000',
    textTransform: 'capitalize'
  },
});
export default SearchModal;
