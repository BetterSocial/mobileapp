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
import {useNavigation} from '@react-navigation/core';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomPressable from '../../components/CustomPressable';
import ListTopic from './ListTopics';
import StringConstant from '../../utils/string/StringConstant';
import useSignin from '../SignInV2/hooks/useSignin';
import {Analytics} from '../../libraries/analytics/firebaseAnalytics';
import {Button} from '../../components/Button';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {Header} from '../../components';
import {ProgressBar} from '../../components/ProgressBar';
import {TOPICS_PICK} from '../../utils/cache/constant';
import {colors} from '../../utils/colors';
import {fonts, normalizeFontSize} from '../../utils/fonts';
import {getSpecificCache} from '../../utils/cache';
import {setTopics as setTopicsContext} from '../../context/actions/topics';
import dimen from '../../utils/dimen';

const {width} = Dimensions.get('screen');

const Topics = () => {
  const navigation = useNavigation();
  const [topicSelected, setTopicSelected] = React.useState([]);
  const [topics, setTopics] = React.useState([]);
  const [minTopic] = React.useState(3);
  const [, dispatch] = React.useContext(Context).topics;
  const [myTopic, setMyTopic] = React.useState({});
  const [isPreload, setIspreload] = React.useState(true);
  const {bottom} = useSafeAreaInsets();

  const {isFetchingTopic, isTopicFetchError, getTopicsData, topicCollection} = useSignin();
  const getCacheTopic = async () => {
    getSpecificCache(TOPICS_PICK, (cache) => {
      if (cache) {
        setTopics(cache);
        setIspreload(false);
      } else {
        getTopicsData();
        setIspreload(false);
      }
    });
  };
  React.useEffect(() => {
    // console.log(topicCollection, 'lusi')
    if (topicCollection.length > 0) {
      setTopics(topicCollection);
    }
  }, [JSON.stringify(topicCollection)]);
  React.useEffect(() => {
    getCacheTopic();
  }, []);

  const handleSelectedLanguage = React.useCallback(
    (val) => {
      if (!myTopic[val]) {
        setMyTopic({...myTopic, [val]: val});
      } else {
        setMyTopic({...myTopic, [val]: null});
      }
      let copytopicSelected = [...topicSelected];
      const index = copytopicSelected.findIndex((data) => data === val);
      if (index > -1) {
        copytopicSelected = copytopicSelected.filter((data) => data !== val);
      } else {
        copytopicSelected.push(val);
      }
      setTopicSelected(copytopicSelected);
    },
    [topicSelected]
  );

  const next = () => {
    if (topicSelected.length >= minTopic) {
      Analytics.logEvent('onb_select_topics_add_btn', {
        onb_topics_selected: topicSelected
      });
      setTopicsContext(topicSelected, dispatch);
      navigation.navigate('WhotoFollow');
    }
  };

  const renderListTopics = ({item, i}) => (
    <ListTopic
      item={item}
      i={i}
      myTopic={myTopic}
      handleSelectedLanguage={handleSelectedLanguage}
    />
  );
  const onBack = () => {
    navigation.goBack();
  };

  const keyExtractor = React.useCallback((item, index) => index.toString(), []);

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
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollViewStyle(bottom)}>
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
            <View style={styles.textSmallContainer}>
              <Text
                style={
                  styles.textSmall
                }>{`${StringConstant.onboardingTopicsOthersCannotSee}`}</Text>
            </View>
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
  scrollViewStyle: (bottom) => ({
    marginBottom: dimen.normalizeDimen(100) - bottom
  }),
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    padding: Platform.OS === 'ios' ? dimen.normalizeDimen(22) : 0,
    backgroundColor: colors.white
  },
  containerProgress: {
    marginTop: dimen.normalizeDimen(20),
    marginBottom: dimen.normalizeDimen(24),
    paddingHorizontal: dimen.normalizeDimen(20)
  },
  textPickYourTopic: {
    fontFamily: 'Inter-Bold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: normalizeFontSize(36),
    lineHeight: normalizeFontSize(43.57),
    color: '#11243D',
    marginHorizontal: dimen.normalizeDimen(20)
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: dimen.normalizeDimen(112),
    width,
    paddingHorizontal: dimen.normalizeDimen(20),
    paddingBottom: dimen.normalizeDimen(20),
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
    fontWeight: '400',
    fontSize: normalizeFontSize(14),
    lineHeight: normalizeFontSize(24),
    color: colors.gray,
    opacity: 0.84,
    marginTop: dimen.normalizeDimen(8),
    marginBottom: dimen.normalizeDimen(24),
    paddingHorizontal: dimen.normalizeDimen(20)
  },
  containerTopic: {
    flexDirection: 'column',
    marginBottom: dimen.normalizeDimen(32)
  },
  title: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: normalizeFontSize(18),
    lineHeight: normalizeFontSize(22),
    color: colors.black,
    marginBottom: dimen.normalizeDimen(13),
    // textTransform: 'capitalize',
    paddingHorizontal: dimen.normalizeDimen(22)
  },
  listTopic: {
    flexDirection: 'column',
    marginBottom: dimen.normalizeDimen(8),
    paddingRight: dimen.normalizeDimen(8)
  },

  textSmallContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  textSmall: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: normalizeFontSize(10),
    textAlign: 'center',
    color: colors.blackgrey
  },
  button: {
    backgroundColor: colors.gray,
    borderRadius: dimen.normalizeDimen(8)
  },
  scrollButtonParent: {
    paddingHorizontal: dimen.normalizeDimen(22)
  },
  containerContent: {
    paddingRight: dimen.normalizeDimen(20)
  },
  reloadTopicButtonContainer: {
    marginTop: dimen.normalizeDimen(60)
  },
  reloadTopicButton: {
    textAlign: 'center',
    fontFamily: fonts.inter[600],
    color: COLORS.blue,
    textDecorationLine: 'underline'
  }
});
export default React.memo(Topics);
