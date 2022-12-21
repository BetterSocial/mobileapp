/* eslint-disable no-nested-ternary */
import * as React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import PollOptions from '../../components/PollOptions';
import PollOptionsMultipleChoice from '../../components/PollOptionsMultipleChoice';
import { COLORS } from '../../utils/theme';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import {
  getPollTime,
  isPollExpired,
} from '../../utils/string/StringUtils';
import useContentPoll from './hooks/useContentPoll';

const { width: screenWidth } = Dimensions.get('window');
const FONT_SIZE_MEDIA = 16

const ContentPoll = ({
  polls = [],
  item,
  multiplechoice = false,
  onnewpollfetched,
  isalreadypolling,
  pollexpiredat,
  index = -1,
  voteCount = 0}) => {
      
  const {renderSeeResultButton, isAlreadyPolling, singleChoiceSelectedIndex, setSingleChoiceSelectedIndex, multipleChoiceSelected, setMultipleChoiceSelected, showSetResultsButton, onSeeResultsClicked, modifiedPoll} = useContentPoll({isalreadypolling, polls})
    
  const initialSetup = () => {
    if(multiplechoice) onSeeResultsClicked(item,  multiplechoice, onnewpollfetched, index)

  }


  React.useEffect(() => {
    initialSetup()
  }, [singleChoiceSelectedIndex])

  const renderSeeResultButtonHandle = () => renderSeeResultButton(multiplechoice, multipleChoiceSelected)
  return (
    <View style={styles.containerShowMessage}>
            <View style={styles.pollOptionsContainer}>
              <Text style={styles.voteFont} >All votes are anonymous - even to the poll’s author!</Text>
              <View style={styles.pollContainer} >
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
                    total={modifiedPoll(polls).totalpoll}
                    totalVotingUser={voteCount}
                  />
                ) : (
                  <PollOptions
                    key={indexPoll}
                    poll={pollItem}
                    mypoll={item?.mypolling}
                    index={indexPoll}
                    selectedindex={singleChoiceSelectedIndex}
                    total={modifiedPoll(polls).totalpoll}
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
              <Text style={styles.totalpolltext}>{`${voteCount} votes `}</Text>
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 4,
                  alignSelf: 'center',
                  backgroundColor: colors.blackgrey,
                }}
              />
              <Text style={styles.polltime}>{` ${getPollTime(
                pollexpiredat,
              )}`}</Text>
              {showSetResultsButton(pollexpiredat) && (
                <View testID='resultButton' style={styles.seeresultscontainer}>
                  <TouchableOpacity onPress={() =>  onSeeResultsClicked(item, multiplechoice, onnewpollfetched, index)}>
                    <Text style={styles.seeresultstext}>
                      {renderSeeResultButtonHandle()}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
  )
};

export default ContentPoll;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: colors.blackgrey,
  },
  fletlist: { flex: 1 },
  containerShowMessage: { justifyContent: 'center', marginBottom: 30, paddingVertical: 10 },
  imageList: { flex: 1, width: screenWidth - 32, borderRadius: 16 },
  rowSpaceBeetwen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerFeedProfile: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 13,
  },

  feedUsername: {
    fontFamily: fonts.inter[600],
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
  },
  containerFeedText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  feedDate: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    color: colors.black,
    lineHeight: 18,
  },
  point: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.gray,
    marginLeft: 8,
    marginRight: 8,
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
    fontSize: 24,
    lineHeight: 24,
    color: colors.black,
  },
  textComment: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 18,
    color: colors.gray,
  },
  usernameComment: {
    fontFamily: fonts.inter[500],
    fontWeight: '900',
    fontSize: 12,
    lineHeight: 24,
    color: colors.black,
  },
  usernameTextComment: {
    fontFamily: fonts.inter[500],
    fontSize: 12,
    lineHeight: 24,
    color: colors.gray,
  },
  item: {
    width: screenWidth - 20,
    height: screenWidth - 20,
    marginTop: 10,
    marginLeft: -20,
    backgroundColor: 'pink',
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    aspectRatio: 1.5,
    resizeMode: 'cover',
  },
  imageAnonimity: {
    marginRight: 8,
    width: 32,
    height: 32,
  },
  pollOptionsContainer: {
    width: '100%',
    padding: 0,
    // marginBottom: 5,
  },
  pollOptionItemContainer: {
    backgroundColor: colors.lightgrey,
    marginBottom: 8,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  pollOptionItemContainerActive: {
    backgroundColor: colors.holytosca30percent,
    marginBottom: 8,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  pollOptionTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  pollOptionItemText: {
    flex: 1,
    color: colors.black,
    fontFamily: fonts.inter[400],
  },
  totalpolltext: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 16,
    color: colors.blackgrey,
    alignSelf: 'center',
  },
  polltime: {
    fontFamily: fonts.inter[400],
    fontSize: 12,
    lineHeight: 16,
    color: colors.blackgrey,
    alignSelf: 'center',
    flex: 1,
  },
  pollRadioButton: {
    width: 12,
    height: 12,
    alignSelf: 'center',
    borderRadius: 6,
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
    marginBottom: 10,
  },
  seeresultscontainer: {
    alignSelf: 'center',
  },
  seeresultstext: {
    color: colors.holytosca,
    fontFamily: fonts.inter[500],
  },
  textMedia: {
    fontFamily: fonts.inter[400],
      fontWeight: 'normal',
      fontSize: FONT_SIZE_MEDIA,
      color: colors.black,
      lineHeight: 24,
  },

  seemore: {
    color: COLORS.blue,
  },
  pollContainer: {
    paddingTop: 10
  },
  voteFont: {
    fontSize: 12,
    color: '#828282',
    marginLeft: 2
  }
});
