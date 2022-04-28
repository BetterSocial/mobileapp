import * as React from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import { RFValue } from 'react-native-responsive-fontsize';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import CredderLogo from '../../../../../assets/icon/CredderLogo';
import CredderRatingGreen from '../../../../../assets/icon/CredderRatingGreen';
import MemoIc_question_mark from '../../../../../assets/icons/Ic_question_mark';
import StringConstant from '../../../../../utils/string/StringConstant';
import { COLORS } from '../../../../../utils/theme';
import { fonts, normalize } from '../../../../../utils/fonts';

const CredderInfoGroup = ({ description }) => {
    let [isTooltipShown, setIsTooltipShown] = React.useState(false);

    return <View style={styles.container}>
        <View style={styles.credderRatingContainer}>
            <CredderRatingGreen style={{alignSelf: 'center'}}/>
            <Text style={styles.credderRating}>89%</Text>
        </View>
        <Tooltip
            // allowChildInteraction={false}
            isVisible={isTooltipShown}
            placement={'bottom'}
            backgroundColor={'rgba(0,0,0,0)'}
            showChildInTooltip={false}
            onClose={() => setIsTooltipShown(false)}
            contentStyle={styles.tooltipShadowContainer}
            arrowSize={{ width: 0, height: 0 }}
            content={
                <View>
                    <Text style={styles.tooltipContent}>
                        {StringConstant.credderTooltipText}
                    </Text>
                </View>
            }>
            <TouchableOpacity
                onPress={() => setIsTooltipShown(true)}
                style={{
                    paddingLeft: 5,
                    paddingRight: 11,
                }}>
                <MemoIc_question_mark
                    width={normalize(17)}
                    height={normalize(17)}
                />
            </TouchableOpacity>
        </Tooltip>
        <View>
            <Text style={styles.credderDesc}>Credibility Score by</Text>
            <CredderLogo />
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 16,
        maxWidth: '100%'
    },
    credderDesc: {
        marginBottom: 4,
        fontSize: RFValue(10),
        lineHeight: RFValue(12),
        fontFamily: fonts.inter[400],
        color: COLORS.blackgrey
    },
    credderRating: {
        fontSize: RFValue(16),
        fontFamily: fonts.inter[600],
        marginLeft: 9,
        color: COLORS.white,
        alignSelf: 'center'
    },
    credderRatingContainer: {
        paddingLeft: 4,
        paddingRight: 4,
        flexDirection: 'row',
        // height: 28,
        backgroundColor: COLORS.black43,
        borderRadius: 8,
    },
    tooltipContent: {
        fontFamily: fonts.inter[400],
        fontSize: RFValue(14),
        lineHeight: RFValue(17),
        color: COLORS.blackgrey,
    },
    tooltipShadowContainer: {
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 3.84,
        elevation: 5,
    },
})

export default CredderInfoGroup