import * as React from 'react';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

import { colors } from '../../../utils/colors';
import { fonts } from '../../../utils/fonts';
import { getSingularOrPluralText } from '../../../utils/string/StringUtils';

/**
 * 
 * @typedef {Function} OnFollowingContainerClicked   
 * @param {number} userId
 * @param {String} username  
 */
/**
 * 
 * @typedef {Object} FollowInfoRowPropsParam 
 * @property {String} follower
 * @property {String} following
 * @property {OnFollowingContainerClicked} onFollowingContainerClicked
 */
/**
 * 
 * @param {FollowInfoRowPropsParam} param0 
 * @returns 
 */
const FollowInfoRow = ({ follower, following, onFollowingContainerClicked}) => {
    return <View style={styles.wrapFollower}>
        <View style={styles.wrapRow}>
            <Text style={styles.textTotal}>
                {follower}
            </Text>
            <Text style={styles.textFollow}>{getSingularOrPluralText(follower, "Follower", "Followers")}</Text>
        </View>
        <View style={styles.following}>
            <TouchableNativeFeedback
                onPress={onFollowingContainerClicked}>
                <View style={styles.wrapRow}>
                <Text style={styles.textTotal}>
                    {following}
                </Text>
                <Text style={styles.textFollow}>Following</Text>
                </View>
            </TouchableNativeFeedback>
        </View>
    </View>
}

let styles = StyleSheet.create({
    following: {marginLeft: 18},
    textTotal: {
        fontFamily: fonts.inter[800],
        fontWeight: 'bold',
        fontSize: 14,
        color: colors.bondi_blue,
        paddingRight: 4,
    },
    textFollow: {
        fontFamily: fonts.inter[800],
        fontSize: 14,
        color: colors.black,
        paddingRight: 4,
    },
    wrapFollower: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    wrapRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
})

export default FollowInfoRow