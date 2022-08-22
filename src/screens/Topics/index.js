import * as React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Pressable
} from 'react-native';

import {useNavigation} from '@react-navigation/core';
import analytics from '@react-native-firebase/analytics';

import {get} from '../../api/server';
import {Button} from '../../components/Button';
import {Context} from '../../context';
import {colors} from '../../utils/colors';
import {ProgressBar} from '../../components/ProgressBar';
import StringConstant from '../../utils/string/StringConstant';
import {setTopics as setTopicsContext} from '../../context/actions/topics';
import { Header } from '../../components';

const {width} = Dimensions.get('screen');

const Topics = () => {
  const navigation = useNavigation();
  const [topicSelected, setTopicSelected] = React.useState([]);
  const [topics, setTopics] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [minTopic] = React.useState(3);
  const [, dispatch] = React.useContext(Context).topics;
  const [myTopic, setMyTopic] = React.useState({});

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'Topics',
      screen_name: 'onb_select_topics',
    });

    setIsLoading(true);
    get({url: '/topics/list'})
      .then((res) => {
        setIsLoading(false);
        if (res.status === 200) {
          topicMapping(res.data.body)
          // setTopics(res.data.body);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const topicMapping = (data) => {
    const allTopics = []
    if(data && typeof data ==='object') {
      // eslint-disable-next-line array-callback-return
      Object.keys(data).map((attribute) => {
        allTopics.push({name: attribute, data: data[attribute].map((att) => ({topic_id: att.topic_id, name: att.name}))})
      })
    }
    setTopics(allTopics)
  }

  const handleSelectedLanguage = (val) => {
    if(!myTopic[val]) {
      setMyTopic({...myTopic, [val]: val})
    } else {
      setMyTopic({...myTopic, [val]: null})
    }
    let copyTopicSelected = [...topicSelected];
    const index = copyTopicSelected.findIndex((data) => data === val);
    if (index > -1) {
      copyTopicSelected = copyTopicSelected.filter((data) => data !== val)
    } else {
      copyTopicSelected.push(val);
    }
    setTopicSelected(copyTopicSelected);
  }

  const next = () => {
    if (topicSelected.length >= minTopic) {
      analytics().logEvent('onb_select_topics_add_btn', {
        onb_topics_selected: topicSelected,
      });
      setTopicsContext(topicSelected, dispatch);
      navigation.navigate('WhotoFollow');
    }
  };



  const renderListTopics = ({item, i}) => {
    const onPress = React.useCallback(() => handleSelectedLanguage(item.topic_id), [topicSelected]);
    return (
      <Pressable
        onPress={onPress}
        key={i}
        style={
          [styles.bgTopicSelectNotActive, { backgroundColor: myTopic[item.topic_id] ? colors.bondi_blue : colors.concrete }]
        }
      >
        <Text>{item.icon}</Text>
        <Text
          style={
            [styles.textTopicNotActive, { color: myTopic[item.topic_id] ? colors.white : colors.mine_shaft }]
          }>#{item.name}</Text>
      </Pressable>
    );
  }

  const onBack = () => {
    navigation.goBack()
  }

  const keyExtractor = React.useCallback((item ,index) => index.toString(), [])

  return (
    <SafeAreaView style={styles.container}>
      <Header onPress={onBack} />
      <View style={styles.containerProgress}>
        <ProgressBar isStatic={true} value={75} />
      </View>
      <View>
        <Text style={styles.textPickYourTopic}>
          {StringConstant.onboardingTopicsHeadline}
        </Text>
        <Text style={styles.textGetPersonalContent}>
          {StringConstant.onboardingTopicsSubHeadline}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollViewStyle}>
        {isLoading ? <ActivityIndicator size="small" color="#0000ff" /> : null}
        {topics ? topics.map((topic, index) => (
          <View key={index} style={styles.containerTopic}>
          <Text style={styles.title}>{topic.name}</Text>
          <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={styles.scrollButtonParent}
          contentContainerStyle={styles.containerContent}
          nestedScrollEnabled
          >
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
        )) : null}
      </ScrollView>
      <View style={styles.footer}>
        <Text
          style={
            styles.textSmall
          }>{`${StringConstant.onboardingTopicsOthersCannotSee}`}</Text>
        <Button
          onPress={() => next()}
          disabled={!(topicSelected.length >= minTopic)}
          style={topicSelected.length >= minTopic ? null : styles.button}>
          {topicSelected.length >= minTopic
            ? StringConstant.onboardingTopicsButtonStateNext
            : StringConstant.onboardingTopicsButtonStateChooseMore(
                minTopic - topicSelected.length,
              )}
        </Button>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  scrollViewStyle: {marginBottom: 100},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 22 : 0,
    backgroundColor: colors.white,
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
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,

    elevation: 11,
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    marginBottom: 32,
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
    paddingRight: 8,

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
    color: colors.white,
    // paddingLeft: 5,
  },
  textTopicNotActive: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: colors.mine_shaft,
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
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.gray,
  },
  scrollButtonParent: {
    paddingHorizontal: 22,
  },
  containerContent: {
    paddingRight: 20
  }
});
export default React.memo (Topics);
