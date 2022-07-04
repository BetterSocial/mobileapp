import * as React from 'react';
import SeeMore from 'react-native-see-more-inline';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import Gap from '../../components/Gap';
import PollOptions from '../../components/PollOptions';
import PollOptionsMultipleChoice from '../../components/PollOptionsMultipleChoice';
import TopicsChip from '../../components/TopicsChip/TopicsChip';
import { COLORS } from '../../utils/theme';
import {
  NO_POLL_UUID,
  getPollTime,
  isPollExpired,
} from '../../utils/string/StringUtils';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { inputSingleChoicePoll } from '../../service/post';

const { width: screenWidth } = Dimensions.get('window');
const FONT_SIZE_MEDIA = 16

const ContentPoll = ({
  message,
  images_url,
  polls = [],
  onPress,
  item,
  multiplechoice = false,
  onnewpollfetched,
  isalreadypolling,
  pollexpiredat,
  index = -1,
  voteCount = 0,
  topics = []
}) => {
  let modifiedPoll = polls.reduce(
    (acc, current) => {
      acc.totalpoll = acc.totalpoll + parseInt(current.counter);
      if (current.counter > acc.maxValue) {
        acc.maxValue = current.counter;
        acc.maxId = [];
        acc.maxId.push(current.polling_option_id);
      } else if (current.counter === acc.maxValue) {
        let { maxId } = acc;
        maxId.push(current.polling_option_id);
      }

      return acc;
    },
    { totalpoll: 0, maxId: [], maxValue: 0 },
  );

  let [singleChoiceSelectedIndex, setSingleChoiceSelectedIndex] =
    React.useState(-1);
  let [multipleChoiceSelected, setMultipleChoiceSelected] = React.useState([]);
  let [isFetchingResultPoll, setIsFetchingResultPoll] = React.useState(false);
  let [isAlreadyPolling, setIsAlreadyPolling] =
    React.useState(isalreadypolling);
  let route = useRoute();

  let isTouchableDisabled = route.name === 'PostDetailPage';

  let onSeeResultsClicked = () => {
    if (isFetchingResultPoll) {
      return;
    }
    let newPolls = [...polls];
    let newItem = { ...item };

    if (multiplechoice) {
      newItem.isalreadypolling = true;
      newItem.refreshtoken = new Date().valueOf();
      if (multipleChoiceSelected.length === 0) {
        inputSingleChoicePoll(polls[0].polling_id, NO_POLL_UUID);
      } else {
        setIsAlreadyPolling(true);
        let selectedPolls = [];
        for (let i = 0; i < multipleChoiceSelected.length; i++) {
          let changedPollIndex = multipleChoiceSelected[i];
          let selectedPoll = polls[changedPollIndex];
          newPolls[changedPollIndex].counter =
            parseInt(selectedPoll.counter) + 1;
          selectedPolls.push(selectedPoll);
          inputSingleChoicePoll(
            selectedPoll.polling_id,
            selectedPoll.polling_option_id,
          );
        }
        newItem.pollOptions = newPolls;
        newItem.mypolling = selectedPolls;
        newItem.voteCount++;
      }

      onnewpollfetched(newItem, index);
      setIsAlreadyPolling(true);
    } else {
      newItem.isalreadypolling = true;
      newItem.refreshtoken = new Date().valueOf();

      if (singleChoiceSelectedIndex === -1) {
        inputSingleChoicePoll(polls[0].polling_id, NO_POLL_UUID);
      } else {
        let selectedPoll = polls[singleChoiceSelectedIndex];
        newPolls[singleChoiceSelectedIndex].counter =
          parseInt(selectedPoll.counter) + 1;
        newItem.pollOptions = newPolls;
        newItem.mypolling = selectedPoll;
        newItem.voteCount++;
        inputSingleChoicePoll(
          selectedPoll.polling_id,
          selectedPoll.polling_option_id,
        );
      }

      onnewpollfetched(newItem, index);
      setIsAlreadyPolling(true);
    }
  };

  let showSetResultsButton = () => {
    return !isPollExpired(pollexpiredat) && !isAlreadyPolling;
  };

  const handleTextCaption = (text, onPress) => {
    return (
      <View>
        <Text numberOfLines={4} style={styles.textMedia(text)}>
          {text.length < 180 ? (
            `${text}`
          ) : (
            <Text>
              {`${text.substring(0, 165)}...`}
              <Text onPress={onPress} style={styles.seemore}>
                more
              </Text>
            </Text>
          )}
        </Text>
        <TopicsChip topics={topics} fontSize={FONT_SIZE_MEDIA} />
      </View>
    );
  };

  return (
    <Pressable
      disabled={isTouchableDisabled}
      onPress={onPress}
      style={styles.contentFeed}>
      {images_url !== null ? (
        images_url.length > 0 ? (
          <View style={styles.container}>
            <SeeMore
              seeLessText={' '}
              numberOfLines={4}
              linkStyle={styles.textContentFeed}>
              {message}
            </SeeMore>
            <Gap height={16} />
            <FlatList
              style={styles.fletlist}
              horizontal={true}
              pagingEnabled={true}
              data={images_url}
              renderItem={({ item, index }) => {
                return (
                  <Image
                    source={{ uri: item }}
                    style={styles.imageList}
                    resizeMode={'cover'}
                  />
                );
              }}
              keyExtractor={({ item, index }) => index}
            />
          </View>
        ) : (
          <View style={styles.containerShowMessage}>
            {handleTextCaption(message, onPress)}

            <View style={styles.pollOptionsContainer}>
              {polls.map((pollItem, index) => {
                /*
                  TODO : Count percentage
                */

                return multiplechoice ? (
                  <PollOptionsMultipleChoice
                    key={index}
                    item={pollItem}
                    index={index}
                    mypoll={item?.mypolling}
                    selectedindex={multipleChoiceSelected}
                    onselected={(indexes) => {
                      setMultipleChoiceSelected(indexes);
                    }}
                    isexpired={isPollExpired(pollexpiredat)}
                    isalreadypolling={isAlreadyPolling}
                    maxpolls={modifiedPoll.maxId}
                    total={modifiedPoll.totalpoll}
                  />
                ) : (
                  <PollOptions
                    key={index}
                    poll={pollItem}
                    mypoll={item?.mypolling}
                    index={index}
                    selectedindex={singleChoiceSelectedIndex}
                    total={modifiedPoll.totalpoll}
                    maxpolls={modifiedPoll.maxId}
                    isexpired={isPollExpired(pollexpiredat)}
                    isalreadypolling={isAlreadyPolling}
                    onselected={(index) => setSingleChoiceSelectedIndex(index)}
                  />
                );
              })}
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

              {showSetResultsButton() && (
                <View style={styles.seeresultscontainer}>
                  <TouchableOpacity onPress={onSeeResultsClicked}>
                    <Text style={styles.seeresultstext}>
                      {isFetchingResultPoll ? 'Loading...' : 'See Results'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )
      ) : null}
    </Pressable>
  );
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
  containerShowMessage: { justifyContent: 'center', flex: 1 },
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
    marginTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: COLORS.white,
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
    marginTop: 16,
    marginBottom: 8,
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
  percentageBar: (percent) => {
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
      backgroundColor: colors.bondi_blue,
    };
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
  textMedia: (text) => {
    return {
      fontFamily: fonts.inter[400],
      fontWeight: 'normal',
      fontSize: FONT_SIZE_MEDIA,
      color: colors.black,
      lineHeight: 24,
    };
  },

  seemore: {
    color: COLORS.blue,
  },
});
