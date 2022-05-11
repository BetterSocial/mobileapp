import * as React from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import { RFValue } from 'react-native-responsive-fontsize';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import CredderLogo from '../../../../../assets/icon/CredderLogo';
import CredderRating from '../../../../../components/CredderRating';
import CredderRatingGreen from '../../../../../assets/icon/CredderRatingGreen';
import MemoIc_question_mark from '../../../../../assets/icons/Ic_question_mark';
import StringConstant from '../../../../../utils/string/StringConstant';
import { COLORS } from '../../../../../utils/theme';
import { fonts, normalize } from '../../../../../utils/fonts';

const CredderInfoGroup = ({ description, score }) => {
    let [isTooltipShown, setIsTooltipShown] = React.useState(false);

    return <TouchableWithoutFeedback style={styles.container} onPress={() => setIsTooltipShown(true)}>
        <CredderRating score={score}/>
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
            <View
                style={{
                    paddingLeft: 5,
                    paddingRight: 11,
                }}>
                <MemoIc_question_mark
                    width={normalize(17)}
                    height={normalize(17)}
                />
            </View>
        </Tooltip>
        <View>
            <Text style={styles.credderDesc}>Credibility Score by</Text>
            <CredderLogo />
        </View>
    </TouchableWithoutFeedback>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 16,
        maxWidth: '100%',
        margin: -4,
        padding: 4,
    },
    credderDesc: {
        marginBottom: 4,
        fontSize: RFValue(10),
        lineHeight: RFValue(12),
        fontFamily: fonts.inter[400],
        color: COLORS.blackgrey
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