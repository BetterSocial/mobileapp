import React from 'react'
import { TouchableNativeFeedback, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types';
const styles = StyleSheet.create({
    paddingButton: {
        padding: 10,
    }
})

const GlobalButton = (props) => {
    const {buttonStyle, children} = props
    return (
        <TouchableOpacity style={[styles.paddingButton, buttonStyle]}  {...props} >
            {children}
        </TouchableOpacity>
    )
}

GlobalButton.propTypes = {
    buttonStyle: PropTypes.object,
    children: PropTypes.node
}

GlobalButton.defaultProps = {
    children: null
}

export default GlobalButton