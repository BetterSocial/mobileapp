import * as React from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import { StyleSheet, Text, View } from 'react-native'

import CredderRatingGray from '../../assets/icon/CredderRatingGray'
import CredderRatingGreen from '../../assets/icon/CredderRatingGreen'
import CredderRatingRed from '../../assets/icon/CredderRatingRed'
import CredderRatingYellow from '../../assets/icon/CredderRatingYellow'
import { COLORS } from '../../utils/theme'
import { fonts } from '../../utils/fonts'

const CredderRating = ({ containerStyle = {}, score }) => {
    const __renderCredderRatingIcon = () => {
        if (!score || score < 0) return <CredderRatingGray style={{ alignSelf: 'center' }} />
        if (score <= 42) return <CredderRatingRed style={{ alignSelf: 'center' }} />
        if (score > 42 && score <= 65) return <CredderRatingYellow style={{ alignSelf: 'center' }} />

        return <CredderRatingGreen style={{ alignSelf: 'center' }} />
    }

    const __renderCredderRatingScore = () => {
        if(!score || score < 0) return `n/a`
        return `${score}%`
    }

    return <View style={{ ...styles.credderRatingContainer, ...containerStyle }}>
        {__renderCredderRatingIcon()}
        <Text style={styles.credderRating}>{__renderCredderRatingScore()}</Text>
    </View>
}

export default CredderRating

const styles = StyleSheet.create({
    credderRating: {
        fontSize: 16,
        fontFamily: fonts.inter[600],
        // marginLeft: 9,
        color: COLORS.white,
        alignSelf: 'center',
        textAlign: 'center',
        flex: 1,
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