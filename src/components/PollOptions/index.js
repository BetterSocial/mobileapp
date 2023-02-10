import * as React from 'react';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';

import IconPollMine from '../../assets/icon/IconPollMine';
import IconPollWinnerBadge from '../../assets/icon/IconPollWinnerBadge';
import {COLORS} from '../../utils/theme';
import {colors} from '../../utils/colors';
import {fonts, normalizeFontSize} from '../../utils/fonts';

const PollOptions = ({
  mypoll,
  poll,
  index,
  total,
  selectedindex,
  isexpired = false,
  isalreadypolling = false,
  maxpolls = [],
  onselected = () => {}
}) => {
  const counter = poll?.counter || 10;
  const optionPercentage = total === 0 ? 0 : (counter / total) * 100;
  const isPollDisabled = () => isexpired || isalreadypolling;
  const onPollPressed = () => {
    if (isalreadypolling) {
      return;
    }
    onselected(index);
  };

  const isMyPoll = () => mypoll?.polling_option_id === poll?.polling_option_id;
  const isPollNotEndedAndIsMax = isalreadypolling && maxpolls.includes(poll.polling_option_id);

  const isPollNotEndedAndIsMine = isalreadypolling && isMyPoll();
  const isMax = maxpolls.includes(poll.polling_option_id);

  // eslint-disable-next-line consistent-return
  const renderPercentageBar = () => {
    const renderPercentage = () => {
      if (!optionPercentage) return 0;
      if (optionPercentage > 100) return 100;
      return optionPercentage;
    };

    const percentage = `${renderPercentage()}%`;
    if (isexpired) {
      return (
        <View testID="isExpiredPollOption" style={styles.expiredPercentageBar(percentage, isMax)} />
      );
    }
    if (isPollNotEndedAndIsMax) {
      return (
        <View
          testID="isPollNotEndedAndIsMax"
          style={styles.expiredPercentageBar(percentage, isMax)}
        />
      );
    }
    if (isalreadypolling) {
      return (
        <View
          testID="isAlreadyPollingOption"
          style={styles.percentageBar(percentage, isMyPoll())}
        />
      );
    }
  };

  const renderPollBadge = () => {
    if (isMax) {
      return <IconPollWinnerBadge style={{marginRight: 9, alignSelf: 'center'}} />;
    }
    if (isPollNotEndedAndIsMine) {
      return <IconPollMine style={{marginRight: 9, alignSelf: 'center'}} />;
    }
    return <></>;
  };

  return (
    <TouchableNativeFeedback
      key={index}
      testID="option"
      disabled={isPollDisabled()}
      onPress={onPollPressed}>
      <View
        key={`poll-options-${index}`}
        style={
          selectedindex === index
            ? styles.pollOptionItemContainerActive
            : styles.pollOptionItemContainer
        }>
        {renderPercentageBar()}
        <View style={styles.pollOptionTextContainer}>
          {isPollDisabled() ? (
            renderPollBadge()
          ) : (
            <View
              style={
                selectedindex === index ? styles.pollRadioButtonActive : styles.pollRadioButton
              }
            />
          )}
          <Text style={styles.pollOptionItemText(isexpired, isMax)}>{poll?.option}</Text>
          {isPollDisabled() ? (
            <Text style={styles.pollOptionItemPercentage}>{`${optionPercentage}%`}</Text>
          ) : (
            <></>
          )}
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  pollOptionsContainer: {
    width: '100%',
    padding: 0,
    marginTop: 16,
    marginBottom: 8
  },
  pollOptionItemContainer: {
    backgroundColor: colors.lightgrey,
    marginBottom: 8,
    // height: 56,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row'
  },
  pollOptionItemContainerActive: {
    backgroundColor: colors.holytosca30percent,
    // height: 56,
    marginBottom: 8,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row'
  },
  pollOptionTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  pollOptionItemText: () => ({
    flex: 1,
    color: colors.black,
    fontFamily: fonts.inter[400],
    marginStart: 0,
    alignSelf: 'center',
    fontSize: normalizeFontSize(14)
  }),
  pollOptionItemPercentage: {
    fontSize: normalizeFontSize(14)
  },
  percentageBar: (percent, isMyPoll = false) => ({
    width: percent,
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 6,
    backgroundColor: isMyPoll ? colors.bondi_blue : colors.gray1
  }),
  expiredPercentageBar: (percent, isMax = false) => ({
    width: percent,
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 6,
    backgroundColor: isMax ? COLORS.blueSea : colors.gray1
  }),
  totalpolltext: {
    fontFamily: fonts.inter[400],
    fontSize: normalizeFontSize(12),
    lineHeight: 16,
    color: colors.blackgrey
  },
  pollRadioButton: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 6,
    borderColor: colors.black,
    borderWidth: 1,
    marginEnd: 8
  },

  pollRadioButtonActive: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 6,
    backgroundColor: colors.holytosca,
    marginEnd: 8
  },
  totalVotesContainer: {
    display: 'flex',
    flexDirection: 'row'
  }
});

export default PollOptions;
