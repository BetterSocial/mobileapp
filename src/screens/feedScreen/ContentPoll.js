import React from 'react';
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

import SeeMore from 'react-native-see-more-inline';
import {ParallaxImage} from 'react-native-snap-carousel';

import Gap from '../../components/Gap';
import PollOptions from '../../components/PollOptions';
import {colors} from '../../utils/colors';
import {fonts} from '../../utils/fonts';

const {width: screenWidth} = Dimensions.get('window');

const _renderItem = ({item, index}, parallaxProps) => {
  return (
    <View key={index} style={styles.item}>
      <ParallaxImage
        source={{uri: item}}
        containerStyle={styles.imageContainer}
        style={styles.image}
        parallaxFactor={0.4}
        {...parallaxProps}
      />
    </View>
  );
};

const ContentPoll = ({message, images_url, polls = [], onPress}) => {
  let totalPollCount = polls.reduce((acc, current) => {
    return acc + parseInt(current.counter);
  }, 0);

  return (
    <TouchableOpacity onPress={onPress} style={styles.contentFeed}>
      {images_url !== null ? (
        images_url.length > 0 ? (
          <View
            style={{
              flex: 1,
              paddingBottom: 16,
            }}>
            <SeeMore
              seeLessText={' '}
              numberOfLines={4}
              linkStyle={styles.textContentFeed}>
              {message}
            </SeeMore>
            <Gap height={16} />
            <FlatList
              style={{flex: 1}}
              horizontal={true}
              pagingEnabled={true}
              data={images_url}
              renderItem={({item, index}) => {
                return (
                  <Image
                    source={{uri: item}}
                    style={{flex: 1, width: screenWidth - 32, borderRadius: 16}}
                    resizeMode={'cover'}
                  />
                );
              }}
              keyExtractor={({item, index}) => index}
            />
          </View>
        ) : (
          <View style={{justifyContent: 'center', flex: 1}}>
            <SeeMore numberOfLines={10} linkStyle={styles.textContentFeed}>
              {`${message}`}
            </SeeMore>

            <View style={styles.pollOptionsContainer}>
              {polls.map((item, index) => {
                /*
                  TODO : Count percentage
                */

                return (
                  <PollOptions
                    item={item}
                    index={index}
                    total={totalPollCount}
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
              <Text style={styles.totalpolltext}>
                {' 24 hours 34 minutes left'}
              </Text>
            </View>
          </View>
        )
      ) : null}
    </TouchableOpacity>
  );
};

export default ContentPoll;

const styles = StyleSheet.create({
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
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
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
    // borderColor : 'red',
    // borderWidth : 4,
    width: '100%',
    padding: 0,
    marginTop: 16,
    marginBottom: 8,
  },
  pollOptionItemContainer: {
    // borderColor : colors.holytosca,
    backgroundColor: colors.lightgrey,
    // borderWidth : 1.25,
    marginBottom: 8,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'row',
  },
  pollOptionItemContainerActive: {
    // borderColor : colors.holytosca,
    backgroundColor: colors.holytosca30percent,
    // borderWidth : 1.25,
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
    // backgroundColor : 'red'
  },
  pollOptionItemPercentage: {
    // backgroundColor : 'red'
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
  },
});
