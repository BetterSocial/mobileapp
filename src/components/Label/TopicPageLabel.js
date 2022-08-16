import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../../utils/theme';
import { fonts, normalize, normalizeFontSize } from '../../utils/fonts';

const TopicPageLabel = ({ label }) => (
    <>
        <View style={styles.container}>
            <Text style={styles.domainText} numberOfLines={1} ellipsizeMode="tail">
                {label}
            </Text>
        </View>
        <View style={styles.divider}/>
    </>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginStart: 20,
        alignSelf: 'flex-start',
        backgroundColor: COLORS.white,
        paddingVertical: 10,
    },
    domainText: {
        fontSize: normalizeFontSize(18),
        fontFamily: fonts.inter[600],
        lineHeight: normalize(19),
        fontWeight: 'bold',
        textAlign: 'left'
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: COLORS.gray1,
    }
});

export default TopicPageLabel;
