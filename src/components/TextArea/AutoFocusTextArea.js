import React, {Component} from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { colors } from '../../utils/colors'
import { fonts } from '../../utils/fonts'

export default class AutoFocusTextArea extends React.Component {
    constructor(props) {
        super(props)

        this.inputElement = React.createRef()
    }

    componentDidMount() {
        setTimeout(() => {
            if(this.inputElement) {
                this.inputElement.current.focus()
            }
        },250)
    }

    render(){
        return <TextInput
            ref={this.inputElement}
            value={this.props.value}
            onChangeText={this.props.onChangeText}
            multiline={true}
            style={{...styles.input, ...this.props.style}}
            textAlignVertical={"top"}
            placeholder={this.props.placeholder}
      />
    }
}

const styles = StyleSheet.create({
    input: {
      backgroundColor: colors.lightgrey,
      paddingVertical: 16,
      paddingHorizontal: 12,
      height : 150,
      justifyContent: 'flex-start',
      overflow: 'scroll',
      borderRadius: 8,
      fontFamily: fonts.inter[500],
      fontSize: 14,
      color: colors.black,
      lineHeight: 24
    },
  });