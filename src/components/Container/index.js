import React from 'react'
import { SafeAreaView, Platform, StyleSheet } from 'react-native'
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export const isDeviceIos = () => Platform.OS === 'ios'


const Container = (props) => {
    const {children} = props
    if(isDeviceIos()) {
        return (
            <SafeAreaView style={styles.container} >
                {children}
            </SafeAreaView>
        )
    }
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}

Container.propTypes = {
    children: PropTypes.node
}
export default Container