/* eslint-disable no-nested-ternary,import/no-named-as-default */
import * as React from 'react';
import moment from 'moment';
import {Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import PollOptions from '../../components/PollOptions';
import PollOptionsMultipleChoice from '../../components/PollOptionsMultipleChoice';
import useContentPoll from './hooks/useContentPoll';
import {COLORS} from '../../utils/theme';
import {fonts, normalize, normalizeFontSize, normalizeFontSizeByWidth} from '../../utils/fonts';
import {getPollTime, isPollExpired} from '../../utils/string/StringUtils';

const {width: screenWidth} = Dimensions.get('window');
const FONT_SIZE_MEDIA = 16;

const ContentPoll = ({
  polls = [],
  item,
  multiplechoice = false,
  onnewpollfetched,
  isAlreadyPolling: isAlreadyPollingProps,
  pollexpiredat,
  index = -1,
  voteCount = 0,
  onLayout = () => {},
  currentMoment = moment(),
  isPostDetail = false,
  containerStyle,
  topics = []
}) => {
  const {
    renderSeeResultButton,
    isAlreadyPolling,
    singleChoiceSelectedIndex,
    setSingleChoiceSelectedIndex,
    multipleChoiceSelected,
    setMultipleChoiceSelected,
    showSetResultsButton,
    onSeeResultsClicked,
    modifiedPoll,
    count,
    newPoll
  } = useContentPoll({isAlreadyPolling: isAlreadyPollingProps, polls, voteCount});

  const styles = stylesComponent(polls.length);
  const initialSetup = () => {
    if (!multiplechoice) onSeeResultsClicked(item, multiplechoice, onnewpollfetched, index);
  };

  React.useEffect(() => {
    if (singleChoiceSelectedIndex !== -1) {
      initialSetup();
    }
  }, [singleChoiceSelectedIndex]);

  const renderSeeResultButtonHandle = () =>
    renderSeeResultButton(multiplechoice, multipleChoiceSelected);

  const hasTopics = topics.length > 0;
  const isMoreThanThreePolls = polls.length > 3;

  return (
    <View onLayout={onLayout} style={[styles.containerShowMessage, containerStyle]}>
      <View style={styles.pollOptionsContainer}>
        <Text style={styles.voteFont}>All votes are anonymous - even to the poll’s author!</Text>
        <View
          style={
            isPostDetail
              ? styles.pollContainer
              : styles.pollListContainer(hasTopics, isMoreThanThreePolls)
          }>
          {polls.map((pollItem, indexPoll) =>
            multiplechoice ? (
              <PollOptionsMultipleChoice
                key={indexPoll}
                item={pollItem}
                index={indexPoll}
                mypoll={item?.mypolling}
                selectedindex={multipleChoiceSelected}
                onselected={(indexes) => {
                  setMultipleChoiceSelected(indexes);
                }}
                isexpired={isPollExpired(pollexpiredat)}
                isalreadypolling={isAlreadyPolling}
                maxpolls={modifiedPoll(polls).maxId}
                total={voteCount}
                totalVotingUser={count}
              />
            ) : (
              <PollOptions
                key={indexPoll}
                poll={pollItem}
                mypoll={newPoll?.mypolling}
                index={indexPoll}
                selectedindex={singleChoiceSelectedIndex}
                total={count}
                maxpolls={modifiedPoll(polls).maxId}
                isexpired={isPollExpired(pollexpiredat)}
                isalreadypolling={isAlreadyPolling}
                onselected={(indexSelected) => setSingleChoiceSelectedIndex(indexSelected)}
              />
            )
          )}
        </View>
      </View>
      <View style={styles.totalVotesContainer}>
        <Text style={styles.totalpolltext}>{`${count} votes `}</Text>
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 4,
            alignSelf: 'center',
            backgroundColor: COLORS.gray410
          }}
        />
        <Text style={styles.polltime}>{` ${getPollTime(pollexpiredat, currentMoment)}`}</Text>
        {showSetResultsButton(pollexpiredat) && (
          <View testID="resultButton" style={styles.seeresultscontainer}>
            <TouchableOpacity
              onPress={() => onSeeResultsClicked(item, multiplechoice, onnewpollfetched, index)}>
              <Text style={styles.seeresultstext}>{renderSeeResultButtonHandle()}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default ContentPoll;

const stylesComponent = (pollLength) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 16
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 4,
      alignSelf: 'center',
      backgroundColor: COLORS.gray410
    },
    fletlist: {
      flex: 1
    },
    containerShowMessage: {
      justifyContent: 'flex-start',
      height: 'auto'
    },
    imageList: {flex: 1, width: screenWidth - 32, borderRadius: 16},
    rowSpaceBeetwen: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    rowCenter: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    containerFeedProfile: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginLeft: 13
    },

    feedUsername: {
      fontFamily: fonts.inter[600],
      fontWeight: 'bold',
      fontSize: normalizeFontSize(14),
      color: COLORS.black
    },
    containerFeedText: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5
    },
    feedDate: {
      fontFamily: fonts.inter[400],
      fontSize: normalizeFontSize(12),
      color: COLORS.black,
      lineHeight: 18
    },
    point: {
      width: 4,
      height: 4,
      borderRadius: 4,
      backgroundColor: COLORS.gray410,
      marginLeft: 8,
      marginRight: 8
    },
    contentFeed: {
      flex: 1,
      paddingTop: 12,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 12
    },
    textContentFeed: {
      fontFamily: fonts.inter[400],
      fontSize: normalizeFontSize(24),
      lineHeight: 24,
      color: COLORS.black
    },
    textComment: {
      fontFamily: fonts.inter[400],
      fontSize: normalizeFontSize(12),
      lineHeight: 18,
      color: COLORS.gray410
    },
    usernameComment: {
      fontFamily: fonts.inter[500],
      fontWeight: '900',
      fontSize: normalizeFontSize(12),
      lineHeight: 24,
      color: COLORS.black
    },
    usernameTextComment: {
      fontFamily: fonts.inter[500],
      fontSize: normalizeFontSize(12),
      lineHeight: 24,
      color: COLORS.gray410
    },
    item: {
      width: screenWidth - 20,
      height: screenWidth - 20,
      marginTop: 10,
      marginLeft: -20,
      backgroundColor: 'pink'
    },
    imageContainer: {
      flex: 1,
      marginBottom: Platform.select({ios: 0, android: 1}),
      backgroundColor: 'white',
      borderRadius: 8
    },
    image: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
      aspectRatio: 1.5,
      resizeMode: 'cover'
    },
    imageAnonimity: {
      marginRight: 8,
      width: 32,
      height: 32
    },
    pollOptionsContainer: {
      width: '100%',
      padding: 0,
      marginBottom: 0
    },
    pollOptionItemContainer: {
      backgroundColor: COLORS.gray110,
      marginBottom: 8,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row'
    },
    pollOptionItemContainerActive: {
      backgroundColor: COLORS.holytosca30percent,
      marginBottom: 8,
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'row'
    },
    pollOptionTextContainer: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      paddingVertical: 16,
      paddingHorizontal: 12
    },
    pollOptionItemText: {
      flex: 1,
      color: COLORS.black,
      fontFamily: fonts.inter[400]
    },
    totalpolltext: {
      fontFamily: fonts.inter[400],
      fontSize: normalizeFontSize(12),
      lineHeight: 16,
      color: COLORS.gray410
    },
    polltime: {
      fontFamily: fonts.inter[400],
      fontSize: normalizeFontSize(12),
      lineHeight: 16,
      color: COLORS.gray410,
      alignSelf: 'center',
      flex: 1
    },
    pollRadioButton: {
      width: 12,
      height: 12,
      alignSelf: 'center',
      borderRadius: 6,
      borderColor: COLORS.black,
      borderWidth: 1,
      marginEnd: 12
    },

    pollRadioButtonActive: {
      width: 12,
      height: 12,
      alignSelf: 'center',
      borderRadius: 6,
      backgroundColor: COLORS.anon_primary,
      marginEnd: 12
    },
    totalVotesContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 10
    },
    seeresultscontainer: {
      alignSelf: 'center'
    },
    seeresultstext: {
      color: COLORS.anon_primary,
      fontFamily: fonts.inter[500],
      fontSize: normalizeFontSize(14)
    },
    textMedia: {
      fontFamily: fonts.inter[400],
      fontWeight: 'normal',
      fontSize: normalizeFontSize(FONT_SIZE_MEDIA),
      color: COLORS.black,
      lineHeight: 24
    },

    seemore: {
      color: COLORS.blue
    },
    pollContainer: {
      paddingTop: 10
    },
    pollListContainer: (hasTopics, isMoreThanThreePolls) => ({
      paddingTop: 10,
      height:
        (pollLength / 4) * normalizeFontSizeByWidth(250) -
        (hasTopics && isMoreThanThreePolls ? normalize(30) : 0)
    }),
    voteFont: {
      fontSize: normalizeFontSize(12),
      color: COLORS.gray410,
      marginLeft: 2
    }
  });
