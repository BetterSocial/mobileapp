import * as React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

import CustomPressable from '../../components/CustomPressable';
import ListTopic from './ListTopics';
import StringConstant from '../../utils/string/StringConstant';
import {Button} from '../../components/Button';
import {COLORS} from '../../utils/theme';
import {Header} from '../../components';
import {ProgressBar} from '../../components/ProgressBar';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';
import useOnBoardingTopics from './hooks/useOnBoardingTopics';

const {width} = Dimensions.get('screen');

const Topics = () => {
  const {
    topicSelected,
    topics,
    setTopics,
    minTopic,
    myTopic,
    isPreload,
    isFetchingTopic,
    isTopicFetchError,
    topicCollection,
    getCacheTopic,
    handleSelectedLanguage,
    next,
    onBack,
    keyExtractor,
    getTopicsData
  } = useOnBoardingTopics();

  React.useEffect(() => {
    // console.log(topicCollection, 'lusi')
    if (topicCollection.length > 0) {
      setTopics(topicCollection);
    }
  }, [JSON.stringify(topicCollection)]);
  React.useEffect(() => {
    getCacheTopic();
  }, []);

  const renderListTopics = ({item, i}) => (
    <ListTopic
      item={item}
      i={i}
      myTopic={myTopic}
      handleSelectedLanguage={handleSelectedLanguage}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {isPreload ? null : (
        <React.Fragment>
          <Header onPress={onBack} />
          <View style={styles.containerProgress}>
            <ProgressBar isStatic={true} value={75} />
          </View>
          <View>
            <Text style={styles.textPickYourTopic}>{StringConstant.onboardingTopicsHeadline}</Text>
            <Text style={styles.textGetPersonalContent}>
              {StringConstant.onboardingTopicsSubHeadline}
            </Text>
          </View>

          {topics?.length > 0 && (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollViewStyle}>
              {topics
                ? topics.map((topic, index) => (
                    <View key={index} style={styles.containerTopic}>
                      <Text style={styles.title}>{topic.name}</Text>
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        style={styles.scrollButtonParent}
                        contentContainerStyle={styles.containerContent}
                        nestedScrollEnabled>
                        <FlatList
                          data={topic.data}
                          renderItem={renderListTopics}
                          numColumns={Math.floor(topic.data.length / 3) + 1}
                          nestedScrollEnabled
                          scrollEnabled={false}
                          extraData={topicSelected}
                          maxToRenderPerBatch={2}
                          updateCellsBatchingPeriod={10}
                          removeClippedSubviews
                          windowSize={10}
                          keyExtractor={keyExtractor}
                        />
                      </ScrollView>
                    </View>
                  ))
                : null}
            </ScrollView>
          )}

          {topics?.length === 0 && !isTopicFetchError && !isFetchingTopic && (
            <View style={styles.reloadTopicButtonContainer}>
              <CustomPressable onPress={getTopicsData}>
                <Text style={styles.reloadTopicButton}>
                  {'Something went wrong. \n\n Tap to reload'}
                </Text>
              </CustomPressable>
            </View>
          )}

          <View style={styles.footer}>
            <Text
              style={styles.textSmall}>{`${StringConstant.onboardingTopicsOthersCannotSee}`}</Text>
            <Button
              onPress={() => next()}
              disabled={!(topicSelected.length >= minTopic)}
              style={topicSelected.length >= minTopic ? null : styles.button}>
              {topicSelected.length >= minTopic
                ? StringConstant.onboardingTopicsButtonStateNext
                : StringConstant.onboardingTopicsButtonStateChooseMore(
                    minTopic - topicSelected.length
                  )}
            </Button>
          </View>
        </React.Fragment>
      )}

      {isFetchingTopic && <ActivityIndicator size={'large'} color={colors.gray} />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  scrollViewStyle: {marginBottom: 100},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 22 : 0,
    backgroundColor: colors.white
  },
  containerProgress: {
    marginTop: 36,
    marginBottom: 24,
    paddingHorizontal: 22
  },
  textPickYourTopic: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 36,
    lineHeight: 44,
    color: colors.bunting,
    paddingHorizontal: 22
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: 112,
    width,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  textGetPersonalContent: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 14,
    color: colors.gray,
    opacity: 0.84,
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 22
  },
  containerTopic: {
    flexDirection: 'column',
    marginBottom: 32
  },
  title: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 22,
    color: colors.black,
    marginBottom: 13,
    // textTransform: 'capitalize',
    paddingHorizontal: 22
  },
  listTopic: {
    flexDirection: 'column',
    marginBottom: 8,
    paddingRight: 8
  },

  bgTopicSelectActive: {
    backgroundColor: colors.bondi_blue,
    // minWidth: 100,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 14,
    flexDirection: 'row',
    // justifyContent: 'center',
    marginRight: 8,
    marginBottom: 10,
    alignItems: 'center'
    // alignItems: 'center',
  },

  bgTopicSelectNotActive: {
    backgroundColor: colors.concrete,
    // minWidth: 100,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 14,
    flexDirection: 'row',
    // justifyContent: 'center',
    marginRight: 8,
    marginBottom: 10,
    alignItems: 'center'
  },
  textTopicActive: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: colors.white
    // paddingLeft: 5,
  },
  textTopicNotActive: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: colors.mine_shaft
    // paddingLeft: 5,
  },
  textSmall: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 10,
    textAlign: 'center',
    color: colors.emperor,
    marginBottom: 10,
    marginTop: 10
  },
  button: {
    backgroundColor: colors.gray
  },
  scrollButtonParent: {
    paddingHorizontal: 22
  },
  containerContent: {
    paddingRight: 20
  },
  reloadTopicButtonContainer: {
    marginTop: 60
  },
  reloadTopicButton: {
    textAlign: 'center',
    fontFamily: fonts.inter[600],
    color: COLORS.blue,
    textDecorationLine: 'underline'
  }
});
export default React.memo(Topics);
