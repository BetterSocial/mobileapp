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
import {fonts} from '../../utils/fonts';
import {getSpecificCache} from '../../utils/cache';
import {setTopics as setTopicsContext} from '../../context/actions/topics';

const {width} = Dimensions.get('screen');

const Topics = () => {
  const navigation = useNavigation();
  const [topicSelected, setTopicSelected] = React.useState([]);
  const [topics, setTopics] = React.useState([]);
  const [minTopic] = React.useState(3);
  const [, dispatch] = React.useContext(Context).topics;
  const [myTopic, setMyTopic] = React.useState({});
  const [isPreload, setIspreload] = React.useState(true);

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
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 20
  },
  textPickYourTopic: {
    fontFamily: 'Inter-Bold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 36,
    lineHeight: 43.57,
    color: '#11243D',
    marginHorizontal: 20
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
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
    color: colors.gray,
    opacity: 0.84,
    marginTop: 8,
    marginBottom: 24,
    paddingHorizontal: 20
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
  textSmallContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  textSmall: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 10,
    textAlign: 'center',
    color: colors.blackgrey
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
