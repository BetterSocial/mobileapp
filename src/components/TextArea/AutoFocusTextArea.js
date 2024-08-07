import * as React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import PropTypes from 'prop-types';

import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

export default class AutoFocusTextArea extends React.Component {
  constructor(props) {
    super(props);

    this.inputElement = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.inputElement) {
        if (this.inputElement.current) this.inputElement.current.focus();
      }
    }, this.props.keyboardAppearDelay || 500);
  }

  render() {
    return (
      <TextInput
        ref={this.inputElement}
        value={this.props.value}
        onChangeText={this.props.onChangeText}
        multiline={true}
        style={{...styles.input, ...this.props.style}}
        textAlignVertical={'top'}
        placeholder={this.props.placeholder}
        keyboardAppearance="dark"
        {...this.props}
      />
    );
  }
}

AutoFocusTextArea.propTypes = {
  keyboardAppearDelay: PropTypes.number,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func,
  style: PropTypes.object
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.gray110,
    paddingVertical: 16,
    paddingHorizontal: 12,
    height: 150,
    justifyContent: 'flex-start',
    overflow: 'scroll',
    borderRadius: 8,
    fontFamily: fonts.inter[500],
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 24
  }
});
