import * as React from 'react';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import {Dimensions, Pressable, StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';

import AutoFocusTextArea from '../TextArea/AutoFocusTextArea';
import CrossIcon from '../../../assets/icons/cross.svg';
import StringConstant from '../../utils/string/StringConstant';
import {displayFormattedSearchLocationsV2} from '../../utils/string/StringUtils';

const {width} = Dimensions.get('screen');

const SearchModal = (props) => {
  const textRef = React.useRef(null);
  const [focus] = React.useState(false);

  return (
    <Modal
      testID={'modal'}
      isVisible={props.isVisible}
      onSwipeComplete={props.onClose}
      swipeDirection={['down']}
      onBackButtonPress={props.onClose}
      style={styles.view}>
      <View style={styles.container}>
        <View style={styles.space} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Pressable testID="onCloseModal" onPress={props.onClose} style={styles.closeButton}>
              <CrossIcon width={18} height={18} fill="#000" />
            </Pressable>
            <Text style={styles.textSearch}>{StringConstant.searchModalTitle}</Text>
          </View>
          <View style={styles.containerInput}>
            <View style={{...styles.inputContainer, ...styles.containerInput}}>
              <AutoFocusTextArea
                keyboardAppearDelay={50}
                autoCapitalize={'words'}
                autoFocus={focus}
                ref={textRef}
                style={{...styles.searchInput, ...styles.textInput}}
                onChangeText={props.onChangeText}
                value={props.value}
                placeholder={props.placeholder ? props.placeholder : ''}
                placeholderTextColor="#BDBDBD"
                multiline={false}
                returnKeyType="search"
              />
            </View>
            {props.isLoading ? <Text>Please wait...</Text> : null}

            {typeof props.options !== 'undefined' && props.options.length > 0 ? (
              <View style={styles.box}>
                {props.options.map((value) => (
                  <TouchableNativeFeedback
                    testID="selectLocation"
                    key={value?.location_id}
                    onPress={() => props.onSelect(value)}>
                    <View style={styles.list}>
                      {displayFormattedSearchLocationsV2(props.value, value)}
                    </View>
                  </TouchableNativeFeedback>
                ))}
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
    margin: 0
  },
  container: {
    width,
    flexDirection: 'column',
    flex: 1
  },
  space: {flex: 1},
  content: {
    backgroundColor: 'white',
    flexDirection: 'column',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flex: 8,
    width,
    padding: 22
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  closeButton: {
    display: 'flex',
    padding: 8,
    marginLeft: -8
  },
  textSearch: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: -0.28,
    color: '#000000',
    paddingLeft: 11
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
    marginTop: 26
  },
  containerInput: {
    position: 'relative'
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
    marginLeft: 5
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
    elevation: 2000
  },
  list: {
    minHeight: 35,
    paddingTop: 2,
    paddingBottom: 2,
    flexDirection: 'row',
    alignItems: 'center'
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
  }
});

SearchModal.prototypes = {
  isVisible: PropTypes.bool,
  isLoading: PropTypes.bool,
  options: PropTypes.array
};

export default SearchModal;
