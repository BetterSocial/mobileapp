import * as React from 'react';
import Tooltip from 'react-native-walkthrough-tooltip';
import {RFValue} from 'react-native-responsive-fontsize';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import CredderLogo from '../../../../../assets/icon/CredderLogo';
import MemoIc_question_mark from '../../../../../assets/icons/Ic_question_mark';
import StringConstant from '../../../../../utils/string/StringConstant';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../../../../libraries/analytics/analyticsEventTracking';
import {COLORS} from '../../../../../utils/theme';
import {CredderRating} from '../../../../../components/CredderRating';
import {fonts, normalize} from '../../../../../utils/fonts';

const CredderInfoGroup = ({score}) => {
  const [isTooltipShown, setIsTooltipShown] = React.useState(false);

  const handleOnPressCredder = () => {
    setIsTooltipShown(true);
    AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.DOMAIN_PAGE_CREDDER_GROUP_CLICKED);
  };

  return (
    <TouchableWithoutFeedback style={styles.container} onPress={handleOnPressCredder}>
      <CredderRating score={score} />
      <Tooltip
        // allowChildInteraction={false}
        isVisible={isTooltipShown}
        placement={'bottom'}
        backgroundColor={'rgba(0,0,0,0)'}
        showChildInTooltip={false}
        onClose={() => setIsTooltipShown(false)}
        contentStyle={styles.tooltipShadowContainer}
        arrowSize={{width: 0, height: 0}}
        content={
          <View>
            <Text style={styles.tooltipContent}>{StringConstant.credderTooltipText}</Text>
          </View>
        }>
        <View
          style={{
            paddingLeft: 5,
            paddingRight: 11
          }}>
          <MemoIc_question_mark width={normalize(17)} height={normalize(17)} />
        </View>
      </Tooltip>
      <View>
        <Text style={styles.credderDesc}>Credibility Score by</Text>
        <CredderLogo />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 16,
    maxWidth: '100%',
    margin: -4,
    padding: 4
  },
  credderDesc: {
    marginBottom: 4,
    fontSize: RFValue(10),
    lineHeight: RFValue(12),
    fontFamily: fonts.inter[400],
    color: COLORS.gray510
  },
  tooltipContent: {
    fontFamily: fonts.inter[400],
    fontSize: RFValue(14),
    lineHeight: RFValue(17),
    color: COLORS.white
  },
  tooltipShadowContainer: {
    paddingHorizontal: 10,
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.58,
    shadowRadius: 16,
    shadowColor: COLORS.black,
    // shadowRadius: 3.84,
    // shadowRadius: 10,
    elevation: 16,
    borderWidth: 1,
    borderColor: COLORS.gray210,
    backgroundColor: COLORS.gray110
  }
});

export default CredderInfoGroup;
