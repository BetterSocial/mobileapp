import * as React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import SeeMore from 'react-native-see-more-inline';

import {inputSingleChoicePoll} from '../../service/post';
import {getPollTime, isPollExpired} from '../../utils/string/StringUtils';
import Gap from '../../components/Gap';
import PollOptions from '../../components/PollOptions';
import PollOptionsMultipleChoice from '../../components/PollOptionsMultipleChoice';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';

const {width: screenWidth} = Dimensions.get('window');

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
}) => {
  let totalPollCount = polls.reduce((acc, current) => {
    return acc + parseInt(current.counter);
  }, 0);

  console.log(polls);

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
    // setIsFetchingResultPoll(true);
    let newPolls = [...polls];
    let newItem = {...item};

    if (multiplechoice) {
      if (multipleChoiceSelected.length === 0) {
        return;
      }
      setIsAlreadyPolling(true);
      let selectedPolls = [];
      for (let i = 0; i < multipleChoiceSelected.length; i++) {
        let changedPollIndex = multipleChoiceSelected[i];
        let selectedPoll = polls[changedPollIndex];
        newPolls[changedPollIndex].counter = parseInt(selectedPoll.counter) + 1;
        selectedPolls.push(selectedPoll);
        inputSingleChoicePoll(
          selectedPoll.polling_id,
          selectedPoll.polling_option_id,
        );
      }
      newItem.isalreadypolling = true;
      newItem.refreshtoken = new Date().valueOf();
      newItem.pollOptions = newPolls;
      newItem.mypolling = selectedPolls;
      onnewpollfetched(newItem, index);
      setIsAlreadyPolling(true);
    } else {
      if (singleChoiceSelectedIndex === -1) {
        return;
      }
      let selectedPoll = polls[singleChoiceSelectedIndex];
      newPolls[singleChoiceSelectedIndex].counter =
        parseInt(selectedPoll.counter) + 1;
      newItem.isalreadypolling = true;
      newItem.refreshtoken = new Date().valueOf();
      newItem.pollOptions = newPolls;
      newItem.mypolling = selectedPoll;
      onnewpollfetched(newItem, index);
      setIsAlreadyPolling(true);
      inputSingleChoicePoll(
        selectedPoll.polling_id,
        selectedPoll.polling_option_id,
      );
    }
  };

  let showSetResultsButton = () => {
    return !isPollExpired(pollexpiredat) && !isAlreadyPolling;
  };

  return (
    <TouchableOpacity
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
              renderItem={({item, index}) => {
                return (
                  <Image
                    source={{uri: item}}
                    style={styles.imageList}
                    resizeMode={'cover'}
                  />
                );
              }}
              keyExtractor={({item, index}) => index}
            />
          </View>
        ) : (
          <View style={styles.containerShowMessage}>
            <SeeMore numberOfLines={10} linkStyle={styles.textContentFeed}>
              {`${message}`}
            </SeeMore>

            <View style={styles.pollOptionsContainer}>
              {polls.map((pollItem, index) => {
                /*
                  TODO : Count percentage
                */

                return multiplechoice ? (
                  <PollOptionsMultipleChoice
                    item={pollItem}
                    index={index}
                    mypoll={item?.mypolling}
                    selectedindex={multipleChoiceSelected}
                    onselected={(indexes) => {
                      setMultipleChoiceSelected(indexes);
                    }}
                    isexpired={isPollExpired(pollexpiredat)}
                    isalreadypolling={isAlreadyPolling}
                    total={totalPollCount}
                  />
                ) : (
                  <PollOptions
                    poll={pollItem}
                    mypoll={item?.mypolling}
                    index={index}
                    selectedindex={singleChoiceSelectedIndex}
                    total={totalPollCount}
                    isexpired={isPollExpired(pollexpiredat)}
                    isalreadypolling={isAlreadyPolling}
                    onselected={(index) => setSingleChoiceSelectedIndex(index)}
                  />
                );
              })}
            </View>

            <View style={styles.totalVotesContainer}>
              <Text
                style={styles.totalpolltext}>{`${totalPollCount} votes `}</Text>
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
    </TouchableOpacity>
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
  fletlist: {flex: 1},
  containerShowMessage: {justifyContent: 'center', flex: 1},
  imageList: {flex: 1, width: screenWidth - 32, borderRadius: 16},
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
    marginBottom: Platform.select({ios: 0, android: 1}),
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
});
