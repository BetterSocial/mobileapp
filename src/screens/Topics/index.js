import React, {useContext, useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {get} from '../../api/server';
import MyStatusBar from '../../components/StatusBar';
import {Button} from '../../components/Button';
import {ProgressBar} from '../../components/ProgressBar';
import {ChunkArray} from '../../helpers/ChunkArray';
import ArrowLeftIcon from '../../../assets/icons/arrow-left.svg';
import {Context} from '../../context';
import {setTopics as setTopicsContext} from '../../context/actions/topics';
import {useNavigation} from '@react-navigation/core';
import {colors} from '../../utils/colors';
import analytics from '@react-native-firebase/analytics';

const width = Dimensions.get('screen').width;

const Topics = () => {
  const navigation = useNavigation();
  const [topicSelected, setTopicSelected] = useState([]);
  const [topics, setTopics] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [minTopic] = useState(3);
  const [, dispatch] = useContext(Context).topics;

  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'Topics',
      screen_name: 'onb_select_topics',
    });
    setIsLoading(true);
    get({url: '/topics/list'})
      .then((res) => {
        setIsLoading(false);
        if (res.status == 200) {
          setTopics(res.data.body);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  const renderHeader = () => {
    if (Platform.OS === 'android') {
      return (
        <View style={styles.header}>
          <TouchableNativeFeedback>
            <ArrowLeftIcon width={20} height={12} fill="#000" />
          </TouchableNativeFeedback>
        </View>
      );
    } else {
      return (
        <View style={styles.header}>
          <TouchableHighlight>
            <ArrowLeftIcon width={20} height={12} fill="#000" />
          </TouchableHighlight>
          <TouchableNativeFeedback>
            <Text style={styles.textSkip}>Skip</Text>
          </TouchableNativeFeedback>
        </View>
      );
    }
  };

  const handleSelectedLanguage = (val) => {
    let copytopicSelected = [...topicSelected];
    let index = copytopicSelected.findIndex((data) => data === val);
    if (index > -1) {
      copytopicSelected.splice(index, 1);
    } else {
      copytopicSelected.push(val);
    }
    setTopicSelected(copytopicSelected);
  };
  const next = () => {
    if (topicSelected.length >= minTopic) {
      analytics().logEvent('onb_select_topics_add_btn', {
        onb_topics_selected: topicSelected,
      });
      setTopicsContext(topicSelected, dispatch);
      navigation.navigate('WhotoFollow');
    }
  };

  return (
    <>
      <MyStatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.containerProgress}>
          <ProgressBar isStatic={true} value={75} />
        </View>
        <View>
          <Text style={styles.textPickYourTopic}>
            Pick your topics of interest
          </Text>
          <Text style={styles.textGetPersonalContent}>
            Find like-minded people
          </Text>
        </View>

        <ScrollView style={{marginBottom: 100}}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null}
          {topics !== undefined
            ? Object.keys(topics).map((attribute, index) => {
                return (
                  <View key={index} style={styles.containerTopic}>
                    <Text style={styles.title}>{attribute}</Text>
                    <View>
                      {ChunkArray(topics[attribute], 4).map((val, idx) => {
                        return (
                          <ScrollView
                            key={idx}
                            style={styles.listTopic}
                            horizontal={true}>
                            {val.map((value, i) => {
                              return (
                                <TouchableOpacity
                                  onPress={() =>
                                    handleSelectedLanguage(value.topic_id)
                                  }
                                  key={i}
                                  style={
                                    topicSelected.findIndex(
                                      (data) => data === value.topic_id,
                                    ) > -1
                                      ? styles.bgTopicSelectActive
                                      : styles.bgTopicSelectNotActive
                                  }>
                                  <Text>{value.icon}</Text>
                                  <Text
                                    style={
                                      topicSelected.findIndex(
                                        (data) => data === value.topic_id,
                                      ) > -1
                                        ? styles.textTopicActive
                                        : styles.textTopicNotActive
                                    }>
                                    {value.name}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>
                        );
                      })}
                    </View>
                  </View>
                );
              })
            : null}
        </ScrollView>
        <View style={styles.footer}>
          <Text style={styles.textSmall}>
            You can add and remove interests later
          </Text>
          <Button
            onPress={() => next()}
            disabled={topicSelected.length >= minTopic ? false : true}
            style={topicSelected.length >= minTopic ? null : styles.button}>
            {topicSelected.length >= minTopic
              ? 'NEXT'
              : `CHOOSE ${minTopic - topicSelected.length} MORE`}
          </Button>
        </View>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 22,
    backgroundColor: colors.white,
  },
  containerProgress: {
    marginTop: 36,
    marginBottom: 24,
  },
  textPickYourTopic: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 36,
    lineHeight: 44,
    color: colors.bunting,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    height: 112,
    width: width,
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
    textTransform: 'capitalize',
  },
  listTopic: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  bgTopicSelectActive: {
    backgroundColor: colors.bondi_blue,
    minWidth: 100,
    height: 28,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 8,
  },

  bgTopicSelectNotActive: {
    backgroundColor: colors.concrete,
    minWidth: 100,
    height: 28,
    paddingLeft: 18,
    paddingRight: 18,
    paddingTop: 6,
    paddingBottom: 6,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 8,
  },
  textTopicActive: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: colors.white,
    paddingLeft: 5,
    textTransform: 'capitalize',
  },
  textTopicNotActive: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 12,
    color: colors.mine_shaft,
    paddingLeft: 5,
    textTransform: 'capitalize',
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
});
export default Topics;
