import * as React from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import { StyleSheet, Text, View } from 'react-native'

import CredderRatingGreen from '../../assets/icon/CredderRatingGreen'
import { COLORS } from '../../utils/theme'
import { fonts } from '../../utils/fonts'

const CredderRating = ({ containerStyle = {}, }) => {
    return <View style={{...styles.credderRatingContainer, ...containerStyle}}>
        <CredderRatingGreen style={{ alignSelf: 'center' }} />
        <Text style={styles.credderRating}>89%</Text>
    </View>
}

export default CredderRating

const styles = StyleSheet.create({
    credderRating: {
        fontSize: 16,
        fontFamily: fonts.inter[600],
        marginLeft: 9,
        color: COLORS.white,
        alignSelf: 'center',
    },
    credderRatingContainer: {
        paddingLeft: 4,
        paddingRight: 4,
        flexDirection: 'row',
        width: 69,
        // height: '100%',
        backgroundColor: COLORS.black43,
        borderRadius: 8,
    },
})