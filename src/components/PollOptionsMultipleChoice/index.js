import * as React from 'react';
import CheckBox from '@react-native-community/checkbox';
import {StyleSheet, Text, TouchableNativeFeedback, View} from 'react-native';

import IconPollMine from '../../assets/icon/IconPollMine';
import IconPollWinnerBadge from '../../assets/icon/IconPollWinnerBadge';
import {COLORS} from '../../utils/theme';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const PollOptionsMultipleChoice = ({
  item,
  mypoll,
  index,
  // total,
  selectedindex,
  isexpired,
  isalreadypolling = false,
  maxpolls = [],
  onselected = (index) => {},
  totalVotingUser = 0
}) => {
  console.log(totalVotingUser)
  const counter = item?.counter || 0;
  const optionPercentage = totalVotingUser === 0 ? 0 : ((counter / totalVotingUser) * 100).toFixed(0);

  const isPollDisabled = () => isalreadypolling || isexpired;

  const selected = selectedindex.includes(index);

  const isMyPoll = () => mypoll.reduce((acc, current) => {
      const isCurrentItemMyPoll =
        item?.polling_option_id === current?.polling_option_id;
      return acc || isCurrentItemMyPoll;
    }, false);

  // console.log(isMyPoll());

  const onOptionsClicked = () => {
    if (isPollDisabled()) {
      return;
    }
    if (selected) {
      const idx = selectedindex.indexOf(index);
      const newSelectedIndex = [...selectedindex];
      newSelectedIndex.splice(idx, 1);
      onselected(newSelectedIndex);
    } else {
      const newSelectedIndex = [...selectedindex];
      newSelectedIndex.push(index);
      onselected(newSelectedIndex);
    }
  };

  const isPollNotEndedAndIsMax =
    isalreadypolling && maxpolls.includes(item.polling_option_id);

  const isPollNotEndedAndIsMine = isalreadypolling && isMyPoll() && !isexpired;
  const isMax = maxpolls.includes(item.polling_option_id);

  const renderPercentageBar = () => {
    if (isexpired) {
      return (
        <View style={styles.expiredPercentageBar(optionPercentage, isMax)} />
      );
      // } else if (isPollNotEndedAndIsMax) {
      //   return (
      //     <View style={styles.expiredPercentageBar(optionPercentage, isMax)} />
      //   );
    } if (isalreadypolling) {
      return (
        <View style={styles.percentageBar(optionPercentage, isMyPoll())} />
      );
    }
  };

  const renderPollBadge = () => {
    if (isMax && isexpired) {
      return (
        <IconPollWinnerBadge style={{marginRight: 9, alignSelf: 'center'}} />
      );
    } if (isPollNotEndedAndIsMine) {
      return <IconPollMine style={{marginRight: 9, alignSelf: 'center'}} />;
    } 
      return <></>;
    
  };

  return (
    <TouchableNativeFeedback
      disabled={isPollDisabled()}
      onPress={onOptionsClicked}>
      <View
        key={`poll-options-${index}`}
        style={
          selected
            ? styles.pollOptionItemContainerActive
            : styles.pollOptionItemContainer
        }>
        {/* <View
          style={styles.percentageBar(
            optionPercentage,
            isMyPoll(),
            isPollDisabled(),
          )}
        /> */}
        {renderPercentageBar()}
        <View style={styles.pollOptionTextContainer}>
          {isPollDisabled() ? (
            renderPollBadge()
          ) : (
            <CheckBox
              value={selected}
              tintColors={{true: colors.holytosca, false: colors.black}}
              onChange={onOptionsClicked}
            />
          )}
          <Text style={styles.pollOptionItemText(isPollDisabled(), isMax)}>
            {item.option}
          </Text>
          {isPollDisabled() && (
            <Text
              style={
                styles.pollOptionItemPercentage
              }>{`${optionPercentage}%`}</Text>
          )}
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

let styles = StyleSheet.create({
  pollOptionsContainer: {
    width: '100%',
    padding: 0,
    marginTop: 16,
    marginBottom: 8,
  },
  pollOptionItemContainer: {
    backgroundColor: colors.lightgrey,
    marginBottom: 8,
    borderRadius: 8,
    // height: 56,
    display: 'flex',
    flexDirection: 'row',
  },
  pollOptionItemContainerActive: {
    backgroundColor: colors.holytosca30percent,
    marginBottom: 8,
    borderRadius: 8,
    // height: 56,
    display: 'flex',
    flexDirection: 'row',
  },
  pollOptionTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  pollOptionItemText: (isexpired, isMax) => ({
      flex: 1,
      color: colors.black,
      fontFamily: fonts.inter[400],
      alignSelf: 'center',
      marginTop: isMax ? 0 : isexpired ? 6 : 0,
      marginBottom: isMax ? 0 : isexpired ? 6 : 0,
      marginLeft: 0,
    }),
  pollOptionItemPercentage: {
    alignSelf: 'center',
  },
  percentageBar: (percent, isMyPoll = false, isPollDisabled = false) => {
    if (!percent) {
      percent = 0;
    }
    if (percent > 100) {
      percent = 100;
    }

    // if (!isPollDisabled) {
    //   percent = 0;
    // }

    return {
      width: `${percent}%`,
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: 6,
      backgroundColor: isMyPoll ? colors.bondi_blue : colors.gray1,
    };
  },
  expiredPercentageBar: (percent, isMax = false) => {
    if (!percent) {
      percent = 0;
    }
    if (percent > 100) {
      percent = 100;
    }

    return {
      width: `${percent}%`,
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: 6,
      backgroundColor: isMax ? COLORS.blueSea : colors.gray1,
    };
  },
  totalpolltext: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 16,
    color: colors.blackgrey,
  },
  pollRadioButton: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 0,
    borderColor: colors.black,
    borderWidth: 1,
    marginEnd: 12,
  },

  pollRadioButtonActive: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 6,
    backgroundColor: colors.holytosca,
    marginEnd: 12,
  },
  totalVotesContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default PollOptionsMultipleChoice;
